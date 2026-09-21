import type { Block } from "@/lib/news";

/**
 * The article archive, as typed modules rather than database rows.
 *
 * ## Why these moved out of the database
 *
 * They were `BlogPost` rows rendered as stored HTML. `src/lib/news.ts` explains
 * the problem with that arrangement better than this comment can — database HTML
 * is scanned by nothing. `scripts/check-claims.ts` walks `src/`, so a purity
 * figure or a sale phrase typed into the admin editor was invisible to the one
 * gate that exists to catch it, and ten articles were the largest body of public
 * prose on the site that nobody could check.
 *
 * Moving them here puts them under the checker and removes the last reason a
 * public page on this site needs a database.
 *
 * ## Deliberately not `NewsPost`
 *
 * `/news` is regulatory reporting: every assertion carries a numbered source,
 * and `validate()` throws at module load if one does not. That discipline is
 * right for a post about an FDA committee vote and wrong for a general article
 * about what peptide research is — an essay with no external claim to cite would
 * fail a rule written for reporting, and the honest fix is a different type, not
 * a fake citation.
 *
 * So articles share the `Block` union and nothing else. What they do inherit is
 * the harder half of the rule: an article may not state a figure the site cannot
 * produce a document for. That is enforced by `check-claims` over this directory
 * like anywhere else in `src/`.
 */

export type ArticleCategory =
  | "Research"
  | "Compounds"
  | "Sourcing"
  | "Standards";

export interface Article {
  slug: string;
  title: string;
  /** One sentence. The meta description and the index summary. */
  summary: string;
  /** ISO date. */
  published: string;
  category: ArticleCategory;
  body: Block[];
  /** Compound slugs this article discusses, for the cross-link to /research. */
  compounds?: string[];
}

/** Thrown at module load rather than rendered, so a bad article cannot ship. */
export function validateArticles(articles: Article[]): void {
  const seen = new Set<string>();
  for (const a of articles) {
    if (seen.has(a.slug)) throw new Error(`articles: duplicate slug "${a.slug}"`);
    seen.add(a.slug);
    if (!a.title.trim()) throw new Error(`articles: "${a.slug}" has no title`);
    if (!a.summary.trim()) throw new Error(`articles: "${a.slug}" has no summary`);
    if (a.body.length === 0) throw new Error(`articles: "${a.slug}" has an empty body`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.published)) {
      throw new Error(`articles: "${a.slug}" published date is not ISO — "${a.published}"`);
    }
  }
}

/**
 * Reading time in minutes, derived from the blocks at 200 words per minute.
 *
 * Here rather than in each page: three of them had their own copy, all three
 * written for stored HTML (`strip tags, count words`), and none of them would
 * have counted a list item.
 */
export function readTime(body: Block[]): number {
  const words = body.reduce((n, b) => {
    const text =
      "text" in b && typeof b.text === "string"
        ? b.text
        : "items" in b && Array.isArray(b.items)
          ? b.items.join(" ")
          : "";
    return n + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}
