export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET — list batch records (optionally filter by productId)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = request.nextUrl.searchParams.get("productId");
    const batches = await prisma.batchRecord.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      batches: batches.map((b) => ({
        ...b,
        manufactureDate: b.manufactureDate.toISOString(),
        testDate: b.testDate.toISOString(),
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/batches error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — create batch record
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, batchNumber, manufactureDate, testDate, labName, purityPercent,
      hplcPass, lcmsPass, endotoxinPass, sterilityPass, heavyMetalsPass,
      residualSolventPass, aminoAcidPass, bioburdenPass, peptideContentPass, notes } = body;

    if (!productId || !batchNumber || !manufactureDate || !testDate || purityPercent === undefined) {
      return NextResponse.json({ error: "Required: productId, batchNumber, dates, purity" }, { status: 400 });
    }

    // Deactivate previous active batch for this product
    await prisma.batchRecord.updateMany({
      where: { productId, active: true },
      data: { active: false },
    });

    const batch = await prisma.batchRecord.create({
      data: {
        productId,
        batchNumber,
        manufactureDate: new Date(manufactureDate),
        testDate: new Date(testDate),
        labName: labName || "Chromate",
        purityPercent,
        hplcPass: hplcPass ?? true,
        lcmsPass: lcmsPass ?? true,
        endotoxinPass: endotoxinPass ?? true,
        sterilityPass: sterilityPass ?? true,
        heavyMetalsPass: heavyMetalsPass ?? true,
        residualSolventPass: residualSolventPass ?? true,
        aminoAcidPass: aminoAcidPass ?? true,
        bioburdenPass: bioburdenPass ?? true,
        peptideContentPass: peptideContentPass ?? true,
        notes: notes || null,
        active: true,
      },
    });

    return NextResponse.json({ batch }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/batches error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    await prisma.batchRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/batches error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
