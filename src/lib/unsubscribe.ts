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

function secret(): string {
  return process.env.JWT_SECRET || process.env.CRON_SECRET || "revia-newsletter";
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
