export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COA_RESULTS, COA_RESULT_COUNT, COA_SPEC } from "@/lib/coa";

/* ------------------------------------------------------------------ */
/*  Public batch data for a product.                                   */
/*                                                                     */
/*  This route used to return nine boolean test flags — LC-MS,         */
/*  endotoxin, sterility, residual solvents, amino-acid sequencing,    */
/*  bioburden, peptide-content assay — and a hardcoded `totalTests: 9`.*/
/*  The certificate runs ONE method and reports FOUR results, so seven */
/*  of those were claims no document supports. The table happened to   */
/*  be empty, which is the only reason they were never served.         */
/*                                                                     */
/*  It now reports exactly what the COA reports, and the count is      */
/*  derived from COA_RESULTS rather than written down.                 */
/* ------------------------------------------------------------------ */

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
      method: COA_SPEC.method,
      lab: COA_SPEC.lab,
      puritySpec: COA_SPEC.puritySpec,
      results: COA_RESULTS.map((r) => ({ key: r.key, label: r.label, detail: r.detail })),
      batches: batches.map((b) => ({
        id: b.id,
        batchNumber: b.batchNumber,
        manufactureDate: b.manufactureDate.toISOString(),
        testDate: b.testDate.toISOString(),
        labName: b.labName,
        purityPercent: b.purityPercent,
        active: b.active,
        // Identity, quantity and metals are reported as "Conforms" on the
        // certificate. Purity carries the measured figure, above.
        resultCount: COA_RESULT_COUNT,
      })),
    });
  } catch (err) {
    console.error("GET /api/batches error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
