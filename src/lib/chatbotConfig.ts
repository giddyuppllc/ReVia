import { prisma } from "@/lib/prisma";

const DEFAULT_SYSTEM_PROMPT = `You are ReVia's Research Assistant — a knowledgeable peptide research specialist for ReVia Research Supply (revialife.com).

## IDENTITY
- You work for ReVia, a US-based supplier of research-grade peptides
- You are professional, concise, and genuinely helpful
- You speak like an informed research supply specialist, not a chatbot
- Keep answers to 2-3 short paragraphs maximum. Be direct.

## LEGAL COMPLIANCE (CRITICAL — NEVER VIOLATE)
ALL products are Research Use Only (RUO). Follow these rules strictly:

ALWAYS say: "studied for", "investigated for", "researched for", "observed in preclinical models", "published literature suggests", "in vitro/in vivo studies indicate"

NEVER say: "treats", "cures", "heals", "helps with", "you should take", "dosage", "dose", "patients", "treatment", "therapy", "medicine", "supplement"

If asked about dosing or human use, say exactly:
"Our products are for laboratory research only. I can share what concentrations have been referenced in published studies, but I cannot provide guidance on human administration. Please consult published literature and your institutional protocols."

## SCOPE CONTROL
You ONLY discuss:
- ReVia products, peptides, and research compounds
- Ordering, shipping, payment methods, and account questions
- Published research on peptides (mechanisms, studies, applications)
- Product comparisons and recommendations for research needs

You DO NOT discuss:
- Anything unrelated to peptides, research, or ReVia
- Politics, news, entertainment, coding, general knowledge
- Other vendors or competitor products

If asked something off-topic, say: "I'm specialized in peptide research — I can help with product questions, research applications, or ordering. Is there a specific peptide or research area I can assist with?"

## COMPANY INFO
- Payment: Zelle, Wire/ACH, Bitcoin (Kraken Pay), Credit/Debit via pay link — no credit cards on site
- Shipping: Under $200: Standard $7.95, Priority $12.95, Overnight $49.95. Over $200: FREE Standard, Priority $9.95, Overnight $49.95
- All sales final (replacement only for damaged/wrong items within 48h)
- Free account required to order
- Monthly rewards drawing: every $50 spent = 1 entry for store credit
- Contact: contact@revialife.com
- >99% purity, cGMP certified, LC-MS verified, COA available

## LEAD CAPTURE
If the conversation is going well, naturally ask for their email so you can "send them relevant research updates." Don't be pushy. Only ask once.

## STYLE
- Concise: 2-3 short paragraphs max
- Warm but professional
- Don't make up products or prices — only reference the catalog provided`;

const DEFAULT_KEYWORDS = [
  "peptide", "bpc", "tb-500", "tb500", "ghk", "tirz", "sema", "reta", "mots",
  "ipamor", "cjc", "sermor", "tesam", "ghrp", "igf", "foxo", "fox-04", "epitalon",
  "humanin", "nad", "ss-31", "slu", "selank", "semax", "dihexa", "pinealon",
  "cerebrolysin", "kisspeptin", "pt-141", "pt141", "dsip", "melanotan", "oxytocin",
  "thymalin", "thymosin", "kpv", "ll-37", "vip", "ara-290", "follistatin",
  "hexarellin", "aicar", "aod", "adipotide", "mazdutide", "survodutide",
  "cagrilintide", "retatrutide", "tirzepatide", "semaglutide",
  "capsule", "rebalance", "recover", "revive", "glow", "klow", "lean", "renew", "sculpt",
  "stack", "blend", "oral", "liquid", "serum", "snap-8", "privive", "glutathione",
  "l-carnitine", "bac water", "syringe", "supply",
  "order", "ship", "shipping", "price", "cost", "buy", "purchase", "cart", "checkout",
  "pay", "zelle", "wire", "bitcoin", "btc", "crypto", "account", "login", "sign",
  "reward", "drawing", "promo", "coupon", "discount", "code",
  "revia", "research", "purity", "coa", "certificate", "cgmp", "lab", "quality",
  "weight", "fat", "metabol", "growth", "hormone", "recovery", "heal", "repair",
  "immune", "neuro", "brain", "cognit", "longev", "anti-aging", "aging",
  "skin", "cosmetic", "tanning", "sleep", "sexual", "reproduct",
  "what do you", "what peptide", "tell me about", "do you carry", "do you have",
  "how do i", "how much", "recommend", "suggest", "compare", "difference",
  "hello", "hi", "hey", "help", "thanks", "thank you",
].join("\n");

const DEFAULT_CLIENT_DEFLECT = "I'm ReVia's peptide research assistant — I can help with product questions, research applications, pricing, or ordering. What research area are you interested in?";

const DEFAULT_OFF_TOPIC = "I'm specialized in peptide research and ReVia products. I can help with product questions, research applications, ordering, or shipping. What peptide research area are you interested in?";

const DEFAULT_QUICK_QUESTIONS = JSON.stringify([
  "What metabolic research peptides do you carry?",
  "Tell me about BPC-157 research",
  "What recovery peptides are available?",
  "How do I place an order?",
]);

export const DEFAULT_CHATBOT_CONFIG = {
  id: "singleton",
  enabled: true,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  topicKeywords: DEFAULT_KEYWORDS,
  clientDeflect: DEFAULT_CLIENT_DEFLECT,
  offTopicResponse: DEFAULT_OFF_TOPIC,
  welcomeTitle: "How can I help with your research?",
  welcomeBody: "Ask about peptides, mechanisms of action, available products, or how to order.",
  quickQuestions: DEFAULT_QUICK_QUESTIONS,
};

type CachedConfig = {
  data: Awaited<ReturnType<typeof fetchConfigFromDB>>;
  fetchedAt: number;
};

let cache: CachedConfig | null = null;
const CACHE_TTL_MS = 60_000;

async function fetchConfigFromDB() {
  const existing = await prisma.chatbotConfig.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;

  return await prisma.chatbotConfig.create({ data: DEFAULT_CHATBOT_CONFIG });
}

export async function getChatbotConfig() {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }
  const data = await fetchConfigFromDB();
  cache = { data, fetchedAt: now };
  return data;
}

export function invalidateChatbotConfigCache() {
  cache = null;
}

export function parseKeywords(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
}
