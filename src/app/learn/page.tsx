import type { Metadata } from "next";
import { ARTICLES, articleCategories } from "@/content/articles";
import { readTime } from "@/lib/articles";
import { researchCompounds, CATEGORIES, getCompoundsByCategory } from "@/data/research-compounds";
import LearnTabs from "@/components/LearnTabs";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Learn | ReVia",
  description:
    "Articles, industry news, and compound research summaries from the ReVia team. Explore published research and stay up to date.",
  alternates: { canonical: "https://revialife.com/learn" },
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const { tab, category } = await searchParams;
  const activeTab = tab === "research" ? "research" : "articles";

  const posts =
    activeTab === "articles" && category
      ? ARTICLES.filter((a) => a.category === category)
      : ARTICLES;
  const blogCategories = articleCategories().map((c) => ({ category: c }));

  // Prepare research compounds
  const compounds = getCompoundsByCategory(activeTab === "research" ? (category ?? "") : "");

  // Serialize for client component
  const serializedPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    category: p.category,
    published: p.published,
    readTime: readTime(p.body),
  }));

  return (
    <LearnTabs
      activeTab={activeTab}
      category={category}
      posts={serializedPosts}
      blogCategories={blogCategories.map((c) => c.category)}
      compounds={compounds}
      researchCategories={[...CATEGORIES]}
    />
  );
}
