export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (err) {
    console.error("GET /api/admin/coupons error:", err);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, type, value, minOrder, maxUses, perUserLimit, expiresAt, startsAt, allowedEmails, blockedEmails, campaign } = body as {
      code: string;
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

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    const isShipping = type === "shipping";
    if (!isShipping && value === undefined) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A coupon with this code already exists" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type: type ?? "percentage",
        value: isShipping ? 0 : value,
        minOrder: minOrder ?? 0,
        maxUses: maxUses ?? 0,
        perUserLimit: perUserLimit ?? 0,
        allowedEmails: allowedEmails ?? "",
        blockedEmails: blockedEmails ?? "",
        campaign: campaign?.trim() || null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/coupons error:", err);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
