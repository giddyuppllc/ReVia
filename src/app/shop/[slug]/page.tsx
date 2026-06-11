import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";
import ReviewSection from "@/components/ReviewSection";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { CITIES } from "@/data/cities";
import { getProductImage, getVariantImages } from "@/lib/product-images";
import ProductDetailView from "@/components/ProductDetailView";
import BatchTimeline from "@/components/BatchTimeline";

// ISR — re-render at most every 60s
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, variants: true },
  });
  if (!product) return { title: "Product Not Found | ReVia" };
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const url = `https://revialife.com/shop/${slug}`;
  const desc =
    product.description ||
    `${product.name} - Research-grade peptide from ReVia. Starting at $${(minPrice / 100).toFixed(2)}.`;
  const heroImage = `https://revialife.com${getProductImage(product.slug, product.image)}`;
  const title = `${product.name} — Research Peptide | ReVia Life`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      type: "website",
      url,
      images: [{ url: heroImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [heroImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {

  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      category: true,
    },
  });

  if (!product) return notFound();

  const tier = await getActiveTier();
  const resolvedVariants = product.variants.map((v) => ({
    ...v,
    price: resolvePriceForVariant(v, tier),
  }));

  const minPrice = Math.min(...resolvedVariants.map((v) => v.price));
  const maxPrice = Math.max(...resolvedVariants.map((v) => v.price));

  // Reviews → aggregateRating + review schema (graceful no-op if none)
  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  const reviewCount = await prisma.review.count({ where: { productId: product.id } });
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? `${product.name} — premium peptide from ReVia, independently verified to >99% purity`,
    brand: { "@type": "Brand", name: "ReVia Life" },
    category: product.category.name,
    image: `https://revialife.com${getProductImage(product.slug, product.image)}`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: (minPrice / 100).toFixed(2),
      highPrice: (maxPrice / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      offerCount: product.variants.length,
    },
  };
  if (avgRating !== null && reviewCount > 0) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount,
    };
    productLd.review = reviews.map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      author: { "@type": "Person", name: r.user.name },
      name: r.title,
      reviewBody: r.body,
      datePublished: r.createdAt.toISOString(),
    }));
  }

  /* ── Related products (same category, exclude current) ── */
  const rawRelated = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true,
    },
    include: { variants: true, category: true },
    take: 4,
  });
  const related = rawRelated.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ ...v, price: resolvePriceForVariant(v, tier) })),
  }));

  // Reciprocal links into the geo network: feed authority from this high-value
  // product page down to its top metro landing pages (the leaves link back up
  // to here already).
  const TOP_METRO_SLUGS = [
    "miami", "tampa", "orlando", "jacksonville", "atlanta", "charlotte",
    "raleigh", "washington-dc", "baltimore", "philadelphia", "new-york", "boston",
  ];
  const geoMetros = TOP_METRO_SLUGS
    .map((s) => CITIES.find((c) => c.slug === s))
    .filter((c): c is (typeof CITIES)[number] => Boolean(c));

  const breadcrumbItems = [
    { name: "Home", url: "https://revialife.com/" },
    { name: "Shop", url: "https://revialife.com/shop" },
    ...(product.category
      ? [{ name: product.category.name, url: `https://revialife.com/shop?category=${product.category.slug}` }]
      : []),
    { name: product.name, url: `https://revialife.com/shop/${product.slug}` },
  ];

  return (
    <>
    <JsonLd data={productLd} />
    <BreadcrumbSchema items={breadcrumbItems} />
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ── */}
      <nav className="mb-8 flex items-center gap-1 text-sm text-neutral-400">
        <Link href="/" className="transition hover:text-neutral-700">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="transition hover:text-neutral-700">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {product.category && (
          <>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="transition hover:text-neutral-700"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      {/* ── Product layout ── */}
      <ProductDetailView
        productName={product.name}
        productSlug={product.slug}
        productDescription={product.description}
        categoryName={product.category?.name}
        defaultImage={getProductImage(product.slug, product.image)}
        variantImages={getVariantImages(product.slug, resolvedVariants)}
        variants={resolvedVariants.map((v) => ({
          id: v.id,
          label: v.label,
          price: v.price,
          inStock: v.inStock,
          stockStatus: (v as { stockStatus?: string }).stockStatus ?? (v.inStock ? "in_stock" : "out_of_stock"),
        }))}
        coaUrl={product.coaUrl}
      />

      {/* ── Batch Transparency ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BatchTimeline productSlug={product.slug} />
      </div>

      {/* ── Reviews ── */}
      <ReviewSection productId={product.id} />

      {/* ── Available by location → geo network ── */}
      {geoMetros.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-neutral-900">{product.name} by location</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            Researchers source {product.name} through ReVia Life across Florida and the East Coast.
            See local availability and shipping details:
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
            {geoMetros.map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}/${product.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-2 text-neutral-600 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40 hover:text-emerald-800"
              >
                {product.name} in {c.name}
              </Link>
            ))}
            <Link
              href="/locations"
              className="rounded-full border border-neutral-300 px-4 py-2 text-neutral-600 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40 hover:text-emerald-800"
            >
              All locations →
            </Link>
          </div>
        </div>
      )}

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-xl font-bold text-neutral-900">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
    </>
  );
}
