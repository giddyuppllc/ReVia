export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body as { email?: string; source?: string };
    // The welcome popup trades an email for the WELCOME10 first-order code, so an
    // address we already hold is not an error there — it still gets the code.
    const fromWelcomePopup = source === "welcome-popup";

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing && !fromWelcomePopup) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    const address = email.toLowerCase().trim();

    if (!existing) {
      await prisma.newsletter.create({ data: { email: address } });
    }

    // Send newsletter welcome email
    try {
      const { sendNewsletterWelcome, sendWelcomeDiscount } = await import("@/lib/email");
      if (fromWelcomePopup) {
        await sendWelcomeDiscount(address);
      } else {
        await sendNewsletterWelcome(address);
      }
    } catch (emailErr) {
      console.error("Failed to send newsletter welcome:", emailErr);
    }

    return NextResponse.json(
      fromWelcomePopup ? { success: true, code: "WELCOME10" } : { success: true }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
