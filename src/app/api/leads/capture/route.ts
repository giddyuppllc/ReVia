export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

// Public lead-capture ingest for the ReVia funnel network. The 6 funnel sites
// live on their own domains, so this is a cross-origin endpoint with an
// explicit origin allowlist. Captures email opt-ins, quiz completions, PDF
// downloads, and direct-click leads, and links a referral code to the existing
// Affiliate system when one is present.

const ALLOWED_ORIGINS = new Set([
  "https://molecularrecorder.com",
  "https://www.molecularrecorder.com",
  "https://sourceprimer.com",
  "https://www.sourceprimer.com",
  "https://world-wide-peptide.com",
  "https://www.world-wide-peptide.com",
  "https://chargedupfuture.com",
  "https://www.chargedupfuture.com",
  "https://matchyourstack.com",
  "https://www.matchyourstack.com",
  "https://vial-verdict.com",
  "https://www.vial-verdict.com",
]);

const VALID_PATHS = new Set([
  "email_capture",
  "direct_click",
  "quiz",
  "pdf_download",
  "referral",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  // Only accept from known funnel origins.
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ ok: false, error: "origin not allowed" }, { status: 403, headers });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(`lead-capture:${ip}`, 10, 60_000); // 10/min/IP
  if (!rl.success) {
    return NextResponse.json({ ok: false, error: "rate limited" }, { status: 429, headers });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
    const sourceDomain =
      typeof body.sourceDomain === "string" && body.sourceDomain
        ? body.sourceDomain.slice(0, 120)
        : new URL(origin).hostname;
    const path = typeof body.path === "string" && VALID_PATHS.has(body.path) ? body.path : "email_capture";
    const referralCode =
      typeof body.referralCode === "string" && body.referralCode ? body.referralCode.slice(0, 60) : null;

    // email is required for the capture paths; direct_click/referral can be anonymous
    if (!email && (path === "email_capture" || path === "pdf_download" || path === "quiz")) {
      return NextResponse.json({ ok: false, error: "email required" }, { status: 400, headers });
    }
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400, headers });
    }

    const productInterest = Array.isArray(body.productInterest)
      ? JSON.stringify((body.productInterest as unknown[]).map(String).slice(0, 25))
      : "[]";
    const meta =
      body.meta && typeof body.meta === "object" ? JSON.stringify(body.meta).slice(0, 4000) : "{}";

    const utm = (body.utm ?? {}) as Record<string, unknown>;
    const pick = (k: string) => {
      const v = (utm[k] ?? body[k]) as unknown;
      return typeof v === "string" ? v.slice(0, 120) : null;
    };

    await prisma.funnelLead.create({
      data: {
        email,
        sourceDomain,
        path,
        productInterest,
        referralCode,
        utmSource: pick("utm_source") || pick("utmSource"),
        utmMedium: pick("utm_medium") || pick("utmMedium"),
        utmCampaign: pick("utm_campaign") || pick("utmCampaign"),
        utmContent: pick("utm_content") || pick("utmContent"),
        meta,
        ip: ip.slice(0, 60),
        userAgent: (request.headers.get("user-agent") || "").slice(0, 300) || null,
      },
    });

    // If a valid, approved referral code rode along, count it as a click on the
    // existing Affiliate system so funnel-driven referrals attribute correctly.
    if (referralCode) {
      try {
        const aff = await prisma.affiliate.findUnique({ where: { affiliateCode: referralCode } });
        if (aff && aff.status === "approved") {
          await prisma.affiliate.update({
            where: { id: aff.id },
            data: { totalClicks: { increment: 1 } },
          });
        }
      } catch {
        /* referral linking is best-effort */
      }
    }

    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch {
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500, headers });
  }
}
