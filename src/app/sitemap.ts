import { MetadataRoute } from "next";
import { researchCompounds, SHOWCASE_SLUGS } from "@/data/research-compounds";
import { CITIES } from "@/data/cities";
import { POSTS } from "@/lib/news";
import { ARTICLES } from "@/content/articles";

/**
 * The sitemap, derived from what the repository actually contains.
 *
 * ## Why this was rewritten
 *
 * It read the product table, and every URL it produced from it — `/shop`,
 * `/shop/:slug`, `/compare`, the shipping, refunds and payments policies, the
 * per-stack pages — now 404s. A sitemap is a set of assertions to a crawler
 * that these pages exist, so a stale one does not merely omit things: it sends
 * search engines to pages that are gone and spends the crawl budget of the
 * pages that are not.
 *
 * ## Why it is now static
 *
 * Every surface on this site is a typed module — compounds, cities, news,
 * articles. Deriving from those makes the sitemap wrong only if a route is
 * deleted without its data, which the build catches. It also means the sitemap
 * no longer needs a database, which is the condition for the site not having
 * one.
 *
 * `/washington` and `/news` were missing from the old file entirely — the two
 * pages the whole remodel is built around.
 */

const SITE = "https://revialife.com";

/** One date for the whole file: a per-URL `new Date()` claims everything changed today. */
const BUILT = new Date();

type Entry = MetadataRoute.Sitemap[number];
const url = (
  path: string,
  priority: number,
  changeFrequency: Entry["changeFrequency"],
  lastModified: Date = BUILT,
): Entry => ({ url: `${SITE}${path}`, lastModified, changeFrequency, priority });

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    url("", 1, "weekly"),

    // The record. These carry the primary sources and are the reason to link here.
    url("/washington", 0.9, "weekly"),
    url("/news", 0.8, "weekly"),
    ...POSTS.map((p) => url(`/news/${p.slug}`, 0.7, "monthly", new Date(p.updated ?? p.published))),

    // The monographs.
    url("/research", 0.8, "weekly"),
    ...researchCompounds.map((c) => url(`/research/${c.slug}`, 0.7, "monthly")),

    // Editorial.
    url("/blog", 0.6, "weekly"),
    ...ARTICLES.map((a) => url(`/blog/${a.slug}`, 0.6, "monthly", new Date(a.published))),
    url("/learn", 0.6, "monthly"),
    url("/glossary", 0.6, "monthly"),

    // Brand.
    url("/about", 0.6, "monthly"),
    url("/why-us", 0.6, "monthly"),
    url("/stacks", 0.5, "monthly"),
    url("/faq", 0.5, "monthly"),
    url("/contact", 0.5, "monthly"),

    // Geo. The city hubs are listed in full; of the product pages only the
    // showcase combinations, which is exactly the set `generateStaticParams`
    // prerenders. The long tail renders on demand and is reachable from its
    // city hub — listing 25 × 80 URLs would spend the crawl budget of the
    // pages above on pages nobody searches for.
    url("/locations", 0.7, "weekly"),
    ...CITIES.map((c) => url(`/locations/${c.slug}`, 0.6, "weekly")),
    ...CITIES.flatMap((c) =>
      SHOWCASE_SLUGS.map((slug) => url(`/locations/${c.slug}/${slug}`, 0.55, "weekly")),
    ),

    // Policies. Shipping, refunds and payments are deliberately absent: they
    // described a merchant relationship this site no longer has, and were
    // deleted rather than redirected to another company's terms.
    ...["terms", "privacy", "disclaimer", "aup", "cookies", "ccpa"].map((slug) =>
      url(`/policies/${slug}`, 0.3, "yearly"),
    ),
    url("/policies", 0.3, "yearly"),
  ];
}
