import { Resend } from "resend";
import { escapeHtml } from "@/lib/notify";

/**
 * The two emails revialife.com still sends.
 *
 * Everything else that lived here — order confirmations, payment instructions
 * for Zelle and wire and Kraken, shipping and delivery notices, the account
 * welcome and verification, password resets, the rewards-drawing winner, the
 * payment reminder, the admin new-order alert and the affiliate decisions —
 * described a shop, an account system and an affiliate programme that this site
 * no longer has. They were unreachable from any route left in the repository.
 *
 * Kept: the receipt a person gets for sending an enquiry, and the newsletter
 * welcome. Team-facing notifications live in src/lib/notify.ts, which throws
 * rather than logging, because there they are the only record.
 */

/* ------------------------------------------------------------------ */
/*  Resend Client                                                      */
/* ------------------------------------------------------------------ */

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// "Research Supply" and an orders@ address both describe a merchant. Neither
// is true of revialife.com any more, and the two mails left here are a receipt
// for an enquiry and a newsletter welcome.
const FROM = "ReVia <contact@revialife.com>";

async function send(
  to: string,
  subject: string,
  html: string,
  headers?: Record<string, string>
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("──── EMAIL PREVIEW (no RESEND_API_KEY) ────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html.slice(0, 500) + "...");
    console.log("───────────────────────");
    return;
  }
  await getResend().emails.send({ from: FROM, to, subject, html, headers });
}

/* ------------------------------------------------------------------ */
/*  Shared styles (dark theme)                                         */
/* ------------------------------------------------------------------ */

const wrapper = `
  background-color:#0f0f0f;
  padding:40px 20px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#e5e5e5;
`;
const card = `
  max-width:600px;
  margin:0 auto;
  background-color:#1a1a1a;
  border:1px solid rgba(255,255,255,0.08);
  border-radius:16px;
  padding:32px;
`;
const heading = `color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;`;
const subtext = `color:#9ca3af;font-size:14px;margin:0 0 24px;`;
const divider = `border:0;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;`;
const footer = `text-align:center;color:#6b7280;font-size:12px;margin-top:32px;`;
const btnStyle = `display:inline-block;background:#10b981;color:#0b0b0b;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;text-decoration:none;`;

function footerBlock() {
  return `<p style="${footer}">
    &copy; ${new Date().getFullYear()} ReVia &mdash; For research use only.<br/>
    revialife.com is our brand and public-record site. It does not sell anything.
  </p>`;
}

/* ------------------------------------------------------------------ */
/*  13. Contact Form Auto-Reply                                        */
/* ------------------------------------------------------------------ */

export async function sendContactAutoReply(
  name: string,
  email: string,
  subject: string
) {
  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">We Got Your Message</h1>
    <p style="${subtext}">
      Hi ${escapeHtml(name)}, thanks for reaching out. We've received your message regarding "<em>${escapeHtml(subject)}</em>"
      and will respond within 24 hours.
    </p>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If your inquiry is urgent, you can also email us directly at
      <a href="mailto:contact@revialife.com" style="color:#10b981;">contact@revialife.com</a>.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `We received your message — ReVia`, html);
}

/* ------------------------------------------------------------------ */
/*  14. Newsletter Welcome                                             */
/* ------------------------------------------------------------------ */

export async function sendNewsletterWelcome(email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">You're on the List!</h1>
    <p style="${subtext}">
      Thanks for subscribing to the ReVia Research Supply newsletter.
      You'll be the first to hear about new products, promotions, and research updates.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${baseUrl}/shop" style="${btnStyle}">Browse Catalog</a>
    </div>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, "Welcome to the ReVia Newsletter", html);
}

/* The welcome-discount email was removed with the discount itself: ReVia
   sells nothing, so there is no order for a code to apply to. Plain
   newsletter welcome only — see sendNewsletterWelcome above. */
