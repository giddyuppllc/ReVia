export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const source = await prisma.coupon.findUnique({ where: { id } });
    if (!source) {
      return NextResponse.json({ error: "Source coupon not found" }, { status: 404 });
    }

    // Build a new code: ORIGINAL-COPY-XXXX (unique). Try a few times, then bail.
    let newCode = "";
    for (let i = 0; i < 6; i++) {
      const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
      const candidate = `${source.code}-${suffix}`.slice(0, 64);
      const exists = await prisma.coupon.findUnique({ where: { code: candidate } });
      if (!exists) {
        newCode = candidate;
        break;
      }
    }
    if (!newCode) {
      return NextResponse.json({ error: "Could not generate unique code" }, { status: 500 });
    }

    const dupe = await prisma.coupon.create({
      data: {
        code: newCode,
        type: source.type,
        value: source.value,
        minOrder: source.minOrder,
        maxUses: source.maxUses,
        perUserLimit: source.perUserLimit,
        active: source.active,
        allowedEmails: source.allowedEmails,
        blockedEmails: source.blockedEmails,
        campaign: source.campaign,
        startsAt: source.startsAt,
        expiresAt: source.expiresAt,
        // usedCount stays 0 by default
      },
    });

    return NextResponse.json({ coupon: dupe }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/coupons/[id]/duplicate error:", err);
    return NextResponse.json({ error: "Failed to duplicate coupon" }, { status: 500 });
  }
}
