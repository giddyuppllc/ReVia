export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendAffiliateApprovedEmail, sendAffiliateRejectedEmail } from "@/lib/email";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliates = await prisma.affiliate.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      affiliates: affiliates.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/affiliates error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { affiliateId, status, commissionRate, paidCommission } = await request.json();
    if (!affiliateId) {
      return NextResponse.json({ error: "affiliateId required" }, { status: 400 });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    const previousStatus = affiliate.status;

    if (status && ["pending", "approved", "rejected"].includes(status)) data.status = status;
    if (typeof commissionRate === "number" && commissionRate >= 0 && commissionRate <= 50) data.commissionRate = commissionRate;
    if (typeof paidCommission === "number") data.paidCommission = paidCommission;

    await prisma.affiliate.update({ where: { id: affiliateId }, data });

    // Send emails on status change
    if (status === "approved" && previousStatus !== "approved") {
      try {
        await sendAffiliateApprovedEmail(affiliate.user.name, affiliate.user.email, affiliate.affiliateCode);
      } catch (e) { console.error("Affiliate approval email failed:", e); }
    }
    if (status === "rejected" && previousStatus !== "rejected") {
      try {
        await sendAffiliateRejectedEmail(affiliate.user.name, affiliate.user.email);
      } catch (e) { console.error("Affiliate rejection email failed:", e); }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/affiliates error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
