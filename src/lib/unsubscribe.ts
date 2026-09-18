import crypto from "node:crypto";

/**
 * Signed unsubscribe links.
 *
 * These lived in `src/lib/welcome-offer.ts` until that file was deleted with the
 * rest of the discount machinery. They have nothing to do with a welcome offer —
 * they are how anybody on the list gets off it — and taking them out with the
 * commerce code would have broken `/unsubscribe` for every subscriber, including
 * the ones who never saw a discount.
 *
 * The token is an HMAC of the address, so a link can only unsubscribe the
 * address it was issued for. Without that, `?e=` is an open form for
 * unsubscribing strangers.
 */

/**
 * The signing key.
 *
 * This read `JWT_SECRET || CRON_SECRET || "revia-newsletter"`. The first was for
 * the auth system, which is deleted; the second for a cron route, also deleted.
 * So in practice the key was the third one — a string printed in the public
 * repository, which anybody could use to mint a valid unsubscribe link for any
 * address they cared to type. The HMAC was doing nothing.
 *
 * `RESEND_API_KEY` is the last fallback on purpose rather than a literal: a
 * deployment that cannot send mail has no list to unsubscribe anyone from, so
 * wherever these links can exist, the key does too. If none is set this throws,
 * because issuing a link that anyone can forge is worse than not issuing one.
 *
 * Note this invalidates links in mail already sent under the old constant.
 * Those links could be forged by anyone, so that is the point.
 */
function secret(): string {
  const s =
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.JWT_SECRET ||
    process.env.RESEND_API_KEY;
  if (!s) throw new Error("No secret available to sign unsubscribe links");
  return s;
}

export function unsubscribeToken(email: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(email.toLowerCase().trim())
    .digest("hex")
    .slice(0, 32);
}

/** Constant-time, so a wrong token cannot be found a character at a time. */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function unsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  return `${baseUrl}/unsubscribe?e=${encodeURIComponent(
    email.toLowerCase().trim(),
  )}&t=${unsubscribeToken(email)}`;
}
