export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Gather stats
    const [
      todayOrders, todayRevenue, todayUsers, todayPartners, todayAffiliates,
      totalOrders, totalRevenue, totalUsers, pendingPayments, totalProducts,
      chatLeadsToday, pendingPartners, pendingAffiliates, commissionsOwed,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.aggregate({ where: { createdAt: { gte: startOfDay }, paymentStatus: "confirmed" }, _sum: { total: true } }),
      prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.brandPartner.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.affiliate.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { paymentStatus: "confirmed" } }),
      prisma.order.aggregate({ where: { paymentStatus: "confirmed" }, _sum: { total: true } }),
      prisma.user.count(),
      prisma.order.count({ where: { paymentStatus: "awaiting" } }),
      prisma.product.count({ where: { active: true } }),
      prisma.chatLead.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.brandPartner.count({ where: { status: "pending" } }),
      prisma.affiliate.count({ where: { status: "pending" } }),
      prisma.affiliate.aggregate({ _sum: { totalCommission: true, paidCommission: true } }),
    ]);

    const todayRev = todayRevenue._sum?.total ?? 0;
    const allTimeRev = totalRevenue._sum?.total ?? 0;
    const totalCommission = commissionsOwed._sum?.totalCommission ?? 0;
    const paidCommission = commissionsOwed._sum?.paidCommission ?? 0;
    const owedCommission = totalCommission - paidCommission;

    const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const html = `
<div style="background-color:#0f0f0f;padding:40px 20px;font-family:-apple-system,sans-serif;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;background-color:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 4px;">Daily Health Report</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">${dateStr}</p>

    <h2 style="color:#10b981;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Today's Activity</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Orders</td><td style="color:#e5e5e5;text-align:right;font-weight:600;font-size:14px;">${todayOrders}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Revenue</td><td style="color:#10b981;text-align:right;font-weight:700;font-size:14px;">$${(todayRev / 100).toFixed(2)}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">New Accounts</td><td style="color:#e5e5e5;text-align:right;font-weight:600;font-size:14px;">${todayUsers}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Brand Partner Apps</td><td style="color:#e5e5e5;text-align:right;font-weight:600;font-size:14px;">${todayPartners}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Affiliate Apps</td><td style="color:#e5e5e5;text-align:right;font-weight:600;font-size:14px;">${todayAffiliates}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Chat Conversations</td><td style="color:#e5e5e5;text-align:right;font-weight:600;font-size:14px;">${chatLeadsToday}</td></tr>
    </table>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />

    <h2 style="color:#60a5fa;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">All-Time / Pending</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Total Revenue</td><td style="color:#e5e5e5;text-align:right;font-weight:700;font-size:14px;">$${(allTimeRev / 100).toFixed(2)}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Total Orders</td><td style="color:#e5e5e5;text-align:right;font-size:14px;">${totalOrders}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Total Users</td><td style="color:#e5e5e5;text-align:right;font-size:14px;">${totalUsers}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Active Products</td><td style="color:#e5e5e5;text-align:right;font-size:14px;">${totalProducts}</td></tr>
      <tr><td style="color:#f59e0b;padding:6px 0;font-size:14px;">Pending Payments</td><td style="color:#f59e0b;text-align:right;font-weight:600;font-size:14px;">${pendingPayments}</td></tr>
      <tr><td style="color:#f59e0b;padding:6px 0;font-size:14px;">Pending Partner Apps</td><td style="color:#f59e0b;text-align:right;font-weight:600;font-size:14px;">${pendingPartners}</td></tr>
      <tr><td style="color:#f59e0b;padding:6px 0;font-size:14px;">Pending Affiliate Apps</td><td style="color:#f59e0b;text-align:right;font-weight:600;font-size:14px;">${pendingAffiliates}</td></tr>
    </table>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 24px;" />

    <h2 style="color:#a78bfa;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Commissions</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Total Earned</td><td style="color:#e5e5e5;text-align:right;font-size:14px;">$${(totalCommission / 100).toFixed(2)}</td></tr>
      <tr><td style="color:#9ca3af;padding:6px 0;font-size:14px;">Paid Out</td><td style="color:#e5e5e5;text-align:right;font-size:14px;">$${(paidCommission / 100).toFixed(2)}</td></tr>
      <tr><td style="color:#f59e0b;padding:6px 0;font-size:14px;font-weight:600;">Owed</td><td style="color:#f59e0b;text-align:right;font-weight:700;font-size:14px;">$${(owedCommission / 100).toFixed(2)}</td></tr>
    </table>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />

    <div style="text-align:center;">
      <a href="https://revialife.com/admin" style="display:inline-block;background-color:#059669;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;">Open Admin Dashboard</a>
    </div>

    <p style="text-align:center;color:#6b7280;font-size:12px;margin-top:24px;">
      &copy; ${now.getFullYear()} ReVia Research Supply LLC — Automated daily report
    </p>
  </div>
</div>`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "ReVia Research Supply <orders@revialife.com>",
        to: "mss@revialife.com",
        subject: `ReVia Daily Report — ${dateStr}`,
        html,
      });
    }

    return NextResponse.json({ sent: true, date: dateStr });
  } catch (err) {
    console.error("POST /api/admin/daily-report error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
