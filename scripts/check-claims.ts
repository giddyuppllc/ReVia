/* ------------------------------------------------------------------ */
/*  check:claims                                                       */
/*                                                                     */
/*  Fails the build when a claim this site cannot support gets written  */
/*  back into it.                                                      */
/*                                                                     */
/*  Every rule here exists because the thing it catches was live:       */
/*                                                                     */
/*   - the home page advertised "99.4% Avg Purity" and "12 QC Tests    */
/*     Per Batch" against a certificate that runs one method and        */
/*     reports four results, and a batch table with zero rows;          */
/*   - "42 COAs Published" when there were 39;                          */
/*   - "85+ compounds" in three files against 61 active / 38 documented;*/
/*   - LC-MS, endotoxin, sterility, bioburden, residual solvents and    */
/*     amino-acid sequencing across the ticker, /why-us, /about and the */
/*     batch component, none of them on any COA;                        */
/*   - a comparison table asserting competitors ship "70-85%" purity    */
/*     with "Fake or reused" certificates.                              */
/*                                                                     */
/*  A check that passes without reading anything is worse than no       */
/*  check, so this one is mutation-tested: see the note at the bottom.  */
/* ------------------------------------------------------------------ */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

const ROOT = process.cwd();
// src/content was missing until 2026-09-18, which meant the typed-module CMS —
// /news and the recovered articles, the largest body of editorial prose on the
// site — was outside the one gate written to check it. The whole argument for
// moving the blog out of the database was that "database HTML is scanned by
// nothing"; leaving it in an unscanned directory would have reproduced exactly
// that, in a place that merely looked safer.
const SCAN_DIRS = ["src/app", "src/components", "src/lib", "src/data", "src/content"];

/**
 * The purity specification, read out of src/lib/coa.ts rather than typed
 * here — otherwise this checker would itself contain a hardcoded claim,
 * which is the exact failure it exists to prevent.
 */
const PURITY_SPEC = (() => {
  const src = readFileSync(join(ROOT, "src/lib/coa.ts"), "utf8");
  const m = src.match(/puritySpec:\s*"([^"]+)"/);
  if (!m) {
    console.error("check:claims cannot read puritySpec from src/lib/coa.ts");
    process.exit(2);
  }
  return m[1];
})();

/** Just the number, e.g. "98%" from ">98%". */
const PURITY_FIGURE = PURITY_SPEC.replace(/[^\d.%]/g, "");

/** Admin is internal tooling; it may name what the lab does not run. */
const SKIP_PATH_PARTS = [
  `${sep}admin${sep}`,
  `${sep}api${sep}admin${sep}`,
  `${sep}node_modules${sep}`,
  `${sep}.next${sep}`,
];

interface Rule {
  id: string;
  why: string;
  pattern: RegExp;
  /** Files permitted to contain the pattern. */
  allow?: string[];
  /** Path prefixes this rule does not apply to. */
  skipPrefixes?: string[];
  /** Extra filter — return true to treat a match as a real violation. */
  confirm?: (line: string, file: string) => boolean;
}

/**
 * A comment is documentation, not a claim. Several of these rules exist
 * *because* a comment now records what was removed and why, and the check
 * must not fire on its own explanation.
 */
function isComment(line: string): boolean {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("{/*") ||
    t.startsWith("*/")
  );
}

