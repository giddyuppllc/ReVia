export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — public batch data for a product (by productId or slug)
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("productId");
    const slug = request.nextUrl.searchParams.get("slug");

    if (!productId && !slug) {
      return NextResponse.json({ error: "productId or slug required" }, { status: 400 });
    }

    let pid = productId;
    if (!pid && slug) {
      const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
      if (!product) return NextResponse.json({ batches: [] });
      pid = product.id;
    }

    const batches = await prisma.batchRecord.findMany({
      where: { productId: pid! },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      batches: batches.map((b) => ({
        id: b.id,
        batchNumber: b.batchNumber,
        manufactureDate: b.manufactureDate.toISOString(),
        testDate: b.testDate.toISOString(),
        labName: b.labName,
        purityPercent: b.purityPercent,
        active: b.active,
        tests: {
          hplc: b.hplcPass,
          lcms: b.lcmsPass,
          endotoxin: b.endotoxinPass,
          sterility: b.sterilityPass,
          heavyMetals: b.heavyMetalsPass,
          residualSolvent: b.residualSolventPass,
          aminoAcid: b.aminoAcidPass,
          bioburden: b.bioburdenPass,
          peptideContent: b.peptideContentPass,
        },
        testsPassedCount: [b.hplcPass, b.lcmsPass, b.endotoxinPass, b.sterilityPass, b.heavyMetalsPass, b.residualSolventPass, b.aminoAcidPass, b.bioburdenPass, b.peptideContentPass].filter(Boolean).length,
        totalTests: 9,
      })),
    });
  } catch (err) {
    console.error("GET /api/batches error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
