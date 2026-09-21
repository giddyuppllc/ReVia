export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { notifyTeam } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";

/** Partnership enquiries. The team inbox is the record — see src/lib/notify.ts. */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`brand-partner:${ip}`, 5, 60 * 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const {
    businessName, contactName, email, phone, businessType,
    website, clientCount, instagram, facebook, tiktok, linkedin, message,
  } = (body ?? {}) as Record<string, string>;

  if (!businessName || !contactName || !email || !phone || !businessType) {
    return NextResponse.json(
      { error: "Business name, contact name, email, phone, and business type are required" },
      { status: 400 },
    );
  }

  try {
    await notifyTeam(
      `Partnership enquiry: ${businessName}`,
      {
        Business: businessName, Contact: contactName, Email: email, Phone: phone,
        Type: businessType, Website: website, Clients: clientCount,
        Instagram: instagram, Facebook: facebook, TikTok: tiktok, LinkedIn: linkedin,
        Message: message,
      },
      { replyTo: email },
    );
  } catch (err) {
    console.error("brand-partner: could not deliver the enquiry", err);
    return NextResponse.json(
      { error: "We could not submit that. Please email contact@revialife.com directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