const RULES: Rule[] = [
  {
    id: "no-untested-method",
    why: "Names an assay that appears on no certificate. The COA states one method: RP-HPLC with UV detection, reporting identity, quantity, purity and metals.",
    pattern:
      /\b(LC-?MS|mass spectrometr\w*|endotoxin|LAL testing|sterility screen\w*|sterility test\w*|bioburden|residual solvent\w*|amino[- ]acid sequencing|ICP-?MS|USP\s*(&lt;|<)\s*(71|85|467)\s*(&gt;|>))\b/i,
    // Two deliberate narrowings, both from false positives:
    //   "sterility" alone appears in storage prose, so it must be paired
    //   with screening or testing; and "amino-acid sequence" describes a
    //   molecule (AOD-9604 "mirrors the hormone's final amino-acid
    //   sequence") whereas "sequencing" is the assay we do not run.
  },
  {
    id: "no-bare-stat-literal",
    why: "A figure typed by hand. Derive it in src/lib/stats.ts and render it through <Stat>, which requires a source line.",
    // The lookbehind stops compound names reading as counts: "SLU-PP-332 COA"
    // is a product, not "332 COAs".
    pattern:
      /(?<![\w-])\d{1,4}\s*\+?\s*(compounds?|peptides?|COAs?|certificates?|citations?|studies|batches|metros|sites)\b/i,
    allow: ["src/lib/stats.ts", "src/lib/coa.ts", "scripts/check-claims.ts"],
    // src/data holds editorial prose and compound records, not UI claims.
    skipPrefixes: ["src/data/"],
    confirm: (line) => {
      if (/^\s*(import|export type)/.test(line)) return false;
      // "Select up to 3 compounds" is selection UI, not an inventory claim.
      if (/\b(select|choose|up to|compare)\b/i.test(line)) return false;
      // A four-digit year is a date, not a count — "2025 Peptide Research
      // Trends" is an article title, not a claim to stock 2,025 of them.
      //
      // Narrowed rather than allow-listed: the next article with a year in its
      // title would otherwise need exempting by hand, and an exemption list is
      // where a real claim eventually hides. Every match on the line has to
      // look like a year for it to pass, so "2025 trends across 38 compounds"
      // still fires on the 38.
      const nums = [
        ...line.matchAll(
          /(?<![\w-])(\d{1,4})\s*\+?\s*(?:compounds?|peptides?|COAs?|certificates?|citations?|studies|batches|metros|sites)\b/gi,
        ),
      ].map((m) => m[1]);
      if (nums.length > 0 && nums.every((n) => /^(19|20)\d{2}$/.test(n))) return false;
      return true;
    },
  },
  {
    id: "no-typed-purity",
    why: `A purity figure other than the specification (${PURITY_SPEC}). A measured value belongs on the certificate, not in the interface.`,
    pattern: /\b\d{2}(\.\d+)?\s*%\s*(pure|purity)|\bpurity\b[^.\n]{0,30}?\b\d{2}(\.\d+)?\s*%/i,
    allow: ["src/lib/coa.ts", "src/lib/stats.ts", "scripts/check-claims.ts"],
    // Stating the specification in prose is correct and expected. What must
    // never appear is a DIFFERENT number — the ">99%" this site carried for
    // months, or an averaged measurement like "99.4%". So: collect every
    // purity percentage on the line and fail only on one that is not the spec.
    confirm: (line) => {
      const figures = line.match(/\d{2}(\.\d+)?\s*%/g) ?? [];
      return figures.some((f) => f.replace(/\s+/g, "") !== PURITY_FIGURE);
    },
  },
  {
    id: "no-negative-framing",
    why: "Describes what someone else is, rather than what ReVia does. House rule: positive framing only.",
    // A verbatim public record is quoted, not written. Mike Stone says
    // "another gray market vendor" in his TB-500 testimony, describing his
    // own purchase; trimming a transcript so it obeys our house style would
    // falsify the record — precisely what the spliced version of that
    // testimony did, and what CORRECTIONS in that file calls out.
    // Framing only. Every claims rule still applies to that file.
    allow: ["src/data/federal-record.ts"],
    pattern:
      /\b(gr[ae]y market vendors?|fake or reused|counterfeit|never China|no cGMP|unregistered facilit\w*|corners are cut|most suppliers fail)\b/i,
    // "gray market" alone is allowed: Mike Stone uses it about ReVia itself
    // on the federal record, which is self-description, not disparagement.
  },
  {
    id: "no-sales-language",
    why: "This site does not sell. Purchase intent leaves for i2b (D2C) or ReVia Wholesale (B2B).",
    pattern: /\b(add to cart|proceed to checkout|your cart|apply .{0,12}coupon|discount code at checkout)\b/i,
    // Policy pages are legal documents; their wording is not ours to tune here.
    skipPrefixes: ["src/app/policies/"],
  },
];

/* ------------------------------------------------------------------ */

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e);
    if (SKIP_PATH_PARTS.some((p) => `${full}${sep}`.includes(p))) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(e)) out.push(full);
  }
  return out;
}

interface Violation {
  rule: Rule;
  file: string;
  line: number;
  text: string;
}

