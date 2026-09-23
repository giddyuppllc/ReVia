import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/content/articles";
import { readTime } from "@/lib/articles";
import { PostBody } from "@/components/news/PostBody";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
export const dynamic = "force-static";

/** Every article is known at build time now, so the set is explicit. */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getArticle(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.published,
                },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getArticle(slug);
  if (!post) notFound();

  const related = ARTICLES.filter(
    (a) => a.category === post.category && a.slug !== post.slug,
  ).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    author: { "@type": "Organization", name: "ReVia Life" },
    publisher: {
      "@type": "Organization",
      name: "ReVia Research Supply",
      url: "https://revialife.com",
    },
    datePublished: post.published,
    dateModified: post.published,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://revialife.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://revialife.com/" },
          { name: "Learn", url: "https://revialife.com/learn" },
          { name: post.title, url: `https://revialife.com/blog/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-400">
          <Link href="/" className="hover:text-neutral-700">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/learn" className="hover:text-neutral-700">
            Learn
          </Link>{" "}
          / <span className="text-neutral-700">{post.title}</span>
        </nav>


        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600">
            {post.category}
          </span>
          <time dateTime={post.published}>
            {new Date(post.published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
          <span>·</span>
          <span>{readTime(post.body)} min read</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {post.title}
        </h1>

        {/* Content */}
        {/* Typed blocks, rendered by the same component /news uses. The page
            used to inject stored HTML with dangerouslySetInnerHTML — which is
            how the article text stayed outside every check this repo runs. */}
        <div className="prose-revia mt-10">
          <PostBody body={post.body} slug={post.slug} />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-neutral-200 px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900">Related Articles</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1"
              >
                <span className="text-xs text-sky-600">{r.category}</span>
                <h3 className="mt-2 font-semibold text-neutral-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                  {r.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prose styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .prose-revia h2 { font-size: 1.5rem; font-weight: 700; color: #171717; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose-revia p { color: #525252; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-revia ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-revia li { color: #525252; line-height: 1.8; margin-bottom: 0.5rem; }
        .prose-revia li strong { color: #171717; }
        .prose-revia blockquote { border-left: 3px solid #059669; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #404040; }
        .prose-revia em { color: #737373; }
        .prose-revia a { color: #059669; text-decoration: underline; }
      `,
        }}
      />
    </>
  );
}
