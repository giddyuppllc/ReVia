import { STATEMENTS, type Statement } from "@/data/federal-record";
import { researchCompounds } from "@/data/research-compounds";

/**
 * The join between what Mike Stone testified about and what the library
 * documents.
 *
 * These are the same five compounds seen from two sides — the public record and
 * the research — and until now the two halves of the site did not know about
 * each other. A reader on the BPC-157 monograph had no way to learn that the
 * founder of this company stood in front of a federal advisory committee and
 * talked about that exact compound, with a timecode. That is the strongest
 * internal link available here and it was not wired.
 *
 * ## Why a table and not a slug match
 *
 * Four of the five match on slug. The fifth does not: the record says
 * `emideltide-dsip`, because that is how the committee listed the substance
 * under review, and the library says `dsip`. Matching on slug alone would
 * silently drop it, and a silent drop is worse here than a missing link — the
 * page would simply look as though Mike never mentioned it.
 *
 * So the mapping is explicit and `assertRecordLinks` fails the build if any
 * statement resolves to nothing. A new statement added to the record without a
 * monograph is a thing somebody should be told about, not a link that quietly
 * does not appear.
 */

/** Statement slug → research slug, only where the two genuinely differ. */
const SLUG_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  // The committee listed the substance under review as Emideltide; the library
  // files it under the name the literature uses.
  "emideltide-dsip": "dsip",
});

export interface RecordLink {
  statement: Statement;
  researchSlug: string;
}

function researchSlugFor(statement: Statement): string {
  return SLUG_ALIASES[statement.slug] ?? statement.slug;
}

/** Every statement, with the monograph it belongs to. */
export const RECORD_LINKS: RecordLink[] = STATEMENTS.map((statement) => ({
  statement,
  researchSlug: researchSlugFor(statement),
}));

/** The statement for a compound, if he spoke on it. */
export function statementForCompound(researchSlug: string): Statement | null {
  return RECORD_LINKS.find((l) => l.researchSlug === researchSlug)?.statement ?? null;
}

/** Throws at module load if a statement points at a monograph that is not there. */
function assertRecordLinks(): void {
  const known = new Set(researchCompounds.map((c) => c.slug));
  const orphans = RECORD_LINKS.filter((l) => !known.has(l.researchSlug));
  if (orphans.length > 0) {
    throw new Error(
      "Statements with no monograph: " +
        orphans.map((o) => `${o.statement.compound} (looked for "${o.researchSlug}")`).join(", ") +
        ". Add the compound to research-compounds.ts, or add an entry to " +
        "SLUG_ALIASES in src/lib/record-links.ts if it is filed under another name.",
    );
  }
}
assertRecordLinks();
