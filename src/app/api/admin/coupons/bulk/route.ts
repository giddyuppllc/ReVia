export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function randomCode(prefix: string, length: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return `${prefix}${out}`;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      count,
      prefix = "",
      suffixLength = 8,
      type = "percentage",
      value,
      minOrder = 0,
      maxUses = 0,
      perUserLimit = 0,
      expiresAt,
      startsAt,
      allowedEmails = "",
      blockedEmails = "",
      campaign,
    } = body as {
      count: number;
      prefix?: string;
      suffixLength?: number;
      type?: string;
      value: number;
      minOrder?: number;
      maxUses?: number;
      perUserLimit?: number;
      expiresAt?: string;
      startsAt?: string;
      allowedEmails?: string;
      blockedEmails?: string;
      campaign?: string;
    };

    if (!count || count < 1 || count > 500) {
      return NextResponse.json({ error: "count must be between 1 and 500" }, { status: 400 });
    }
    const isShipping = type === "shipping";
    if (!isShipping && (value === undefined || value === null)) {
      return NextResponse.json({ error: "value is required" }, { status: 400 });
    }

    const cleanPrefix = prefix.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16);
    const len = Math.min(Math.max(suffixLength, 4), 16);

    const created: { id: string; code: string }[] = [];
    const failed: string[] = [];

    for (let i = 0; i < count; i++) {
      let code = randomCode(cleanPrefix, len);
      let attempts = 0;
      while (attempts < 5) {
        try {
          const c = await prisma.coupon.create({
            data: {
              code,
              type,
              value: isShipping ? 0 : value,
              minOrder,
              maxUses,
              perUserLimit,
              allowedEmails,
              blockedEmails,
              campaign: campaign?.trim() || null,
              startsAt: startsAt ? new Date(startsAt) : null,
              expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
            select: { id: true, code: true },
          });
          created.push(c);
          break;
        } catch (e) {
          // Likely unique constraint collision — regenerate code
          attempts++;
          code = randomCode(cleanPrefix, len);
          if (attempts === 5) failed.push(code);
        }
      }
    }

    return NextResponse.json({ created, failed, total: created.length }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/coupons/bulk error:", err);
    return NextResponse.json({ error: "Failed to bulk-create coupons" }, { status: 500 });
  }
}
