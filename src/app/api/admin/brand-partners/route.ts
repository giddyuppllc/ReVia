export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const partners = await prisma.brandPartner.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ partners: partners.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })) });
  } catch (err) {
    console.error("GET /api/admin/brand-partners error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const data: Record<string, string> = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    await prisma.brandPartner.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/brand-partners error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    await prisma.brandPartner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/brand-partners error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
