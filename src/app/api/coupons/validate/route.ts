export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  couponPercentFor,
  hasOrderedBefore,
  isWelcomeTiered,
  nextWelcomeTier,
} from "@/lib/welcome-offer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal, email, shippingCost } = body as {
      code: string;
      subtotal: number;
      email?: string;
      shippingCost?: number;
    };

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Promo code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid promo code" });
    }

    if (!coupon.active) {
      return NextResponse.json({ valid: false, message: "This promo code is no longer active" });
    }

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({
        valid: false,
        message: `This promo code becomes active on ${new Date(coupon.startsAt).toLocaleDateString()}`,
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return NextResponse.json({ valid: false, message: "This promo code has expired" });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: "This promo code has reached its usage limit" });
    }

    const userEmail = email?.toLowerCase().trim();
    if (userEmail && coupon.blockedEmails) {
      const blocked = coupon.blockedEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      if (blocked.includes(userEmail)) {
        return NextResponse.json({ valid: false, message: "This promo code is not available for your account" });
      }
    }
    if (coupon.allowedEmails) {
      const allowed = coupon.allowedEmails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
      if (allowed.length > 0 && userEmail && !allowed.includes(userEmail)) {
        return NextResponse.json({ valid: false, message: "This promo code is not available for your account" });
      }
    }

    if (coupon.perUserLimit > 0 && userEmail) {
      const userUseCount = await prisma.order.count({
        where: { couponId: coupon.id, email: userEmail },
      });
      if (userUseCount >= coupon.perUserLimit) {
        return NextResponse.json({
          valid: false,
          message: `You have already used this promo code the maximum of ${coupon.perUserLimit} time${coupon.perUserLimit === 1 ? "" : "s"}`,
        });
      }
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of $${(coupon.minOrder / 100).toFixed(2)} required`,
      });
    }

    // The welcome offer is for first orders only — the per-user limit alone would
    // still hand it to an existing customer placing a second one.
    if (isWelcomeTiered(coupon) && (await hasOrderedBefore(userEmail))) {
      return NextResponse.json({
        valid: false,
        message: "This code is for first orders only",
      });
    }

    const percent = couponPercentFor(coupon, subtotal);

    let discount = 0;
    let freeShipping = false;
    if (coupon.type === "shipping") {
      freeShipping = true;
      discount = typeof shippingCost === "number" ? shippingCost : 0;
    } else if (coupon.type === "percentage") {
      discount = Math.round(subtotal * (percent / 100));
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    let message: string;
    if (coupon.type === "shipping") {
      message = "Free shipping applied!";
    } else if (coupon.type === "percentage") {
      message = `${percent}% off applied!`;
    } else {
      message = `$${(coupon.value / 100).toFixed(2)} off applied!`;
    }

    // Nudge toward the next tier when one is within reach.
    const next = isWelcomeTiered(coupon) ? nextWelcomeTier(subtotal) : null;
    if (next) {
      message += ` Add $${(next.spendMoreCents / 100).toFixed(2)} to save ${next.percent}%.`;
    }

    return NextResponse.json({
      valid: true,
      discount,
      freeShipping,
      type: coupon.type,
      value: percent,
      message,
    });
  } catch (err) {
    console.error("POST /api/coupons/validate error:", err);
    return NextResponse.json(
      { valid: false, message: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
