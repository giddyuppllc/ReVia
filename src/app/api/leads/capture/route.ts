export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { notifyTeam } from "@/lib/notify";
import { addContactQuiet } from "@/lib/audience";
import { rateLimit } from "@/lib/rate-limit";

// Public lead-capture ingest for the ReVia funnel network. The 6 funnel sites
// live on their own domains, so this is a cross-origin endpoint with an
// explicit origin allowlist.
//
// ## What the database used to do here, and what replaces it
//
// Every call wrote a `FunnelLead` row, including anonymous pageviews, and a
// referral code incremented a click counter on the `Affiliate` table.
//
// revialife has no database and no affiliate programme — that moved to i2b —
// so the two kinds of traffic arriving here now part company:
//
//   * a lead with an email address goes on the mailing list and is sent to the
//     team with its whole context, which is the durable copy
//   * an anonymous pageview or click has no address to file it under and no
//     table to count it in. It is acknowledged and NOT recorded, and the
//     response says `recorded: false` so the funnel can tell the difference
//     rather than assume it landed. Funnel-level analytics belong in the
//     analytics tag on those sites, not in a counter here.
//
// A referral code still rides along and is reported in the notification; it is
// no longer credited automatically, because the programme it credited is not
// run from this domain.

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
  "pageview",
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

    // Nothing durable to do with an anonymous hit — see the note at the top.
    if (!email) {
      return NextResponse.json({ ok: true, recorded: false }, { status: 200, headers });
    }

    // Best-effort: the list is a convenience, the notification below is the
    // record. A list failure must not lose the lead.
    const listed = await addContactQuiet(email);

    try {
      await notifyTeam(`Funnel lead: ${sourceDomain}`, {
        Email: email,
        Source: sourceDomain,
        Path: path,
        Interest: productInterest === "[]" ? null : productInterest,
        Referral: referralCode,
        "utm_source": pick("utm_source") || pick("utmSource"),
        "utm_medium": pick("utm_medium") || pick("utmMedium"),
        "utm_campaign": pick("utm_campaign") || pick("utmCampaign"),
        "utm_content": pick("utm_content") || pick("utmContent"),
        Meta: meta === "{}" ? null : meta,
        "On mailing list": listed ? "yes" : "no — add by hand",
      }, { replyTo: email });
    } catch (err) {
      console.error("lead-capture: could not deliver the lead", err);
      return NextResponse.json({ ok: false, error: "not recorded" }, { status: 500, headers });
    }

    return NextResponse.json({ ok: true, recorded: true }, { status: 200, headers });
  } catch {
    return NextResponse.json({ ok: false, error: "server error" }, { status: 500, headers });
  }
}
