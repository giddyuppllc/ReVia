import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
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

/** Every field is nullable: a failed query must not become a false zero. */
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

const nul = () => null;

async function queryDbStats(): Promise<DbStats> {
  // Each count fails independently — one dead query must not blank the row.
  const [
    coasOnFile,
    compoundsSupplied,
    supplyCategories,
    presentations,
    articles,
    articleCategories,
  ] = await Promise.all([
    prisma.product.count({ where: { active: true, coaUrl: { not: null } } }).catch(nul),
    prisma.product.count({ where: { active: true } }).catch(nul),
    prisma.category.count().catch(nul),
    prisma.productVariant.count().catch(nul),
    prisma.blogPost.count({ where: { published: true } }).catch(nul),
    prisma.blogPost
      .findMany({ where: { published: true }, distinct: ["category"], select: { category: true } })
      .then((r) => r.length)
      .catch(nul),
  ]);

  return {
    coasOnFile,
    compoundsSupplied,
    supplyCategories,
    presentations,
    articles,
    articleCategories,
  };
}

const getCachedDbStats = unstable_cache(queryDbStats, ["site-stats-db"], {
  revalidate: 3600,
  tags: ["site-stats"],
});

async function queryBatchStats(): Promise<BatchStats> {
  const [batchesTested, latest] = await Promise.all([
    prisma.batchRecord.count().catch(nul),
    prisma.batchRecord.aggregate({ _max: { testDate: true } }).catch(() => null),
  ]);

  return {
    // 0 rows means we have nothing to report, not "zero batches tested".
    batchesTested: batchesTested && batchesTested > 0 ? batchesTested : null,
    latestTestDate: latest?._max.testDate ?? null,
  };
}

const getCachedBatchStats = unstable_cache(queryBatchStats, ["site-stats-batch"], {
  revalidate: 3600,
  tags: ["site-stats"],
});

/* --------------------------- Composed ----------------------------- */

/** Per-request dedupe, so three components on a page hit Neon once. */
export const getSiteStats = cache(async (): Promise<SiteStats> => {
  const [db, batch] = await Promise.all([getCachedDbStats(), getCachedBatchStats()]);
  return { static: getStaticStats(), db, batch };
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
