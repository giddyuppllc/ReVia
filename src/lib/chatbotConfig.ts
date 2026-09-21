import { REVIA_NETWORK } from "@/lib/partner";

/**
 * What the assistant on revialife.com is.
 *
 * ## Why this was rewritten
 *
 * The prompt described a shop. It carried a shipping price list
 * ("Standard $7.95, Priority $12.95"), the payment methods, an all-sales-final
 * policy, a monthly rewards drawing, and the instruction that a free account was
 * required to order — and it was mounted in the root layout, so it answered on
 * every page of a site that no longer sells anything and publishes no prices.
 * An assistant that will quote a price on request publishes that price; the
 * fact that it takes a question first does not change what was said.
 *
 * It also carried a LEAD CAPTURE section telling it to work the visitor's email
 * address out of them once the conversation was going well. That is a sales
 * mechanic, and it is the one thing on this site that could do it
 * conversationally, where nobody reviews the wording.
 *
 * ## What it is now
 *
 * A reference desk. It explains compounds and the published research on them,
 * it explains what a certificate of analysis says, and when asked where to
 * obtain something it names i2b Health and stops — because price and
 * availability are i2b's to state and change, and anything this assistant said
 * about them would be a guess with ReVia's name on it.
 *
 * The RUO language discipline is unchanged and still the strictest part of the
 * prompt.
 */

const NETWORK_LINES = REVIA_NETWORK.map(
  (s) => `- ${s.name} (${s.audience}): ${s.tagline}`,
).join("\n");

const DEFAULT_SYSTEM_PROMPT = `You are ReVia's research reference assistant on revialife.com.

## IDENTITY
- revialife.com is ReVia's brand and public-record site. It sells nothing.
- You are professional, concise, and genuinely helpful.
- You speak like an informed reference librarian, not a salesperson and not a chatbot.
- Keep answers to 2-3 short paragraphs maximum. Be direct.

## LEGAL COMPLIANCE (CRITICAL — NEVER VIOLATE)
Every compound discussed is Research Use Only (RUO). Follow these rules strictly:

ALWAYS say: "studied for", "investigated for", "researched for", "observed in preclinical models", "published literature suggests", "in vitro/in vivo studies indicate"

NEVER say: "treats", "cures", "heals", "helps with", "you should take", "dosage", "dose", "patients", "treatment", "therapy", "medicine", "supplement"

If asked about dosing or human use, say exactly:
"These compounds are for laboratory research only. I can share what concentrations have been referenced in published studies, but I cannot provide guidance on human administration. Please consult published literature and your institutional protocols."

## NO PRICES, NO AVAILABILITY, NO ORDERS (CRITICAL)
This site publishes no prices and takes no orders. You do not know what anything
costs, what is in stock, what shipping costs, or how long anything takes. Never
estimate, never quote a figure you have seen elsewhere, and never describe an
ordering, payment or returns process.

If asked about price, stock, shipping, payment or returns, say:
"revialife.com is our brand and public-record site — it doesn't sell anything, so I don't have prices or stock. Compounds are supplied by i2b Health, a separate company with its own catalog and terms. Their product pages carry the current price and a certificate for the lot."

## SCOPE
You discuss:
- Peptides and research compounds: mechanisms, published studies, research applications
- How to read a certificate of analysis, and what RP-HPLC with UV detection reports
- ReVia's position, the FDA record on revialife.com/washington, and the news posts
- Which property in the group covers which audience

You do not discuss:
- Anything unrelated to peptides, research, or ReVia
- Politics, news, entertainment, coding, general knowledge
- Other companies' products

If asked something off-topic, say: "I'm here for research questions about peptides and about ReVia's record. Is there a compound or a document I can help with?"

## THE GROUP
${NETWORK_LINES}

## CONTACT
- contact@revialife.com
- Purity, identity, quantity and metals are reported per batch by RP-HPLC with UV detection; a batch-specific certificate names the laboratory and the lot.

## STYLE
- Concise: 2-3 short paragraphs max
- Warm but professional
- Never invent a compound, a study, a figure or a certificate. If you do not know, say so and point at the published record.`;

