/* ------------------------------------------------------------------ */
/*  Our thoughts on the news                                           */
/*                                                                     */
/*  The regulatory writing system. Three rules shape it:               */
/*                                                                     */
/*  1. EVERY factual assertion carries a source. `sources` is required */
/*     and must not be empty; the renderer prints a numbered ledger    */
/*     and the JSON-LD emits the same list as `citation`. Outbound     */
/*     links to primary sources are what separate a reference site     */
/*     from a content farm, and they are why one earns links back.     */
/*                                                                     */
/*  2. REPORTING IS NOT LEGAL ADVICE. Regulatory status is described,  */
/*     never concluded. A committee vote is a recommendation, not an   */
/*     approval, and the two are never collapsed. `status` states the  */
/*     position plainly so a reader cannot mistake one for the other.  */
/*                                                                     */
/*  3. EVERY POST TAKES A POSITION, in `stance`. The argument this      */
/*     company makes is that a clearer legal and legislative framework */
/*     is how people get safe, well-made peptides — the same argument  */
/*     Mike Stone made on the federal record. A post that only reports */
/*     is half-written.                                                */
/*                                                                     */
/*  Posts are typed modules rather than HTML in a database so that     */
/*  citations are structured, every claim is reviewable in a diff, and */
/*  `npm run check:claims` reads the prose. Database HTML is scanned   */
/*  by nothing.                                                        */
/* ------------------------------------------------------------------ */

/** Where a source came from. Drives the badge and tells a reader its weight. */
export type SourceType =
  | "FDA"
  | "Federal Register"
  | "Regulations.gov"
  | "Statute"
  | "State Board"
  | "Court / DOJ"
  | "Journal"
  | "PubMed"
  | "ClinicalTrials.gov"
  | "Analysis"
  | "News";

export interface Source {
  /** Cited inline as [n]; 1-based, matching position in the array. */
  title: string;
  publisher: string;
  url: string;
  type: SourceType;
  /** Publication or access date, as published. */
  date?: string;
  /** Why this source is here, or what it does and does not establish. */
  note?: string;
}

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string; id?: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "callout"; title: string; text: string }
  /** A dated row in a regulatory timeline. */
  | { kind: "timeline"; entries: { date: string; title: string; text: string; pending?: boolean }[] }
  /** A plain data table; first row is the header. */
  | { kind: "table"; caption?: string; rows: string[][] };

export interface NewsPost {
  slug: string;
  title: string;
  /** One sentence. Used as the meta description and the index summary. */
  summary: string;
  published: string;
  updated?: string;
  category: NewsCategory;
  /**
   * Where things actually stand, in one line. Written so it cannot be
   * mistaken for a legal conclusion — e.g. "Recommended by the committee.
   * Not yet compoundable."
   */
  status?: string;
  body: Block[];
  /** Required, and checked non-empty at module load. */
  sources: Source[];
  /** Where ReVia stands, and why. Required — see rule 3 above. */
  stance: string;
  /** Slugs of related posts. */
  related?: string[];
}

export const NEWS_CATEGORIES = [
  "Federal",
  "State",
  "Compounding",
  "Manufacturing & Testing",
  "Enforcement",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/* ------------------------------------------------------------------ */

import { POSTS as RAW } from "@/content/news";

/**
 * A post asserting facts without sources is the thing this system exists
 * to prevent, so it fails at module load rather than shipping quietly.
 */
function validate(posts: NewsPost[]): NewsPost[] {
  const seen = new Set<string>();
  for (const p of posts) {
    if (!p.sources.length) {
      throw new Error(`news: "${p.slug}" has no sources. Every post must cite.`);
    }
    if (!p.stance.trim()) {
      throw new Error(`news: "${p.slug}" has no stance. Reporting alone is half a post.`);
    }
    if (seen.has(p.slug)) throw new Error(`news: duplicate slug "${p.slug}"`);
    seen.add(p.slug);
  }
  return posts;
}

export const POSTS: NewsPost[] = validate(RAW).sort((a, b) =>
  b.published.localeCompare(a.published)
);

export const POST_COUNT = POSTS.length;

export function getPost(slug: string): NewsPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postsByCategory(category?: string): NewsPost[] {
  if (!category) return POSTS;
  return POSTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

/** Categories that actually have posts, with counts. Derived, never typed. */
export function activeCategories(): { name: NewsCategory; count: number }[] {
  return NEWS_CATEGORIES.map((name) => ({
    name,
    count: POSTS.filter((p) => p.category === name).length,
  })).filter((c) => c.count > 0);
}

/** Every distinct outbound source across the archive. */
export function allSources(): Source[] {
  const byUrl = new Map<string, Source>();
  for (const p of POSTS) for (const s of p.sources) if (!byUrl.has(s.url)) byUrl.set(s.url, s);
  return [...byUrl.values()];
}
