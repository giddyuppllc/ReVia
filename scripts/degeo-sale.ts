/**
 * One-off: take the merchant out of 25 metros of geo copy.
 *
 * ## What this is for
 *
 * `src/data/geo-copy.ts` is 2.4MB of per-city, per-compound prose — the single
 * largest body of public writing ReVia owns, and the reason the location pages
 * rank. It contains no prices, which is why it survived the first pass. What it
 * does contain is roughly eight thousand sentences in which ReVia Life ships,
 * supplies, sells, fulfils and delivers to the reader's city.
 *
 * A site that sells nothing telling eighteen hundred pages of readers that it
 * ships to them is a larger exposure than any price literal, and until the
 * claims checker was widened it could not see any of it.
 *
 * ## Why a script and not a rewrite
 *
 * Regenerating the copy would cost the thing that makes it worth keeping: every
 * entry names its own city, its neighbouring towns and its own compound. The
 * transform preserves all of that and replaces only the verb and its subject,
 * so "Yes, we ship 5-Amino-1MQ to Fort Lauderdale and adjacent Hollywood,
 * Pompano Beach, and Plantation" becomes a sentence about where a Fort
 * Lauderdale researcher obtains it, with the same three towns in it.
 *
 * ## How to be sure it worked
 *
 * The transform runs per string value — each "q", "a" and "intro" is pulled out,
 * rewritten and put back — rather than as a sweep over the whole file. A global
 * regex over 2.4MB cannot tell a question from an answer, and the first version
 * that tried proved it: "Is Tirzepatide available for shipping to Providence?"
 * came out as "Where do researchers in shipping to Providence obtain
 * Tirzepatide?" a hundred and thirty-two times, because the place capture
 * happily swallowed the word "shipping".
 *
 * `--audit` re-splits the file into sentences, applies the same trigger the
 * checker uses, and prints what is left with a count per shape. The rules below
 * were written by running that repeatedly until the residue was only sentences
 * that make no supply claim. Run it after any edit to this file:
 *
 *     npx tsx scripts/degeo-sale.ts --audit
 *
 * Delete this script once the copy is settled; it is not part of the build.
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/data/geo-copy.ts";
const PARTNER = "i2b Health, ReVia's research partner";

const PLACE = String.raw`[^?]+?`;

/**
 * "Will the REcover Sample Pack ship to Washington, DC?" and its forty
 * variants. One shape covers them all: an optional auxiliary, a subject, a
 * transport verb, and a destination. Rewritten to ask where a researcher there
 * obtains the thing, which is the question the reader actually has and the one
 * this site can answer honestly.
 */
const SHIPPING_QUESTION = new RegExp(
  String.raw`^(?:Will|Can|Does|Do|Is|Are|How\s+(?:is|are|does|do))\s+` +
    String.raw`(.+?)\s+` +
    String.raw`(?:ship|ships|shipped|shipping|deliver|delivers|delivered|be\s+shipped|be\s+delivered|available\s+for\s+shipping|available\s+for\s+delivery)\s+` +
    String.raw`(?:to|in)\s+(${PLACE})\?$`,
  "i",
);