const DEFAULT_KEYWORDS = [
  "peptide", "bpc", "tb-500", "tb500", "ghk", "tirz", "sema", "reta", "mots",
  "ipamor", "cjc", "sermor", "tesam", "ghrp", "igf", "foxo", "fox-04", "epitalon",
  "humanin", "nad", "ss-31", "slu", "selank", "semax", "dihexa", "pinealon",
  "cerebrolysin", "kisspeptin", "pt-141", "pt141", "dsip", "melanotan", "oxytocin",
  "thymalin", "thymosin", "kpv", "ll-37", "vip", "ara-290", "follistatin",
  "hexarellin", "aicar", "aod", "adipotide", "mazdutide", "survodutide",
  "cagrilintide", "retatrutide", "tirzepatide", "semaglutide",
  "stack", "blend", "oral", "liquid", "serum", "snap-8", "privive", "glutathione",
  "l-carnitine", "bac water",
  // Commerce words are kept deliberately. They are what makes a message
  // on-topic enough to reach the model, which then answers with the NO PRICES
  // paragraph above. Dropping them would send "how much is BPC-157?" to the
  // generic deflection, which answers nothing and tells the visitor nowhere to
  // go.
  "price", "cost", "buy", "purchase", "order", "ship", "shipping", "stock", "available",
  "i2b", "where", "supplier", "partner",
  "revia", "research", "purity", "coa", "certificate", "lab", "quality", "batch", "lot",
  "fda", "washington", "committee", "compounding", "record", "statement",
  "weight", "fat", "metabol", "growth", "hormone", "recovery", "heal", "repair",
  "immune", "neuro", "brain", "cognit", "longev", "aging",
  "skin", "cosmetic", "tanning", "sleep", "sexual", "reproduct",
  "what do you", "what peptide", "tell me about", "do you carry", "do you have",
  "how do i", "how much", "recommend", "suggest", "compare", "difference",
  "hello", "hi", "hey", "help", "thanks", "thank you",
].join("\n");

const DEFAULT_CLIENT_DEFLECT =
  "I'm ReVia's research reference assistant — I can help with compounds, published research, certificates of analysis, or our record with the FDA. What would you like to know?";

const DEFAULT_OFF_TOPIC =
  "I'm here for research questions about peptides and about ReVia's record. Is there a compound or a document I can help with?";

const DEFAULT_QUICK_QUESTIONS = JSON.stringify([
  "What does a certificate of analysis actually report?",
  "Tell me about BPC-157 research",
  "What did ReVia say at the FDA committee?",
  "Where are these compounds supplied from?",
]);

export const DEFAULT_CHATBOT_CONFIG = {
  id: "singleton",
  enabled: true,
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  topicKeywords: DEFAULT_KEYWORDS,
  clientDeflect: DEFAULT_CLIENT_DEFLECT,
  offTopicResponse: DEFAULT_OFF_TOPIC,
  welcomeTitle: "How can I help with your research?",
  welcomeBody: "Ask about compounds, mechanisms, certificates of analysis, or our record with the FDA.",
  quickQuestions: DEFAULT_QUICK_QUESTIONS,
};

/**
 * The assistant's configuration.
 *
 * This read a `chatbotConfig` singleton row, creating it from the defaults
 * below on first call, and cached it for a minute — so that an admin screen
 * could edit the system prompt. That screen is gone with the rest of the admin,
 * which left a database round trip whose only possible answer was the constant
 * defined immediately above it.
 *
 * It is now that constant. The prompt is reviewed in a diff like the rest of
 * the site's copy, which is the right place for the text that decides what an
 * assistant will say on the company's behalf.
 */
export function getChatbotConfig(): typeof DEFAULT_CHATBOT_CONFIG {
  return DEFAULT_CHATBOT_CONFIG;
}

export function parseKeywords(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
}
