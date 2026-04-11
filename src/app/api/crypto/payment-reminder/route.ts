export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminder } from "@/lib/email";

/* ------------------------------------------------------------------ */
/*  POST /api/crypto/payment-reminder                                  */
/*  Cron endpoint — sends reminders for orders pending >24h            */
/*  Run every 6 hours via cron                                         */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find orders that are pending_payment for >24 hours but <48 hours
    // (don't spam — only send once in the 24-48h window)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const staleOrders = await prisma.order.findMany({
      where: {
        status: "pending_payment",
        paymentStatus: "awaiting",
        paymentMethod: { in: ["zelle", "wire"] }, // BTC has its own 30-min expiry
        createdAt: {
          lte: twentyFourHoursAgo,
          gte: fortyEightHoursAgo,
        },
      },
      include: { items: true },
    });

    if (staleOrders.length === 0) {
      return NextResponse.json({ sent: 0, message: "No stale orders" });
    }

    let sent = 0;
    for (const order of staleOrders) {
      try {
        await sendPaymentReminder(order, order.email);
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send reminder for ${order.invoiceNumber}:`, emailErr);
      }
    }

    return NextResponse.json({ sent, total: staleOrders.length });
  } catch (err) {
    console.error("POST /api/crypto/payment-reminder error:", err);
    return NextResponse.json({ error: "Reminder check failed" }, { status: 500 });
  }
}
