export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { userId: user.id } });
    if (!affiliate) {
      return NextResponse.json({ affiliate: null });
    }

    const conversions = await prisma.affiliateConversion.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      affiliate: {
        id: affiliate.id,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        affiliateCode: affiliate.affiliateCode,
        instagram: affiliate.instagram,
        tiktok: affiliate.tiktok,
        youtube: affiliate.youtube,
        twitter: affiliate.twitter,
        website: affiliate.website,
        bio: affiliate.bio,
        audience: affiliate.audience,
        totalClicks: affiliate.totalClicks,
        totalOrders: affiliate.totalOrders,
        totalRevenue: affiliate.totalRevenue,
        totalCommission: affiliate.totalCommission,
        paidCommission: affiliate.paidCommission,
        createdAt: affiliate.createdAt.toISOString(),
      },
      conversions: conversions.map((c) => ({
        id: c.id,
        orderTotal: c.orderTotal,
        commission: c.commission,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("GET /api/affiliate/stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

// PATCH — update social links / bio
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { userId: user.id } });
    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 404 });
    }

    const body = await request.json();
    const data: Record<string, string | null> = {};
    if (body.instagram !== undefined) data.instagram = body.instagram?.trim() || null;
    if (body.tiktok !== undefined) data.tiktok = body.tiktok?.trim() || null;
    if (body.youtube !== undefined) data.youtube = body.youtube?.trim() || null;
    if (body.twitter !== undefined) data.twitter = body.twitter?.trim() || null;
    if (body.website !== undefined) data.website = body.website?.trim() || null;
    if (body.bio !== undefined) data.bio = body.bio?.trim() || null;

    await prisma.affiliate.update({ where: { id: affiliate.id }, data });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/affiliate/stats error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
