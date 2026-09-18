export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { notifyTeam } from "@/lib/notify";
import { sendContactAutoReply } from "@/lib/email";

/**
 * The enquiry form.
 *
 * This used to write a `ContactMessage` row and then attempt an auto-reply
 * inside a catch that logged and carried on. With no database the ordering has
 * to invert: the notification to the team is the record, so it is awaited and
 * allowed to fail the request, and the auto-reply to the sender — a courtesy —
 * is the part that may fail quietly. Getting this backwards would accept a
 * message, tell the sender it arrived, and deliver it nowhere.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, subject, message } = (body ?? {}) as Record<string, string>;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
