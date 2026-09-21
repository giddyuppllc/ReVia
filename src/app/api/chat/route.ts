export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { researchCompounds } from "@/data/research-compounds";
import { notifyTeam } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { getChatbotConfig } from "@/lib/chatbotConfig";

/* ------------------------------------------------------------------ */
/*  POST /api/chat — ReVia Research Assistant (OpenAI GPT)             */
/* ------------------------------------------------------------------ */

// ── Server-side off-topic blocklist (hardcoded safety net) ──
const OFF_TOPIC_PATTERNS = [
  /write (me |a )?(poem|essay|story|code|script|song)/i,
  /what('s| is) the (weather|time|date|news)/i,
  /tell me a joke/i,
  /who (is|was) (the president|trump|biden|obama)/i,
  /(translate|convert) .+ (to|into) /i,
  /play .+ game/i,
  /(bitcoin|crypto|stock) price/i,
  /how (do|can) I (hack|crack|break)/i,
  /ignore (your|previous|all) (instructions|prompt|rules)/i,
  /you are now/i,
  /pretend (you're|to be)/i,
  /act as/i,
];

function isOffTopic(message: string): boolean {
  return OFF_TOPIC_PATTERNS.some((p) => p.test(message));
}

/**
 * Sessions whose address has already been handed over. See the note below.
 *
 * Bounded, because a long-lived instance would otherwise hold every session id
 * it has ever seen. Dropping the oldest can cost a duplicate notification on a
 * very old session, which is the harmless direction.
 */
const seenSessions = new Set<string>();
function rememberSession(id: string) {
  if (seenSessions.size >= 5000) seenSessions.delete(seenSessions.values().next().value as string);
  seenSessions.add(id);
}

/**
 * What the assistant is allowed to know about the compounds.
 *
 * This read the product table and handed the model every variant with its
 * price. On a site that publishes no prices, an assistant that will quote one
 * on request is the same claim by a different route — and it was quoting a
 * price list for a shop that no longer exists.
 *
 * The monographs replace it: names, categories and the same descriptions the
 * public pages carry. Availability and price are i2b's to state, and the system
 * prompt sends the question there.
 */
function getProductCatalog(): string {
  return researchCompounds
    .map((c) => `- ${c.name} [${c.category}]: ${c.description}`)
    .join("\n");
}


export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // ── Rate limit: 15 messages per IP per 10 minutes ──
    const { success } = rateLimit(`chat:${ip}`, 15, 10 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "You've sent too many messages. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const apiKey = process.env.OpenAi_chatbot_Key;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Our research assistant is being set up. Please email contact@revialife.com for help." },
        { status: 503 }
      );
    }

    const config = getChatbotConfig();
    if (!config.enabled) {
      return NextResponse.json(
        { error: "Our research assistant is temporarily offline. Please email contact@revialife.com for help." },
        { status: 503 }
      );
    }

    const { messages, sessionId, turnstileToken } = await request.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      sessionId?: string;
      turnstileToken?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // ── Turnstile verification on first message ──
    if (messages.length <= 1 && turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json(
          { error: "Verification failed. Please refresh and try again." },
          { status: 400 }
        );
      }
    }

    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content ?? "";

    // ── Server-side off-topic check (no API call) ──
    if (isOffTopic(lastUserMessage)) {
      return NextResponse.json({ message: config.offTopicResponse });
    }

    const recentMessages = messages.slice(-12);
    const catalog = getProductCatalog();

    const client = new OpenAI({ apiKey });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        { role: "system", content: `${config.systemPrompt}\n\n## CURRENT PRODUCT CATALOG\n${catalog}` },
        ...recentMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const text = response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that. Please try again.";

    // ── Hand over an address the visitor volunteered ──
    //
    // Every exchange used to append to a `ChatLead` row: transcript, message
    // count, products asked about, and any email that appeared. Most of that
    // was analytics nobody read. The part that mattered is the one thing a
    // transcript can contain that nothing else captures — somebody typing their
    // email address into the chat and expecting a reply.
    //
    // So only that is kept, and only once per session. `seenSessions` is in
    // memory, like the rate limiter beside it: a restart or a second instance
    // can cost a duplicate notification, which is the right way round for a
    // message a person is waiting on an answer to.
    if (sessionId && !seenSessions.has(sessionId)) {
      const emailMatch = (recentMessages.map((m) => m.content).join(" ") + " " + text).match(
        /[\w.-]+@[\w.-]+\.\w{2,}/,
      );
      if (emailMatch) {
        rememberSession(sessionId);
        try {
          await notifyTeam(
            "Someone left an address in the chat",
            {
              Email: emailMatch[0],
              "They asked": lastUserMessage,
              "Assistant replied": text,
            },
            { replyTo: emailMatch[0] },
          );
        } catch (err) {
          // The visitor has their answer; a failed handover must not break the
          // conversation. Logged so it is recoverable from the request log.
          console.error("chat: could not hand over the address", err);
        }
      }
    }

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return NextResponse.json(
      { error: "I'm having a moment. Please try again or email us at contact@revialife.com." },
      { status: 500 }
    );
  }
}
