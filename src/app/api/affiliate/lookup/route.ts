export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code } = (await request.json()) as { code?: string };
    if (!code || !code.trim()) {
      return NextResponse.json({ valid: false, message: "Enter a code" });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode: code.trim().toUpperCase() },
      include: { user: { select: { name: true } } },
    });

    if (!affiliate || affiliate.status !== "approved") {
      return NextResponse.json({ valid: false, message: "Invalid affiliate code" });
    }

    return NextResponse.json({
      valid: true,
      code: affiliate.affiliateCode,
      referredBy: affiliate.user.name || "your referrer",
    });
  } catch (err) {
    console.error("POST /api/affiliate/lookup error:", err);
    return NextResponse.json(
      { valid: false, message: "Failed to validate code" },
      { status: 500 }
    );
  }
}
