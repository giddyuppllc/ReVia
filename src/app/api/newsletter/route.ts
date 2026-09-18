export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { subscribe } from "@/lib/audience";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter sign-up.
 *
 * ## What changed with the database
 *
 * The old route looked the address up first and returned 409 "already
 * subscribed". The list now lives in Resend, and re-adding a known address is
 * not a condition worth surfacing: it told people their own email was a
 * problem, and it leaked who is on the list to anyone willing to type addresses
 * into the form. Resend treats the second add as a no-op, so the answer is the
 * same either way.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { email, source } = (body ?? {}) as { email?: string; source?: string };

  if (!email || typeof email !== "string" || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const address = email.toLowerCase().trim();

  try {
    await subscribe(address, source || "site");
  } catch (err) {
    console.error("newsletter: could not record the address", err);
    return NextResponse.json(
      { error: "We could not add you just now. Please try again shortly." },
      { status: 500 },
    );
  }

  try {
    const { sendNewsletterWelcome } = await import("@/lib/email");
    await sendNewsletterWelcome(address);
  } catch (err) {
    // On the list is what matters; the welcome can be missed.
    console.error("newsletter: welcome email failed", err);
  }

  return NextResponse.json({ success: true });
}
