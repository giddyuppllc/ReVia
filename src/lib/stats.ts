import { cache } from "react";
import { ARTICLE_COUNT, articleCategories } from "@/content/articles";
import { getI2bCatalogue } from "@/lib/i2b-catalogue";
import { researchCompounds, CATEGORIES } from "@/data/research-compounds";
import { CITIES } from "@/data/cities";
import { REVIA_NETWORK } from "@/lib/partner";
import { COA_RESULT_COUNT } from "@/lib/coa";

/* ------------------------------------------------------------------ */
/*  Derived site statistics                                            */
/*                                                                     */
/*  "We are about data authority — derive numbers, never type them."   */
/*                                                                     */
/*  Every public figure on this site comes from here, and every one    */
/*  is computed from a real source. Nothing in this file is a literal  */
/*  written by hand.                                                   */
/*                                                                     */
/*  It exists because the home page carried four typed figures —       */
/*  "99.4% Avg Purity", "12 QC Tests Per Batch", "42 COAs Published",  */
/*  "0 Failed Batches" — of which three were false. The COA count was  */
/*  39, the certificate reports four results rather than twelve, and   */
/*  the batch table has never had a row in it, so neither the average  */
/*  purity nor the failure rate was derivable at all.                  */
/*                                                                     */
/*  Two rules follow from that:                                        */
/*                                                                     */
/*   1. A figure that cannot be derived is NOT SHOWN. It is never      */
/*      estimated, rounded up, or carried over from a previous draft.  */
/*                                                                     */
/*   2. `null` means "we do not know"; it is never coerced to 0.       */
/*      Zero is a claim ("0 certificates published") and claiming it   */
/*      when the query failed is the same class of error as typing it. */
/*                                                                     */
/*  Caching: this project does not enable `cacheComponents`, so the    */
/*  `use cache` directive is unavailable and the home page is          */
/*  force-dynamic. `unstable_cache` is the documented path here — see  */
/*  node_modules/next/dist/docs/01-app/02-guides/                      */
/*  caching-without-cache-components.md                                */
/* ------------------------------------------------------------------ */

/* ----------------------------- Types ------------------------------ */

export interface StaticStats {
  documentedCompounds: number;
  compoundCategories: number;
  citations: number;
  compoundsWithFormula: number;
  networkSites: number;
  liveNetworkSites: number;
  cities: number;
  metroReach: number;
  coaResults: number;
}

/**
 * What the supplying catalogue reports.
 *
 * ## Why this is no longer a database read
 *
 * These were counts over ReViaLife's own `Product` table — which described a
 * shop that no longer exists. Counting your own inactive rows and calling the
 * result "compounds supplied" was already the weaker claim; it is now simply
 * untrue, because ReViaLife supplies nothing.
 *
 * They are read from i2b's live catalogue instead. That is a stronger figure,
 * not a weaker one: it is what the supplying company is publishing right now,
 * and it moves when they activate a product rather than when we deploy.
 *
 * `articles` moved to the typed article modules, which cannot fail, so it is no
 * longer nullable business — it is counted in `getStaticStats`.
 *
 * Every field is still nullable: an unreachable catalogue must not become a
 * false zero. See `src/lib/i2b-catalogue.ts` — null is not [].
 */
export interface DbStats {
  coasOnFile: number | null;
  compoundsSupplied: number | null;
  supplyCategories: number | null;
  presentations: number | null;
  articles: number | null;
  articleCategories: number | null;
}

/**
 * Kept apart from the rest deliberately. `BatchRecord` is empty, so all of
 * this is null today — and it must stay null rather than resolving to 0,
 * which would read as "we have tested zero batches".
 *
 * Note there is no `avgPurity` here and there should not be. Publishing a
 * measured average invites a cherry-picking argument; the specification
 * (COA_SPEC.puritySpec) is the honest public figure, and the measured
 * number belongs on the individual certificate.
 */
export interface BatchStats {
  batchesTested: number | null;
  latestTestDate: Date | null;
}

/**
 * Always null, and kept rather than deleted.
 *
 * The `BatchRecord` table never had a row in it, so this reported nothing
 * before and reports nothing now. The type stays because the distinction it
 * encodes is the one that matters: when batch records do exist, they must
 * arrive as a count that can be null, not as a zero that reads as "we have
 * tested no batches".
 */
const NO_BATCH_STATS: BatchStats = { batchesTested: null, latestTestDate: null };

export interface SiteStats {
  static: StaticStats;
  db: DbStats;
  batch: BatchStats;
}

/** The only shape a component is allowed to render. */
export interface PublicStat {
  id: StatId;
  value: string;
  label: string;
  /** Where this number came from. Required — see Stat.tsx. */
  sourceNote: string;
}

export type StatId =
  | "documentedCompounds"
  | "citations"
  | "compoundCategories"
  | "coaResults"
  | "networkSites"
  | "cities"
  | "metroReach"
  | "compoundsSupplied"
  | "presentations"
  | "articles"
  | "coasOnFile"
  | "batchesTested";

/* --------------------------- Static ------------------------------- */