/**
 * Which lines sit inside a block comment. A single-line check was not
 * enough: the continuation lines of a `{/* ... *\/}` block do not start
 * with a comment marker, so the checker fired on its own explanations.
 */
function commentMask(lines: string[]): boolean[] {
  const mask: boolean[] = [];
  let inBlock = false;
  for (const line of lines) {
    const opens = line.includes("/*");
    const closes = line.includes("*/");
    mask.push(inBlock || isComment(line) || opens);
    if (opens && !closes) inBlock = true;
    if (closes) inBlock = false;
  }
  return mask;
}

/** Long minified data lines are unreadable — show the match, not the line. */
function excerpt(line: string, pattern: RegExp): string {
  if (line.length <= 150) return line.trim().slice(0, 150);
  const m = line.match(new RegExp(pattern.source, pattern.flags.replace("g", "")));
  if (!m || m.index === undefined) return `${line.slice(0, 120)}…`;
  const from = Math.max(0, m.index - 70);
  return `…${line.slice(from, m.index + m[0].length + 70)}…`;
}

function run(): Violation[] {
  const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
  const violations: Violation[] = [];

  for (const file of files) {
    const rel = relative(ROOT, file).split(sep).join("/");
    const lines = readFileSync(file, "utf8").split("\n");
    const isCommented = commentMask(lines);

    for (const rule of RULES) {
      if (rule.allow?.includes(rel)) continue;
      if (rule.skipPrefixes?.some((p) => rel.startsWith(p))) continue;
      lines.forEach((line, i) => {
        if (isCommented[i]) return;
        if (!rule.pattern.test(line)) return;
        if (rule.confirm && !rule.confirm(line, rel)) return;
        violations.push({
          rule,
          file: rel,
          line: i + 1,
          text: excerpt(line, rule.pattern),
        });
      });
    }
  }
  return violations;
}

/** Sanity: the module must actually be reading files. */
function assertNotVacuous(): void {
  const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));
  if (files.length < 50) {
    console.error(
      `check:claims is vacuous — it found only ${files.length} files to scan. ` +
        `Run it from the repo root.`
    );
    process.exit(2);
  }
}

assertNotVacuous();
const violations = run();

if (violations.length === 0) {
  console.log("check:claims — no unsupported claims found");
  process.exit(0);
}

const byRule = new Map<string, Violation[]>();
for (const v of violations) {
  const list = byRule.get(v.rule.id) ?? [];
  list.push(v);
  byRule.set(v.rule.id, list);
}

console.error(`\ncheck:claims FAILED — ${violations.length} violation(s)\n`);
for (const [id, list] of byRule) {
  console.error(`  ${id}`);
  console.error(`  ${list[0].rule.why}`);
  for (const v of list) console.error(`    ${v.file}:${v.line}  ${v.text}`);
  console.error("");
}
process.exit(1);

/* ------------------------------------------------------------------ */
/*  Mutation test (run by hand after any change to the rules above):    */
/*                                                                      */
/*   1. Put "99.4% purity" in a component      -> no-typed-purity fires  */
/*   2. Put "LC-MS Confirmed" in a component   -> no-untested-method     */
/*   3. Put "38 compounds" in a component      -> no-bare-stat-literal   */
/*   4. Put "Fake or reused" in a component    -> no-negative-framing    */
/*   5. Put "Add to Cart" in a component       -> no-sales-language      */
/*   6. Put "2025 Peptide Trends" in a title   -> SILENT (a year)        */
/*   7. Put "2025 trends, 38 compounds"        -> no-bare-stat-literal   */
/*      (a year on the line must not mask a real count beside it)        */
/*                                                                      */
/*  Known blind spot, accepted: a genuine count that happens to fall in  */
/*  1900-2099 — "1998 studies" — reads as a year and passes. Narrowing   */
/*  further would need to know which nouns can plausibly number in the   */
/*  thousands, which is a judgement a regex should not be making. The    */
/*  alternative was an allow-list of article titles, and an allow-list   */
/*  is where a real claim eventually hides.                              */
/*                                                                      */
/*  Revert each. If any mutation passes, the rule is not reading what    */
/*  you think it is.                                                     */
/* ------------------------------------------------------------------ */
