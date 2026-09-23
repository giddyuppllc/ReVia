import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ItemListSchema from "@/components/seo/ItemListSchema";
import { POSTS, POST_COUNT, activeCategories, allSources, postsByCategory } from "@/lib/news";

const ORIGIN = "https://revialife.com";

export const metadata: Metadata = {
  title: "Our Thoughts on the News | ReVia",
  description:
    "What is changing in peptide regulation, what it means in practice, and where ReVia stands. Reporting and commentary, every claim sourced.",
  alternates: { canonical: `${ORIGIN}/news` },
};

export default async function NewsIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = postsByCategory(category);
  const categories = activeCategories();
  const sourceCount = allSources().length;

  return (
    <>
      <ItemListSchema
        name="ReVia — regulatory reporting and commentary"
        items={POSTS.map((p) => ({ name: p.title, url: `${ORIGIN}/news/${p.slug}` }))}
      />

      {/* ── Masthead ── */}
      <section className="border-b border-sky-200/60 bg-sky-50/50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-sky-700">
            Reporting &amp; Commentary
          </p>
          <h1 className="mt-4 max-w-[16ch] text-4xl font-light leading-[1.05] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Our thoughts on the news
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg font-light leading-relaxed text-stone-600">
            Peptide regulation is moving, and most of what gets written about it blurs
            distinctions that matter. We report what changed, say plainly what didn&rsquo;t, and
            link the primary document every time.
          </p>

          {/* Derived, both of them */}
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-sky-200/70 pt-8">
            {[
              { n: POST_COUNT, label: "Articles", note: "Counted from the archive" },
              { n: sourceCount, label: "Sources Cited", note: "Counted across every article" },
            ].map((s) => (
              <div key={s.label}>
                <dd className="font-mono text-3xl font-semibold tabular-nums text-stone-800">
                  {s.n}
                </dd>
                <dt className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-stone-500">
                  {s.label}
                </dt>
                <p className="mt-1 font-mono text-[0.6875rem] text-stone-400">{s.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Filter ── */}
      {categories.length > 1 && (
        <section className="px-6 pt-10">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-2">
            <Link
              href="/news"
              className={`rounded-full px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-wider transition ${
                !category
                  ? "bg-stone-800 text-stone-50"
                  : "bg-white text-stone-600 hover:bg-sky-50"
              }`}
            >
              All ({POST_COUNT})
            </Link>
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/news?category=${encodeURIComponent(c.name)}`}
                className={`rounded-full px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-wider transition ${
                  category?.toLowerCase() === c.name.toLowerCase()
                    ? "bg-stone-800 text-stone-50"
                    : "bg-white text-stone-600 hover:bg-sky-50"
                }`}
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── The archive ── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {posts.length === 0 ? (
            <p className="text-stone-500">Nothing filed under that heading yet.</p>
          ) : (
            <ol className="space-y-px">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/news/${p.slug}`}
                    className="group block border-t border-sky-200/60 py-8 transition hover:bg-sky-50/50"
                  >
                    <div className="lg:grid lg:grid-cols-[11rem_1fr] lg:gap-10">
                      <div className="font-mono text-[0.6875rem] text-stone-500">
                        <time dateTime={p.published}>
                          {new Date(p.published).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
              timeZone: "UTC",
                          })}
                        </time>
                        <p className="mt-1 uppercase tracking-[0.14em] text-sky-700">
                          {p.category}
                        </p>
                        <p className="mt-3 text-stone-400">
                          {p.sources.length} source{p.sources.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="mt-3 lg:mt-0">
                        <h2 className="max-w-[28ch] text-2xl font-light leading-snug tracking-tight text-stone-900 transition group-hover:text-sky-800">
                          {p.title}
                        </h2>
                        <p className="mt-3 max-w-[64ch] leading-relaxed text-stone-600">
                          {p.summary}
                        </p>
                        {p.status && (
                          <p className="mt-4 inline-block rounded-lg bg-white px-3 py-1.5 font-mono text-[0.6875rem] text-stone-600 ring-1 ring-sky-200/70">
                            {p.status}
                          </p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-wider text-sky-700">
                          Read
                          <ArrowRight
                            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ── Standing note ── */}
      <section className="border-t border-sky-200/60 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="max-w-[68ch] font-mono text-[0.6875rem] leading-relaxed text-stone-500">
            We go to the primary document instead of someone&rsquo;s summary of it. We never
            call a committee recommendation an approval. We keep compounding, outsourcing,
            approved drugs, and research use as the four separate lanes they are. When we
            can&rsquo;t verify something, we say so instead of rounding it up into a claim.
            This is reporting and commentary, and it isn&rsquo;t legal advice.
          </p>
        </div>
      </section>
    </>
  );
}
