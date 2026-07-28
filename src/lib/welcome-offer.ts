import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// The first-order welcome offer scales with basket size:
//   under $200  → 10%
//   $200–$500   → 15%
//   over $500   → 20%
// Coupons opt in via `campaign = "welcome-tiered"`; every other coupon keeps its
// flat `value`. The tier is computed server-side in BOTH places that price a
// coupon (/api/coupons/validate and /api/orders) — never trust a client total.
export const WELCOME_CAMPAIGN = "welcome-tiered";
export const WELCOME_CODE = "WELCOME";

const TIERS = [
  { minCents: 50001, percent: 20 },
  { minCents: 20000, percent: 15 },
  { minCents: 0, percent: 10 },
];

export function isWelcomeTiered(coupon: { campaign: string | null }): boolean {
  return coupon.campaign === WELCOME_CAMPAIGN;
}

/** Percent this coupon is worth on this subtotal (cents). */
export function couponPercentFor(
  coupon: { campaign: string | null; value: number },
  subtotalCents: number
): number {
  if (!isWelcomeTiered(coupon)) return coupon.value;
  return (TIERS.find((t) => subtotalCents >= t.minCents) ?? TIERS[TIERS.length - 1]).percent;
}

/** Cents to the next tier, for the "spend $X more to save 15%" nudge. */
export function nextWelcomeTier(
  subtotalCents: number
): { percent: number; spendMoreCents: number } | null {
  const higher = [...TIERS].reverse().find((t) => t.minCents > subtotalCents);
  return higher
    ? { percent: higher.percent, spendMoreCents: higher.minCents - subtotalCents }
    : null;
}

/**
 * The welcome offer is for FIRST orders. perUserLimit alone only caps repeat use
 * of the code — it would still hand a discount to an existing customer.
 */
export async function hasOrderedBefore(email: string | null | undefined): Promise<boolean> {
  const address = email?.toLowerCase().trim();
  if (!address) return false;
  const prior = await prisma.order.count({
    where: { email: address, status: { not: "cancelled" } },
  });
  return prior > 0;
}

/* ── Unsubscribe links ─────────────────────────────────────────────────────
   Signed so a link can only unsubscribe the address it was issued for. */

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

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(token || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function unsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  return `${baseUrl}/unsubscribe?e=${encodeURIComponent(email.toLowerCase().trim())}&t=${unsubscribeToken(email)}`;
}
