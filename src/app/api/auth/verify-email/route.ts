export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTokenCandidates } from "@/lib/verify-token";

export async function GET(request: NextRequest) {
  // Behind nginx, request.url carries the origin the proxy dialled
  // (localhost:3000), so redirects built from it send the visitor nowhere.
  // The public origin is the only safe base here.
  const base = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  const page = (status: string) =>
    NextResponse.redirect(new URL(`/verify-email?status=${status}`, base));

  try {
    // Some mail clients corrupt the "?token=" separator in transit, so the
    // token is recovered from the raw query rather than read straight off
    // searchParams. Candidates are guesses until the database confirms one.
    const candidates = verifyTokenCandidates(request.nextUrl.search);

    if (candidates.length === 0) {
      return page("missing");
    }

    const user = await prisma.user.findFirst({
      where: { verifyToken: { in: candidates } },
    });

    if (!user) {
      return page("invalid");
    }

    if (user.emailVerified) {
      return page("already");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
    });

    // Redirect to account page with success message
    return NextResponse.redirect(new URL("/account?verified=true", base));
  } catch {
    return page("error");
  }
}
