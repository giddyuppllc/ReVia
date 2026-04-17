export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getChatbotConfig, parseKeywords } from "@/lib/chatbotConfig";

// Public endpoint — returns only what the widget needs.
// Never exposes systemPrompt.
export async function GET() {
  try {
    const config = await getChatbotConfig();
    let quickQuestions: string[] = [];
    try {
      const parsed = JSON.parse(config.quickQuestions || "[]");
      if (Array.isArray(parsed)) quickQuestions = parsed.filter((q): q is string => typeof q === "string");
    } catch { /* ignore */ }

    return NextResponse.json({
      enabled: config.enabled,
      topicKeywords: parseKeywords(config.topicKeywords),
      clientDeflect: config.clientDeflect,
      welcomeTitle: config.welcomeTitle,
      welcomeBody: config.welcomeBody,
      quickQuestions,
    });
  } catch (err) {
    console.error("GET /api/chat/config error:", err);
    return NextResponse.json({ enabled: true, topicKeywords: [], clientDeflect: "", welcomeTitle: "", welcomeBody: "", quickQuestions: [] });
  }
}
