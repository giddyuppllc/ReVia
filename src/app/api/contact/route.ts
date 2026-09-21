export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { notifyTeam } from "@/lib/notify";
import { sendContactAutoReply } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

/**
 * The enquiry form.
 *
 * This used to write a `ContactMessage` row and then attempt an auto-reply
 * inside a catch that logged and carried on. With no database the ordering has
 * to invert: the notification to the team is the record, so it is awaited and
 * allowed to fail the request, and the auto-reply to the sender — a courtesy —
 * is the part that may fail quietly. Getting this backwards would accept a
 * message, tell the sender it arrived, and deliver it nowhere.
 *
 * ## Why the validation below is not paperwork
 *
 * `sendContactAutoReply` mails the address supplied in the body, and until now
 * that address arrived unvalidated, unthrottled and uncapped, with the name and
 * subject interpolated into the HTML unescaped. An attacker therefore chose the
 * recipient AND the markup, and the message left from the Resend-verified
 * revialife.com identity at whatever rate they liked — a phishing relay wearing
 * this brand's return address.
 *
 * The escaping is fixed in src/lib/email.ts. The rest is here: a real address
 * check, length caps, and rate limits on the sender's IP and on the recipient.
 * The recipient limit is the one that closes the abuse — rotating source IPs is
 * cheap, but the point of the attack is to mail one victim repeatedly.
 */

/** Long enough for a real enquiry, short enough to not be a payload. */
const LIMITS = { name: 120, subject: 200, message: 5000 } as const;

/** Same shape as src/lib/validation.ts on the commerce side. */
function validEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v) && v.length <= 254;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const raw = (body ?? {}) as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  const subject = typeof raw.subject === "string" ? raw.subject.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ error: "That email address is not valid" }, { status: 400 });
  }
  if (
    name.length > LIMITS.name ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ error: "That message is too long" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(`contact:ip:${ip}`, 5, 60 * 60 * 1000).success) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }
  if (!rateLimit(`contact:to:${email}`, 3, 60 * 60 * 1000).success) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  try {
    await notifyTeam(`Enquiry: ${subject}`, { Name: name, Email: email, Subject: subject, Message: message }, { replyTo: email });
  } catch (err) {
    console.error("contact: could not deliver the enquiry", err);
    return NextResponse.json(
      { error: "We could not deliver your message. Please email contact@revialife.com directly." },
      { status: 500 },
    );
  }

  try {
    await sendContactAutoReply(name, email, subject);
  } catch (err) {
    // The message is already with the team; a failed receipt does not lose it.
    console.error("contact: auto-reply failed", err);
  }

  return NextResponse.json({ success: true });
}