/** Pure, synchronous, cannot fail. The site always has something honest. */
export function getStaticStats(): StaticStats {
  return {
    documentedCompounds: researchCompounds.length,
    compoundCategories: CATEGORIES.length,
    citations: researchCompounds.reduce((n, c) => n + c.keyStudies.length, 0),
    compoundsWithFormula: researchCompounds.filter(
      (c) => c.chemicalProperties?.molecularFormula
    ).length,
    networkSites: REVIA_NETWORK.length,
    liveNetworkSites: REVIA_NETWORK.filter((s) => s.url).length,
    cities: CITIES.length,
    metroReach: CITIES.reduce((n, c) => n + c.metroPopulation, 0),
    coaResults: COA_RESULT_COUNT,
  };
}

/* ------------------------------ DB -------------------------------- */

async function queryDbStats(): Promise<DbStats> {
  const items = await getI2bCatalogue();

  // Unreachable is not empty. Every count stays null rather than collapsing to
  // zero, and <Stat> renders nothing for a null.
  if (!items) {
    return {
      coasOnFile: null,
      compoundsSupplied: null,
      supplyCategories: null,
      presentations: null,
      articles: null,
      articleCategories: null,
    };
  }

  const categories = new Set(items.map((i) => i.category).filter(Boolean));

  return {
    coasOnFile: items.filter((i) => i.coaUrl).length,
    compoundsSupplied: items.length,
    supplyCategories: categories.size,
    // A "presentation" is one purchasable size of one compound. Summing the
    // size lists counts the same thing the variant table used to.
    presentations: items.reduce((n, i) => n + (i.sizes?.length ?? 0), 0),
    articles: ARTICLE_COUNT,
    articleCategories: articleCategories().length,
  };
}

/*
 * No `unstable_cache` wrapper any more.
 *
 * It wrapped a Prisma query, which has no caching of its own. The source is now
 * a `fetch` that already declares `revalidate: 900` and a cache tag, and
 * wrapping a cached fetch in a second cache layer means the outer window (an
 * hour) silently wins over the inner one — so a product activated on i2b would
 * appear in the availability control within fifteen minutes and in these counts
 * forty-five minutes later. One cache, one answer.
 */

/* --------------------------- Composed ----------------------------- */

/** Per-request dedupe, so three components on a page hit Neon once. */
export const getSiteStats = cache(async (): Promise<SiteStats> => {
  const db = await queryDbStats();
  return { static: getStaticStats(), db, batch: NO_BATCH_STATS };
});

/* --------------------------- Formatting --------------------------- */

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

type Definition = {
  label: string;
  sourceNote: string;
  read: (s: SiteStats) => number | null;
  format?: (n: number) => string;
};

const DEFINITIONS: Record<StatId, Definition> = {
  documentedCompounds: {
    label: "Compounds Documented",
    sourceNote: "Counted from the published compound library",
    read: (s) => s.static.documentedCompounds,
  },
  citations: {
    label: "Peer-Reviewed Citations",
    sourceNote: "Counted across every compound monograph",
    read: (s) => s.static.citations,
  },
  compoundCategories: {
    label: "Research Categories",
    sourceNote: "Counted from the compound library",
    read: (s) => s.static.compoundCategories,
  },
  coaResults: {
    label: "Results Reported Per COA",
    sourceNote: "Identity, quantity, purity and metals, as printed on the certificate",
    read: (s) => s.static.coaResults,
  },
  networkSites: {
    label: "Sites in the Network",
    sourceNote: "Counted from the ReVia network directory",
    read: (s) => s.static.networkSites,
  },
  cities: {
    label: "Metros Covered",
    sourceNote: "Counted from the published location index",
    read: (s) => s.static.cities,
  },
  metroReach: {
    label: "Metro Population",
    sourceNote: "Summed across the published location index",
    read: (s) => s.static.metroReach,
    format: formatCompact,
  },
  compoundsSupplied: {
    label: "Compounds Supplied",
    sourceNote: "Counted from the live catalogue",
    read: (s) => s.db.compoundsSupplied,
  },
  presentations: {
    label: "Presentations",
    sourceNote: "Counted from the live catalogue",
    read: (s) => s.db.presentations,
  },
  articles: {
    label: "Articles Published",
    sourceNote: "Counted from published articles",
    read: (s) => s.db.articles,
  },
  coasOnFile: {
    label: "Certificates on File",
    sourceNote: "Counted from certificates held against active catalogue items",
    read: (s) => s.db.coasOnFile,
  },
  batchesTested: {
    label: "Batches Tested",
    sourceNote: "Counted from batch records",
    read: (s) => s.batch.batchesTested,
  },
};

/**
 * Resolve stats for display. Anything that could not be derived is DROPPED,
 * so a caller asking for four may legitimately render three — or none.
 */
export async function getPublicStats(ids: StatId[]): Promise<PublicStat[]> {
  const stats = await getSiteStats();

  return ids.flatMap((id) => {
    const def = DEFINITIONS[id];
    const n = def.read(stats);
    if (n === null || n === undefined) return [];
    return [
      {
        id,
        value: def.format ? def.format(n) : String(n),
        label: def.label,
        sourceNote: def.sourceNote,
      },
    ];
  });
}
