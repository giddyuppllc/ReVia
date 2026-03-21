import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";

function readTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.blogPost.findMany({
    where: { category: post.category, published: true, id: { not: post.id } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "ReVia Research Supply",
      url: "https://revia.bio",
    },
    datePublished: post.publishedAt.toISOString(),
    image: post.image ?? undefined,
  };

  return (
    <>
      <JsonLd data={articleLd} />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-white">
            Blog
          </Link>{" "}
          / <span className="text-gray-400">{post.title}</span>
        </nav>

        {/* Hero image */}
        {post.image && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            {post.category}
          </span>
          <span>By {post.author}</span>
          <span>·</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{readTime(post.content)} min read</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>

        {/* Content */}
        <div
          className="prose-revia mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Related Articles</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-500/30"
              >
                <span className="text-xs text-emerald-400">{r.category}</span>
                <h3 className="mt-2 font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {r.excerpt}
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
        .prose-revia h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 2rem; margin-bottom: 0.75rem; }
        .prose-revia p { color: #a1a1aa; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-revia ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-revia li { color: #a1a1aa; line-height: 1.8; margin-bottom: 0.5rem; }
        .prose-revia li strong { color: #d4d4d8; }
        .prose-revia blockquote { border-left: 3px solid #10b981; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #d4d4d8; }
        .prose-revia em { color: #71717a; }
        .prose-revia a { color: #34d399; text-decoration: underline; }
      `,
        }}
      />
    </>
  );
}
