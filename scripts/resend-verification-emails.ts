/**
 * Re-send verification emails to accounts still holding an unverified token.
 *
 * Written for the 2026-08-12 incident: Outlook was eating the "=" in
 * "?token=" (quoted-printable escape), and every failure dead-ended on raw
 * JSON at localhost:3000. Both are fixed, so the links these accounts are
 * holding now work — but a fresh mail is friendlier than asking them to dig
 * one out of their archive.
 *
 * Reuses each account's EXISTING token, so this writes nothing to the
 * database.
 *
 *   npx tsx scripts/resend-verification-emails.ts          # dry run, lists only
 *   npx tsx scripts/resend-verification-emails.ts --send   # actually sends
 *
 * Pass --only a@b.com,c@d.com to restrict delivery to named addresses. The
 * 2026-08-12 run used this to skip internal test rows and accounts old
 * enough that an unprompted verification mail would read as phishing.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { sendVerificationEmail } from "../src/lib/email";

const send = process.argv.includes("--send");

const onlyArg = process.argv[process.argv.indexOf("--only") + 1];
const only =
  process.argv.includes("--only") && onlyArg
    ? new Set(onlyArg.split(",").map((e) => e.trim().toLowerCase()))
    : null;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const all = await prisma.user.findMany({
    where: { emailVerified: false, verifyToken: { not: null } },
    select: { id: true, name: true, email: true, verifyToken: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const users = only ? all.filter((u) => only.has(u.email.toLowerCase())) : all;

  console.log(
    `${all.length} account(s) unverified with a token outstanding` +
      (only ? `; ${users.length} selected by --only` : "") +
      "\n"
  );
  for (const u of users) {
    const age = Math.floor((Date.now() - u.createdAt.getTime()) / 86_400_000);
    console.log(
      `  ${u.email.padEnd(34)} ${u.name.padEnd(22)} signed up ${u.createdAt
        .toISOString()
        .slice(0, 10)} (${age}d ago)`
    );
  }

  if (!send) {
    console.log("\nDRY RUN — nothing sent. Re-run with --send to deliver.");
    return;
  }

  console.log("\nSending...\n");
  let ok = 0;
  let failed = 0;
  for (const u of users) {
    try {
      await sendVerificationEmail(u.name, u.email, u.verifyToken!);
      console.log(`  sent    ${u.email}`);
      ok++;
    } catch (err) {
      console.error(`  FAILED  ${u.email}: ${(err as Error).message}`);
      failed++;
    }
    // Stay well under Resend's rate limit.
    await new Promise((r) => setTimeout(r, 600));
  }
  console.log(`\n${ok} sent, ${failed} failed`);
}

main()
  .catch((e) => {
    console.error("ERR", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
