export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Order creation was removed with the storefront.                    */
/*                                                                     */
/*  revialife.com no longer sells; purchase intent leaves for the      */
/*  partner storefront. POST /api/orders is gone rather than left      */
/*  reachable behind a UI that no longer calls it — an order-creating  */
/*  endpoint with nothing pointing at it is still an order-creating    */
/*  endpoint. The admin listing below is unchanged.                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  GET /api/orders – list all orders (admin only)                     */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
