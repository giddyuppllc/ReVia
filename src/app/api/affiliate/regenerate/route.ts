export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import crypto from "crypto";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({ where: { userId: user.id } });
    if (!affiliate || affiliate.status !== "approved") {
      return NextResponse.json({ error: "Not an active affiliate" }, { status: 400 });
    }

    const newCode = `RV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    await prisma.affiliate.update({ where: { id: affiliate.id }, data: { affiliateCode: newCode } });

    return NextResponse.json({ affiliateCode: newCode });
  } catch (err) {
    console.error("POST /api/affiliate/regenerate error:", err);
    return NextResponse.json({ error: "Failed to regenerate" }, { status: 500 });
  }
}
