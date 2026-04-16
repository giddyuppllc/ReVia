export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Resend } from "resend";
import OpenAI from "openai";

// GET — list all campaigns
export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      campaigns: campaigns.map((c) => ({
        ...c,
        sentAt: c.sentAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/campaigns error:", err);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

// POST — create campaign OR send campaign OR AI draft
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // AI Draft
    if (body.action === "ai-draft") {
      const apiKey = process.env.OpenAi_chatbot_Key;
      if (!apiKey) {
        return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
      }

      const client = new OpenAI({ apiKey });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content: `You are a marketing copywriter for ReVia Research Supply, a research-grade peptide supplier. Write email marketing copy that is:
- Professional and scientific in tone
- NEVER mentions human consumption, dosing, or medical claims
- Uses "studied for", "researched for", "investigated in" language
- Includes a clear call to action
- All products are Research Use Only
- Keep it concise (2-3 short paragraphs + CTA)
Output HTML email body content only (no <html> or <body> tags, just the inner content with <h2>, <p>, <a> tags).`,
          },
          { role: "user", content: body.prompt || "Write a newsletter email about our latest products" },
        ],
      });

      return NextResponse.json({
        draft: response.choices[0]?.message?.content ?? "",
      });
    }

    // Send Campaign
    if (body.action === "send" && body.campaignId) {
      const campaign = await prisma.campaign.findUnique({ where: { id: body.campaignId } });
      if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      if (campaign.status === "sent") return NextResponse.json({ error: "Already sent" }, { status: 400 });

      // Get audience
      let emails: string[] = [];
      if (campaign.audience === "all") {
        const users = await prisma.user.findMany({ where: { suspended: false }, select: { email: true } });
        const subscribers = await prisma.newsletter.findMany({ select: { email: true } });
        const allEmails = new Set([...users.map((u) => u.email), ...subscribers.map((s) => s.email)]);
        emails = Array.from(allEmails);
      } else if (campaign.audience === "customers_only") {
        const users = await prisma.user.findMany({ where: { suspended: false, role: "customer" }, select: { email: true } });
        emails = users.map((u) => u.email);
      } else if (campaign.audience === "affiliates") {
        const affiliates = await prisma.affiliate.findMany({
          where: { status: "approved" },
          include: { user: { select: { email: true } } },
        });
        emails = affiliates.map((a) => a.user.email);
      }

      if (emails.length === 0) {
        return NextResponse.json({ error: "No recipients found" }, { status: 400 });
      }

      // Send via Resend (batch — max 100 per call)
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        return NextResponse.json({ error: "Resend not configured" }, { status: 503 });
      }

      const resend = new Resend(resendKey);
      const wrapper = `
<div style="background-color:#0f0f0f;padding:40px 20px;font-family:-apple-system,sans-serif;color:#e5e5e5;">
  <div style="max-width:600px;margin:0 auto;background-color:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
    ${campaign.body}
    <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
    <p style="text-align:center;color:#6b7280;font-size:12px;">
      &copy; ${new Date().getFullYear()} ReVia Research Supply LLC — For research use only.<br/>
      <a href="https://revialife.com" style="color:#10b981;">revialife.com</a>
    </p>
  </div>
</div>`;

      let sent = 0;
      const batchSize = 50;
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        for (const email of batch) {
          try {
            await resend.emails.send({
              from: "ReVia Research Supply <orders@revialife.com>",
              to: email,
              subject: campaign.subject,
              html: wrapper,
            });
            sent++;
          } catch (e) {
            console.error(`Failed to send to ${email}:`, e);
          }
        }
      }

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "sent", sentCount: sent, sentAt: new Date() },
      });

      return NextResponse.json({ sent, total: emails.length });
    }

    // Create Campaign
    const { name, subject, body: emailBody, template, audience } = body;
    if (!name || !subject || !emailBody) {
      return NextResponse.json({ error: "Name, subject, and body required" }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        body: emailBody,
        template: template || "newsletter",
        audience: audience || "all",
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/campaigns error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — delete a campaign
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/campaigns error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
