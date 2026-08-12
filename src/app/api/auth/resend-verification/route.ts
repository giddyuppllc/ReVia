export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { validateEmail } from "@/lib/validation";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { success, remaining } = rateLimit(`resend-verify:${ip}`, 5, 15 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, name: true, email: true, emailVerified: true, verifyToken: true },
    });

    // Always answer the same way so this cannot be used to discover which
    // addresses have accounts.
    if (user && !user.emailVerified) {
      const token = user.verifyToken || crypto.randomBytes(32).toString("hex");
      if (!user.verifyToken) {
        await prisma.user.update({ where: { id: user.id }, data: { verifyToken: token } });
      }
      try {
        await sendVerificationEmail(user.name, user.email, token);
      } catch (err) {
        console.error("Failed to resend verification email:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
