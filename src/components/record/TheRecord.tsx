import Link from "next/link";

import { ARTICLES } from "@/content/articles";
import { POSTS } from "@/content/news";
import { researchCompounds } from "@/data/research-compounds";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * What ReVia publishes, as a contents page.
 *
 * Three columns, in the order of how hard each is to produce: the regulatory
 * reporting (sourced, and each post takes a position), the compound library,
 * and the articles. Counts are derived from the archives themselves — this site
 * has a build-time rule against a figure typed by hand, and a contents page is
 * exactly where one would otherwise get typed.
 */
export default function TheRecord() {
  const latest = POSTS[0];
  const columns = [
    {
      label: "Regulatory reporting",
      href: "/news",
      heading: "News",
      count: POSTS.length,
      unit: POSTS.length === 1 ? "dispatch" : "dispatches",
      blurb:
        "Every assertion carries a numbered source, and every piece states where ReVia stands. No post ships without both.",
      items: POSTS.slice(0, 3).map((p) => ({ href: `/news/${p.slug}`, title: p.title })),
    },
    {
      label: "Compound library",
      href: "/research",
      heading: "Research",
      count: researchCompounds.length,
      unit: "compounds",
      blurb:
        "Mechanism, research context and published studies, compound by compound. No dosing, no protocols, no outcome claims.",
      items: researchCompounds.slice(0, 3).map((c) => ({
        href: `/research/${c.slug}`,
        title: c.name,
      })),
    },
    {
      label: "Long form",
      href: "/blog",
      heading: "Articles",
      count: ARTICLES.length,
      unit: "articles",
      blurb:
        "Plain-English explanation of what the category is, how to read a certificate, and what the evidence does and does not show.",
      items: ARTICLES.slice(0, 3).map((a) => ({ href: `/blog/${a.slug}`, title: a.title })),
    },
  ];

  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <DrawRule />

        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-6 pt-14 sm:pt-20">
            <div>
              <Label>What we publish</Label>
              <Heading className="mt-4 text-[1.625rem] sm:text-[1.9375rem]">The record</Heading>
            </div>
            {latest && (
              <Link
                href={`/news/${latest.slug}`}
                className="group max-w-[38ch] text-right"
              >
                <Label className="!text-[#3D3229]/35">Latest</Label>
                <span className="mt-1.5 block font-display text-[1.0625rem] font-light leading-snug text-[#3D3229] transition group-hover:text-[#A38569]">
                  {latest.title}
                </span>
              </Link>
            )}
          </div>
        </Rise>

        {/* Dividers are borders on the columns, not a coloured grid gap. The
            gap trick paints the container, and where a column is shorter than
            its neighbour the paint shows through as a grey band above and below
            the row. */}
        {/* min-w-0: a grid item is min-width:auto by default, so the `truncate`
            on the titles below sized the track to the UNtruncated string
            rather than clipping it — +82px of sideways scroll on the
            homepage at 390px, and the only overflowing route on the site. */}
        <div className="grid min-w-0 pb-14 pt-10 sm:pb-20 lg:grid-cols-3">
          {columns.map((col, i) => (
            <Rise key={col.heading} delay={0.08 * i} className="border-t border-[#3D3229]/12 lg:border-t-0 lg:border-l lg:border-[#3D3229]/12 lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
              <Link href={col.href} className="group block py-6 lg:py-0">
                <div className="flex items-baseline gap-3">
                  <Heading as="h3" className="text-[1.3125rem]">
                    {col.heading}
                  </Heading>
                  <span className="font-mono text-[0.6875rem] tabular-nums text-[#A38569]">
                    {col.count} {col.unit}
                  </span>
                </div>
                <p className="mt-3 max-w-[38ch] font-sans text-[0.8438rem] leading-[1.7] text-[#3D3229]/58">
                  {col.blurb}
                </p>
                <ul className="mt-5 space-y-0">
                  {col.items.map((it, j) => (
                    <li key={it.href}>
                      {j > 0 && <div className="h-px w-full bg-[#3D3229]/10" />}
                      <span className="block truncate py-2 font-sans text-[0.8125rem] text-[#3D3229]/62 transition group-hover:text-[#3D3229]">
                        {it.title}
                      </span>
                    </li>
                  ))}
                </ul>
                <span className="mt-4 inline-flex items-baseline gap-2 font-sans text-[0.7812rem] font-medium text-[#3D3229]">
                  <span className="border-b border-[#A38569]/45 pb-0.5">All {col.heading.toLowerCase()}</span>
                  <span className="text-[#A38569] transition group-hover:translate-x-0.5">&rarr;</span>
                </span>
              </Link>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
