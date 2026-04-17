export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CHATBOT_CONFIG, invalidateChatbotConfigCache } from "@/lib/chatbotConfig";

async function requireAdmin() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.chatbotConfig.findUnique({ where: { id: "singleton" } });
  if (existing) return NextResponse.json(existing);

  const created = await prisma.chatbotConfig.create({ data: DEFAULT_CHATBOT_CONFIG });
  return NextResponse.json(created);
}

export async function PATCH(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    enabled?: boolean;
    systemPrompt?: string;
    topicKeywords?: string;
    clientDeflect?: string;
    offTopicResponse?: string;
    welcomeTitle?: string;
    welcomeBody?: string;
    quickQuestions?: string[] | string;
  };

  const update: Record<string, unknown> = { updatedBy: user.email };

  if (body.enabled !== undefined) update.enabled = !!body.enabled;
  if (typeof body.systemPrompt === "string") {
    const s = body.systemPrompt.trim();
    if (s.length < 50) return NextResponse.json({ error: "System prompt is too short" }, { status: 400 });
    update.systemPrompt = s;
  }
  if (typeof body.topicKeywords === "string") update.topicKeywords = body.topicKeywords;
  if (typeof body.clientDeflect === "string") {
    const s = body.clientDeflect.trim();
    if (!s) return NextResponse.json({ error: "Client deflect message cannot be empty" }, { status: 400 });
    update.clientDeflect = s;
  }
  if (typeof body.offTopicResponse === "string") {
    const s = body.offTopicResponse.trim();
    if (!s) return NextResponse.json({ error: "Off-topic response cannot be empty" }, { status: 400 });
    update.offTopicResponse = s;
  }
  if (typeof body.welcomeTitle === "string") update.welcomeTitle = body.welcomeTitle.trim();
  if (typeof body.welcomeBody === "string") update.welcomeBody = body.welcomeBody.trim();

  if (body.quickQuestions !== undefined) {
    let arr: string[] = [];
    if (Array.isArray(body.quickQuestions)) {
      arr = body.quickQuestions.filter((q): q is string => typeof q === "string").map((q) => q.trim()).filter(Boolean);
    } else if (typeof body.quickQuestions === "string") {
      try {
        const parsed = JSON.parse(body.quickQuestions);
        if (Array.isArray(parsed)) arr = parsed.filter((q): q is string => typeof q === "string").map((q) => q.trim()).filter(Boolean);
      } catch {
        return NextResponse.json({ error: "Invalid quickQuestions JSON" }, { status: 400 });
      }
    }
    if (arr.length > 8) return NextResponse.json({ error: "Max 8 quick questions" }, { status: 400 });
    update.quickQuestions = JSON.stringify(arr);
  }

  if (Object.keys(update).length === 1) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const config = await prisma.chatbotConfig.upsert({
    where: { id: "singleton" },
    update,
    create: { ...DEFAULT_CHATBOT_CONFIG, ...update },
  });

  invalidateChatbotConfigCache();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  // reset to defaults
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { action?: string };
  if (body.action !== "reset") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const config = await prisma.chatbotConfig.upsert({
    where: { id: "singleton" },
    update: { ...DEFAULT_CHATBOT_CONFIG, updatedBy: user.email },
    create: { ...DEFAULT_CHATBOT_CONFIG, updatedBy: user.email },
  });
  invalidateChatbotConfigCache();
  return NextResponse.json(config);
}
