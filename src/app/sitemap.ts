import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { researchCompounds } from "@/data/research-compounds";
import { CITIES } from "@/data/cities";
export const dynamic = "force-dynamic";

const SITE = "https://revialife.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, blogPosts, stacks] = await Promise.all([
    prisma.product.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true },
    }),
    // stacks are products in the "Stacks" category — surface them under /stacks/[slug]
    prisma.product.findMany({
      where: { category: { name: { equals: "Stacks", mode: "insensitive" } } },
      select: { slug: true },
    }),
  ]);

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/shop/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Category filter URLs intentionally excluded from the sitemap (audit May 2026):
  // they're thin filter views of /shop, not standalone landing pages.
  void categories;

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${SITE}/blog/${b.slug}`,
    lastModified: b.publishedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const researchUrls: MetadataRoute.Sitemap = researchCompounds.map((c) => ({
    url: `${SITE}/research/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const stackUrls: MetadataRoute.Sitemap = stacks.map((s) => ({
    url: `${SITE}/stacks/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const policySlugs = [
    "aup",
    "ccpa",
    "cookies",
    "disclaimer",
    "payments",
    "privacy",
    "refunds",
    "shipping",
    "terms",
  ];
  const policyUrls: MetadataRoute.Sitemap = policySlugs.map((slug) => ({
    url: `${SITE}/policies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/research`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/stacks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/why-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Geofenced engine: /locations index + 25 city hubs + featured products ×
  // cities. The long-tail product×city pages render on demand (ISR) and are
  // discoverable via the city hubs; featured combos are surfaced here to focus
  // crawl budget on the highest-intent terms.
  const geoFeatured = await prisma.product.findMany({
    where: { active: true, featured: true },
    select: { slug: true },
  });
  const locationUrls: MetadataRoute.Sitemap = [
    { url: `${SITE}/locations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...CITIES.map((c) => ({
      url: `${SITE}/locations/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...CITIES.flatMap((c) =>
      geoFeatured.map((p) => ({
        url: `${SITE}/locations/${c.slug}/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ),
  ];

  return [
    ...staticUrls,
    ...productUrls,
    ...stackUrls,
    ...researchUrls,
    ...blogUrls,
    ...policyUrls,
    ...locationUrls,
  ];
}
