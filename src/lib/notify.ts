import { Resend } from "resend";

/**
 * Where a form submission durably lands, now that revialife has no database.
 *
 * ## Why this exists
 *
 * Every public form on this site used to do the same two things: write a row,
 * then try to send an email inside a `try {} catch {}` that swallowed the
 * error. The row was the durable copy and the email was a courtesy, so losing
 * the email lost nothing.
 *
 * Removing the database inverts that. The email IS the record now. A swallowed
 * send is a submission that no longer exists anywhere, and the person who sent
 * it was told "success". So this function throws, and the routes that call it
 * return 500 rather than reporting a success they cannot stand behind.
 *
 * ## Why not a silent no-op without a key
 *
 * `src/lib/email.ts` prints a preview to the console when `RESEND_API_KEY` is
 * unset. That is right for a welcome email in development and wrong for the only
 * copy of an enquiry in production: a missing key in production would
 * accept every message and drop all of them, quietly, at exactly the moment
 * nobody is watching the logs. Development keeps the preview. Production
 * throws.
 */

const FROM = "ReVia <contact@revialife.com>";

/** Who reads the inbox. Falls back to the published contact address. */
export function teamInbox(): string {
  return process.env.ADMIN_EMAIL || "contact@revialife.com";
}

/**
 * Send a submission to the team inbox.
 *
 * Throws if it cannot be delivered. Callers must not catch and continue — the
 * whole point is that the caller reports failure to the person who submitted.
 */
export async function notifyTeam(
  subject: string,
  fields: Record<string, string | null | undefined>,
  opts: { replyTo?: string } = {},
): Promise<void> {
  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b6257;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
        `<td style="padding:4px 0;color:#2c241e">${escapeHtml(String(v)).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const html =
    `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6">` +
    `<p style="margin:0 0 12px;color:#6b6257">Submitted on revialife.com</p>` +
    `<table style="border-collapse:collapse">${rows}</table></div>`;

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is unset — refusing to accept a submission it cannot deliver");
    }
    console.log(`──── NOTIFY PREVIEW (no RESEND_API_KEY) ────\n${subject}\n`, fields);
    return;
  }

  const res = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: FROM,
    to: teamInbox(),
    subject,
    html,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });
  // The SDK reports a rejected send in the body rather than by throwing, so a
  // bare await would treat "domain not verified" as delivered.
  if (res.error) throw new Error(`Resend refused the message: ${res.error.message}`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
