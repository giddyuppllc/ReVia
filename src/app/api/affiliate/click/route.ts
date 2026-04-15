export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ ok: false });

    const affiliate = await prisma.affiliate.findUnique({ where: { affiliateCode: code } });
    if (!affiliate || affiliate.status !== "approved") {
      return NextResponse.json({ ok: false });
    }

    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: { totalClicks: { increment: 1 } },
    });

    return NextResponse.json({ ok: true, affiliateId: affiliate.id });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
