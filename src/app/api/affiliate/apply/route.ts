export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user) {
      return NextResponse.json({ error: "Must be logged in" }, { status: 401 });
    }

    // Check if already applied
    const existing = await prisma.affiliate.findUnique({ where: { userId: user.id } });
    if (existing) {
      return NextResponse.json({ error: "You have already applied", status: existing.status }, { status: 400 });
    }

    const body = await request.json();
    const { instagram, tiktok, youtube, twitter, website, bio, audience } = body as {
      instagram?: string; tiktok?: string; youtube?: string; twitter?: string;
      website?: string; bio?: string; audience?: string;
    };

    if (!bio || bio.trim().length < 10) {
      return NextResponse.json({ error: "Please tell us why you want to be an affiliate (minimum 10 characters)" }, { status: 400 });
    }

    const affiliateCode = `RV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        affiliateCode,
        instagram: instagram?.trim() || null,
        tiktok: tiktok?.trim() || null,
        youtube: youtube?.trim() || null,
        twitter: twitter?.trim() || null,
        website: website?.trim() || null,
        bio: bio.trim(),
        audience: audience?.trim() || null,
      },
    });

    return NextResponse.json({ affiliate: { id: affiliate.id, status: affiliate.status } }, { status: 201 });
  } catch (err) {
    console.error("POST /api/affiliate/apply error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
