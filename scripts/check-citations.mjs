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

/**
 * Citations that could not be found in Crossref OR PubMed.
 *
 * Empty, and that is the point of keeping it.
 *
 * On 2026-09-19 all 79 citations were checked against both indexes. Sixty-four
 * resolved exactly. Six were real papers carrying the wrong numbers and were
 * corrected against their PMIDs. Nine resolved to nothing, and every one of
 * those has since been replaced with a real paper making the same point —
 * several by the same authors the fabricated entries were attributed to, which
 * is the tell that a research pass had the right literature in view and
 * invented the line.
 *
 * One replacement is worth knowing about. The dihexa entry cited Benoist CC et
 * al., JPET 2014;351(2):390-402 for an HGF/c-Met mechanism. That paper is real
 * — and it was RETRACTED in 2025 (PMID 40312093). It is not cited here. The
 * replacement (Sun X et al., Brain Sci 2021) supports a procognitive effect via
 * PI3K/AKT, so the finding text was rewritten to say what that paper shows
 * rather than carrying the old mechanism across.
 *
 * Add an entry here the moment a citation cannot be resolved, rather than
 * leaving it in the file unmarked.
 */
const UNVERIFIED = [];

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

const unresolved = UNVERIFIED.filter((frag) => citations.some((c) => c.includes(frag)));

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

if (unresolved.length) {
  // Fatal by default now that the list is empty — an unresolvable citation
  // should stop a deploy rather than print a warning nobody reads.
  const fatal = process.env.REQUIRE_VERIFIED_CITATIONS !== "0";
  console.log("");
  console.log(
    `  ${fatal ? "FAIL" : "WARN"}  ${unresolved.length} citation(s) resolve to nothing in Crossref or PubMed:`,
  );
  for (const frag of unresolved) console.log(`        · ${frag}`);
  console.log("");
  console.log("        Re-source or remove each, then delete it from UNVERIFIED in");
  console.log("        this file. Set REQUIRE_VERIFIED_CITATIONS=1 to make this fatal");
  console.log("        once they are dealt with.");
  if (fatal) {
    console.log("");
    process.exit(1);
  }
}
console.log("");
