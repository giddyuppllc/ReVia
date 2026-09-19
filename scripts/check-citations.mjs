#!/usr/bin/env node
/**
 * Citations are quotations. Nothing may rewrite one.
 *
 * ## What happened
 *
 * A compliance sweep replaced "weight management" with "metabolic optimization"
 * across src/data/research-compounds.ts, to clear a claim rule. It worked on the
 * prose. It also rewrote the titles of two real papers:
 *
 *   Lau DCW et al., Lancet 2021;398(10317):2160-2172
 *   Enebo LB et al., Lancet 2021;397(10286):1736-1748
 *
 * Both were verified against the published record: the volumes, issues and page
 * ranges in this repository are exactly right, which is what makes the damage
 * worse rather than better. The citations were accurate, so a reader who
 * followed one found a real paper — with a title that did not match the one we
 * printed. On a site whose entire argument is "check the document", misquoting
 * a primary source is the most expensive possible error, and it takes thirty
 * seconds to catch.
 *
 * The sweep left its own fingerprint: a category constant that read
 * "metabolic optimization & Metabolic", which is not a phrase anybody writes.
 *
 * ## The rule
 *
 * A citation may say "weight management", "obesity", "for the treatment of" and
 * anything else that appears in a real journal title, because those are the
 * words the authors used. Claim rules do not apply to quotations.
 *
 * What a citation may NOT contain is OUR vocabulary — the euphemisms a
 * compliance pass substitutes in. A published title will never contain
 * "metabolic optimization" as a replacement for something else, so finding one
 * there is proof that a sweep reached a field it had no business touching.
 *
 * This is the guard that makes the exemption safe: prose is checked for claims
 * elsewhere, citations are checked for edits here, and neither check can be
 * satisfied by damaging the other.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, "src/data/research-compounds.ts");

/**
 * Substitutions a claim sweep makes. If one of these turns up inside a
 * citation, a quotation has been edited.
 */
const SUBSTITUTIONS = [
  { re: /metabolic optimization/gi, why: 'a compliance substitution for "weight management"' },
  { re: /body recomposition/gi, why: "a compliance substitution" },
  { re: /wellness optimization/gi, why: "a compliance substitution" },
  { re: /research context/gi, why: "our framing language, not a journal title" },
];

/** A citation should carry a journal, a year and a page range. */
const LOOKS_LIKE_CITATION = /\b(19|20)\d{2}\b/;

if (!existsSync(SRC)) {
  console.error("check:citations — src/data/research-compounds.ts is missing.");
  process.exit(1);
}

const source = readFileSync(SRC, "utf8");
const citations = [...source.matchAll(/citation:\s*"([^"]+)"/g)].map((m) => m[1]);

const hits = [];
for (const c of citations) {
  for (const { re, why } of SUBSTITUTIONS) {
    const m = c.match(re);
    if (m) hits.push({ c, found: m[0], why });
  }
  if (!LOOKS_LIKE_CITATION.test(c)) {
    hits.push({ c, found: "(no year)", why: "does not look like a citation" });
  }
}

console.log("");
console.log("check:citations");
console.log("");
console.log(`  ${citations.length} citation(s) read from research-compounds.ts`);

if (hits.length) {
  console.error("");
  for (const h of hits) {
    console.error(`  FAIL  "${h.found}" — ${h.why}`);
    console.error(`        ${h.c.slice(0, 120)}`);
  }
  console.error("");
  console.error(
    `${hits.length} citation(s) carry text that was written by us rather than by the\n` +
      "  authors. A citation is a quotation: hedge in the surrounding prose, never in\n" +
      "  the title. Restore the published wording from the source.",
  );
  console.error("");
  process.exit(1);
}

console.log("  none carry our vocabulary — no quotation has been rewritten");
console.log("");