/** Rules applied to a question string. First match wins. */
const QUESTION_RULES: [RegExp, (...m: string[]) => string][] = [
  [/^Do(?:es)?\s+(?:you|ReVia(?: Life)?)\s+(?:ship|deliver|send)\s+(.+?)\s+to\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
  [/^Do(?:es)?\s+(?:you|ReVia(?: Life)?)\s+(?:ship|deliver|send)\s+to\s+([^?]+)\?$/i,
   (_m, where) => `Where do researchers in ${place(where)} obtain these compounds?`],
  [/^Can\s+I\s+(?:get|order|buy|purchase)\s+(.+?)\s+(?:shipped|delivered|sent)?\s*(?:to|in)\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
  [/^(?:How|Where)\s+(?:can|do)\s+I\s+(?:order|buy|purchase|get)\s+(.+?)\s+(?:to|in)\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
  [/^(?:How\s+(?:quickly|fast|long)\s+)?(?:does|do|can|will)\s+(?:ReVia(?: Life)?|you)\s+(?:ship|deliver|send)\s+(.+?)\s+(?:to|within|across|throughout)\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
  [SHIPPING_QUESTION,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${stripAux(what)}?`],
  // Anything left that still asks about ordering, without a place.
  [/^(?:How|Where)\s+(?:can|do)\s+I\s+(?:place an order|order|buy|purchase)\b[^?]*\?$/i,
   () => `Where are these compounds obtained?`],
  [/^How\s+(?:does|do)\s+(?:ReVia(?: Life)?|you)\s+(?:ship|handle shipping for|deliver)\s*([^?]*)\?$/i,
   (_m, tail) => `How does supply of ${(tail || "").trim() || "these compounds"} work?`],
  [/^Is\s+(.+?)\s+available\s+for\s+(?:shipment|shipping|delivery|order|purchase)\s+(?:to|in)\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
  [/^What\s+are\s+the\s+(?:shipping|delivery|ordering)\s+options\s+for\s+(.+?)\s+to\s+([^?]+)\?$/i,
   (_m, what, where) => `Where do researchers in ${place(where)} obtain ${what}?`],
];

/**
 * "researchers in Miami" -> "Miami".
 *
 * The question templates wrap the captured place in "researchers in …", and
 * several source questions already say it — "Will Cagrilintide ship to
 * researchers in Miami?" came out as "Where do researchers in researchers in
 * Miami obtain Cagrilintide?" sixteen times before this existed.
 */
function place(where: string): string {
  return where
    .trim()
    .replace(/^(?:researchers|labs|laboratories|investigators|research (?:teams|facilities|labs))\s+(?:in|across|throughout)\s+/i, "")
    .replace(/^(?:a|an|the)\s+/i, "");
}

/** "you ship Retatrutide" -> "Retatrutide"; "the REcover Sample Pack" is kept. */
function stripAux(subject: string): string {
  return subject.replace(/^(?:you|ReVia(?: Life)?)\s+(?:ship|deliver|send)\s+/i, "").trim();
}

/** Rules applied to an answer or intro. All are applied, in order. */
const RULES: [RegExp, string | ((...m: string[]) => string)][] = [
  /* ---- answers that assert WE ship --------------------------------- */
  [/\bYes,?\s+we\s+(?:ship|deliver|send)\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\bYes,?\s+we\s+(?:ship|deliver|send)\s+to\s+([^.]+)\./g,
   (_m, where) => `These compounds are supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\bYes,?\s+(?:ReVia Life|ReVia)\s+ships\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\bYes,?\s+([^.]*?)\s+ships\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\bWe\s+(?:ship|deliver|send|dispatch)\s+to\s+([^.]+)\./g,
   (_m, where) => `These compounds are supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\bWe\s+(?:ship|deliver|send|dispatch)\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER}, to researchers in ${place(where)}.`],
  [/\b(?:ReVia Life|ReVia)\s+ships\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER} to researchers in ${place(where)}.`],
  [/\b([A-Za-z0-9][\w+\-.()/ ]*?)\s+ships\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER} to researchers in ${place(where)}.`],
  [/\b([A-Za-z0-9][\w+\-.()/ ]*?)\s+(?:is|are)\s+shipped\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER} to researchers in ${place(where)}.`],

  // The same claim with no destination — "ReVia Life ships each vial with
  // third-party COA testing", "ReVia Life ships it for research use only".
  // These have no "to {city}" for the rules above to hang on, and they are the
  // most common shape of all once the geographic ones are gone.
  [/\b(?:ReVia Life|ReVia)\s+ships\s+([^.]*?)\s+with\s+/g,
   (_m, what) => `${cap(what)} carries `],
  [/\b(?:ReVia Life|ReVia)\s+ships\s+([^.]*?)\s+for\s+/g,
   (_m, what) => `${cap(what)} is supplied for `],
  [/\b(?:ReVia Life|ReVia)\s+ships\s+([^.]*?)\s+across\s+/g,
   (_m, what) => `${cap(what)} is documented across `],
  [/\b(?:ReVia Life|ReVia)\s+ships\b/g, "ReVia documents"],
  [/\bWe\s+(?:ship|deliver|send|dispatch)\s+([^.]*?)\s+(?:throughout|across|within)\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is supplied through ${PARTNER}, to researchers across ${place(where)}.`],
  [/\bwe ship\s+for\s+/g, "supply is for "],
  [/\bwe ship\b/g, "these compounds are supplied"],

  /* ---- first-person supply ----------------------------------------- */
  [/\b(?:ReVia Life|ReVia)\s+supplies\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is documented by ReVia for ${where}.`],
  [/\b(?:ReVia Life|ReVia)\s+supplies\b/g, "ReVia documents"],
  // Same claim, different verb. "ReVia Life provides X to labs in Y" says this
  // company hands the compound over; 565 of these were left standing by a rule
  // set that only knew the word "supplies".
  [/\b(?:ReVia Life|ReVia)\s+(?:offers|provides)\s+([^.]*?)\s+to\s+([^.]+)\./g,
   (_m, what, where) => `${cap(what)} is documented by ReVia for ${place(where)}.`],
  [/\b(?:ReVia Life|ReVia)\s+(?:offers|provides)\b/g, "ReVia documents"],
  [/\bWe\s+(?:provide|supply|offer)\s+([^.]*?)\s+(?:strictly\s+)?for\s+/g,
   (_m, what) => `${cap(what)} is documented for `],
  [/\bWe\s+(?:provide|supply|offer)\b/g, "ReVia documents"],
  [/\bsource\s+([\w+\-.()/ ]+?)\s+from\s+(?:ReVia Life|ReVia)\b/g,
   (_m, what) => `read ReVia's record on ${what}`],
  [/\bcan source the same catalog\b/g, "can read the same monographs"],
  [/\bour catalog\b/g, "our record"],
  [/\bthe same catalog\b/g, "the same monographs"],
  [/\bthe full catalog\b/g, "the full record"],

  /* ---- "ships with a COA": the claim is the COA, not the transport -- */
  [/\b(?:ships|ship)\s+with\s+(an?|its own|third-party|independent)\b/g, "carries $1"],
  [/\b(?:ships|ship)\s+with\b/g, "carries"],
  [/\b(?:ships|ship)\s+(research-use-only|strictly|solely|exclusively)\b/g, "is $1"],
  [/\bStock\s+(?:ships|is shipped)\b/g, "Stock is"],
  [/\b(?:is|are)\s+shipped\s+(?:strictly\s+)?for\b/g, "is intended for"],
  [/\bshipped to support\b/g, "documented to support"],
  [/\bShipments\s+include\b/g, "Every lot carries"],
  [/\b(?:Every|Each)\s+order\s+includes\b/g, "Every lot carries"],
  [/\bThe COA is included with\b/g, "The COA is issued for"],
  [/\b(?:Each|Every)\s+order\s+(?:ships|is shipped)\b/g, "Every lot is"],
  [/\b(?:Each|Every)\s+order\s+is\b/g, "Every lot is"],
  [/\bDelivery is\b/g, "Supply is"],
  [/\b(?:Each|Every)\s+shipment\s+is\b/g, "Every lot is"],
  [/\b(?:Each|Every)\s+order\s+(?:arrives with|carries|includes)\b/g, "Every lot carries"],
  [/\bOrders\s+include\b/g, "Every lot carries"],
  [/\bOrders\s+ship\s+for\b/g, "Supply is intended for"],
  [/\b(?:vial|lot|batch|compound)\s+ships\s+for\b/g, "$& ".replace("ships for", "is intended for")],
  [/\b(vials?|lots?|batch(?:es)?|compounds?)\s+ships?\s+for\b/gi, "$1 is intended for"],
  [/\bAll orders follow\b/g, "All supply follows"],
  [/\bresearch-use-only shipping\b/g, "research-use-only handling"],
  [/(^|[.!?]\s+)Shipped for\b/g, "$1Supplied for"],
  [/(^|[.!?]\s+)Sold for\b/g, "$1Supplied for"],
  [/\b(?:Third-party COA (?:testing|documentation))\s+accompanies\s+(?:each|every)\s+(\w+)\b/g,
   "A third-party certificate of analysis is issued for every $1"],

  /* ---- orders, shipments and deliveries as sentence subjects -------- */
  // Anchored to a sentence start. An earlier version replaced them anywhere,
  // which turned "Southern New England orders are research-use-only" into
  // "Southern New England Supply is research-use-only".
  [/(^|[.!?]\s+)All orders are\b/g, "$1All supply is"],
  [/(^|[.!?]\s+)All shipments are\b/g, "$1All supply is"],
  [/(^|[.!?]\s+)All deliveries are\b/g, "$1All supply is"],
  [/(^|[.!?]\s+)Orders are\b/g, "$1Supply is"],
  [/(^|[.!?]\s+)Shipments are\b/g, "$1Supply is"],
  [/(^|[.!?]\s+)Deliveries are\b/g, "$1Supply is"],
  [/\b([\w' ]+?)\s+orders are\b/g, "$1 supply is"],
  [/\b([\w' ]+?)\s+shipments are\b/g, "$1 supply is"],

  /* ---- sold ---------------------------------------------------------- */
  // Negatives are left exactly as they are: "never sold for human consumption"
  // is the disclaimer, and weakening it would be the opposite of the point.
  [/\bis sold for\b/g, "is supplied for"],
  [/\bis sold strictly for\b/g, "is supplied strictly for"],
  [/\bare sold for\b/g, "are supplied for"],
  [/\bis offered for research\b/g, "is supplied for research"],
];

/**
 * Repair subject-verb agreement the rewrites broke.
 *
 * The answer templates are built around a singular subject — "{compound} is
 * supplied through …" — and some sources put a plural one in front of the verb:
 * "Research-use-only orders ship to Miami" came out as "Research-use-only
 * orders is supplied through …". Rewriting the noun is better than agreeing the
 * verb where the noun is an order, because this site has no orders; elsewhere
 * the verb is simply corrected.
 */
function agree(s: string): string {
  return s
    .replace(/\borders is\b/g, "supply is")
    .replace(/\bshipments is\b/g, "supply is")
    .replace(/\bdeliveries is\b/g, "supply is")
    .replace(/\b(vials|lots|batches|compounds|syringes|kits|packs|peptides) is\b/g, "$1 are");
}

function cap(s: string): string {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** The checker's trigger, used to find what a pass did not reach. */
const TRIGGER =
  /\b(ship|ships|shipped|shipping|shipment|shipments|sell|sells|sold|order|orders|deliver|delivers|delivery|deliveries|purchase|buy|in stock)\b/i;

/** Sentences that mention supply without claiming ReVia performs it. */
const BENIGN = [
  // A refusal is the disclaimer, not a claim.
  /\bnot (?:for sale|sold)\b/i,
  /\bnever sold\b/i,
  /\bnot for (?:human|veterinary)\b/i,
  // The replacement phrasings. Listed narrowly and in full rather than as a
  // loose "supplied" match, so a sentence that merely contains the word does
  // not disappear from the audit.
  /\bsupplied through i2b\b/i,
  /\bdocumented by ReVia\b/i,
  /^Supply is\b/i,
  /^All supply is\b/i,
  /\bWhere do researchers in\b/i,
  /\bi2b\b/i,
];

function sentences(text: string): string[] {
  const vals = text.match(/"(?:intro|a|q)":\s*"(?:[^"\\]|\\.)*"/g) ?? [];
  return vals.flatMap((v) => v.split(/(?<=[.?!])\s+/)).map((s) => s.trim());
}

function audit(text: string) {
  const left = sentences(text).filter(
    (s) => TRIGGER.test(s) && !BENIGN.some((b) => b.test(s)),
  );
  const shapes = new Map<string, number>();
  for (const s of left) {
    const key = s.replace(/^"(?:intro|a|q)":\s*"/, "").split(/\s+/).slice(0, 5).join(" ");
    shapes.set(key, (shapes.get(key) ?? 0) + 1);
  }
  console.log(`residue: ${left.length} sentences, ${shapes.size} shapes`);
  for (const [k, n] of [...shapes].sort((a, b) => b[1] - a[1]).slice(0, 40)) {
    console.log(`${String(n).padStart(5)}  ${k}`);
  }
}

const raw = readFileSync(FILE, "utf8");

if (process.argv.includes("--audit")) {
  audit(raw);
} else {
  // Per string value — see the note at the top about why not a global sweep.
  const out = raw.replace(
    /"(intro|a|q)":\s*"((?:[^"\\]|\\.)*)"/g,
    (whole, key: string, value: string) => {
      let v = value;
      if (key === "q") {
        for (const [re, fn] of QUESTION_RULES) {
          const m = v.match(re);
          if (m) {
            v = fn(...(m as unknown as string[]));
            break;
          }
        }
      }
      for (const [re, rep] of RULES) v = v.replace(re, rep as never);
      v = agree(v);
      return v === value ? whole : `"${key}": "${v}"`;
    },
  );
  if (process.argv.includes("--apply")) {
    writeFileSync(FILE, out);
    console.log("written.");
  } else {
    console.log("DRY RUN — pass --apply to write.");
  }
  audit(out);
}
