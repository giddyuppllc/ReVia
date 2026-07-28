import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/welcome-offer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unsubscribe | ReVia",
  robots: { index: false, follow: false },
};

// Landing page for the unsubscribe link in ReVia emails. Removing the address on
// load (rather than behind a confirm button) is what mail clients and one-click
// unsubscribe expect — the link is signed, so it can only remove its own address.
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { e?: string; t?: string };
}) {
  const email = (searchParams.e || "").toLowerCase().trim();
  const token = searchParams.t || "";
  const valid = Boolean(email) && verifyUnsubscribeToken(email, token);

  if (valid) {
    await prisma.newsletter.deleteMany({ where: { email } });
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="font-serif text-3xl text-[#3D3229]">
        {valid ? "You're unsubscribed" : "Link not recognised"}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        {valid ? (
          <>
            <span className="font-medium text-[#3D3229]">{email}</span> has been removed from the
            ReVia mailing list. Order and shipping notices for purchases you make will still be
            sent — those aren&apos;t marketing.
          </>
        ) : (
          <>
            That unsubscribe link is incomplete or has been altered. Email{" "}
            <a className="underline" href="mailto:contact@revialife.com">
              contact@revialife.com
            </a>{" "}
            and we&apos;ll take care of it.
          </>
        )}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-[#3D3229] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2c241e]"
      >
        Back to ReVia
      </Link>
    </main>
  );
}
