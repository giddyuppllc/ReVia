import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { PostBody, SourceLedger } from "@/components/news/PostBody";
import { POSTS, getPost } from "@/lib/news";

const ORIGIN = "https://revialife.com";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ReVia`,
    description: post.summary,
    alternates: { canonical: `${ORIGIN}/news/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${ORIGIN}/news/${post.slug}`,
      type: "article",
      publishedTime: post.published,
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Every source becomes a citation node. The data is already structured,
  // so the machine-readable version costs nothing and says the same thing
  // the page says.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.published,
    ...(post.updated ? { dateModified: post.updated } : {}),
    articleSection: post.category,
    publisher: { "@type": "Organization", name: "ReVia" },
    mainEntityOfPage: `${ORIGIN}/news/${post.slug}`,
    citation: post.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.title,
      url: s.url,
      publisher: { "@type": "Organization", name: s.publisher },
    })),
  };

  const related = (post.related ?? [])
    .map((s) => getPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd data={articleLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${ORIGIN}/` },
          { name: "News", url: `${ORIGIN}/news` },
          { name: post.title, url: `${ORIGIN}/news/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-stone-500 transition hover:text-sky-700"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Our thoughts on the news
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-100 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-sky-700">
              {post.category}
            </span>
            <time
              dateTime={post.published}
              className="font-mono text-[0.6875rem] text-stone-500"
            >
              {new Date(post.published).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              timeZone: "UTC",
              })}
            </time>
          </div>

          <h1 className="mt-5 max-w-[22ch] text-4xl font-light leading-[1.08] tracking-tight text-stone-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg font-light leading-relaxed text-stone-600">
            {post.summary}
          </p>

          {post.status && (
            <p className="mt-8 rounded-xl border border-sky-200/70 bg-sky-50/60 px-5 py-4 font-mono text-[0.75rem] leading-relaxed text-stone-700">
              <span className="uppercase tracking-[0.16em] text-sky-700">Where it stands</span>
              <span className="mt-1.5 block text-stone-700">{post.status}</span>
            </p>
          )}
        </header>

        <div className="mt-12">
          <PostBody body={post.body} slug={post.slug} />
        </div>

        {/* The position. Every post takes one. */}
        <section
          aria-labelledby="stance-heading"
          className="mt-14 rounded-3xl bg-stone-900 p-8 sm:p-10"
        >
          <h2
            id="stance-heading"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-sky-500"
          >
            Where ReVia stands
          </h2>
          <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-stone-200">
            {post.stance}
          </p>
        </section>

        {/* The evidence. */}
        <section aria-labelledby="sources-heading" className="mt-14">
          <h2
            id="sources-heading"
            className="text-2xl font-light tracking-tight text-stone-800"
          >
            Sources
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-stone-600">
            Every factual claim above is numbered to one of these. Where a primary
            document exists, it is linked in preference to anyone&rsquo;s summary of it.
          </p>
          <SourceLedger sources={post.sources} slug={post.slug} />
        </section>

        {related.length > 0 && (
          <section className="mt-14 border-t border-sky-200/60 pt-8">
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-sky-700">
              Related
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/news/${r.slug}`}
                    className="text-stone-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-700"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-14 max-w-[68ch] border-t border-sky-200/60 pt-6 font-mono text-[0.6875rem] leading-relaxed text-stone-500">
          This is reporting and commentary, and it isn&rsquo;t legal advice. Regulatory
          status is described as we understand it on the date shown. Compounds mentioned
          are for research use only and are not for human or animal consumption.
        </p>
      </article>
    </>
  );
}
