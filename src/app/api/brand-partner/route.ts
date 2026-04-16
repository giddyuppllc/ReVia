export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success } = rateLimit(`brand-partner:${ip}`, 5, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { businessName, contactName, email, phone, businessType, website, clientCount, instagram, facebook, tiktok, linkedin, message } = body;

    if (!businessName || !contactName || !email || !phone || !businessType) {
      return NextResponse.json({ error: "Business name, contact name, email, phone, and business type are required" }, { status: 400 });
    }

    const partner = await prisma.brandPartner.create({
      data: {
        businessName, contactName, email, phone, businessType,
        website: website || null, clientCount: clientCount || null,
        instagram: instagram || null, facebook: facebook || null,
        tiktok: tiktok || null, linkedin: linkedin || null,
        message: message || null,
      },
    });

    return NextResponse.json({ success: true, id: partner.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/brand-partner error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
