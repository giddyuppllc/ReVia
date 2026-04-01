import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";
import FloatingOrbs from "@/components/FloatingOrbs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | ReVia",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { category, q, sort } = await searchParams;

  /* ── Fetch categories for sidebar ── */
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const tier = await getActiveTier();

  /* ── Build product query filters ── */
  const where: Record<string, unknown> = { active: true };

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  /* ── Sort ── */
  let orderBy: Record<string, string> = { name: "asc" };
  if (sort === "price-asc") {
    orderBy = { name: "asc" }; // will sort client-side below
  } else if (sort === "price-desc") {
    orderBy = { name: "asc" };
  } else if (sort === "name") {
    orderBy = { name: "asc" };
  }

  let products = await prisma.product.findMany({
    where,
    include: {
      variants: true,
      category: true,
    },
    orderBy,
  });

  /* Apply tier pricing to variants */
  const productsWithTierPricing = products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      price: resolvePriceForVariant(v, tier),
    })),
  }));

  /* Price-based sorting (needs variant data) */
  let sortedProducts = productsWithTierPricing;
  if (sort === "price-asc") {
    sortedProducts = productsWithTierPricing.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price));
      const bMin = Math.min(...b.variants.map((v) => v.price));
      return aMin - bMin;
    });
  } else if (sort === "price-desc") {
    sortedProducts = productsWithTierPricing.sort((a, b) => {
      const aMin = Math.min(...a.variants.map((v) => v.price));
      const bMin = Math.min(...b.variants.map((v) => v.price));
      return bMin - aMin;
    });
  }

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
      <FloatingOrbs />

      {/* ── Header ── */}
      <div className="relative z-10 mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Shop All Products
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Search + Sort bar ── */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-sky-200/40 bg-sky-50/60 backdrop-blur-sm p-4 mb-10">
        <form action="/shop" method="GET" className="flex max-w-lg flex-1 gap-3">
          {category && <input type="hidden" name="category" value={category} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search products..."
              className="w-full rounded-xl border border-sky-200/50 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
          >
            Search
          </button>
        </form>

        {/* Sort links */}
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <span className="font-medium">Sort:</span>
          <div className="flex gap-1.5">
            {[
              { value: "name", label: "Name" },
              { value: "price-asc", label: "Price: Low-High" },
              { value: "price-desc", label: "Price: High-Low" },
            ].map((s) => {
              const params = new URLSearchParams();
              if (category) params.set("category", category);
              if (q) params.set("q", q);
              params.set("sort", s.value);
              const isActive = sort === s.value || (!sort && s.value === "name");
              return (
                <Link
                  key={s.value}
                  href={`/shop?${params.toString()}`}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-sky-400 text-white shadow-sm"
                      : "bg-white/80 text-stone-600 hover:bg-white"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main layout: sidebar + grid ── */}
      <div className="relative z-10 flex flex-col gap-12 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-60">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-sky-200/40 bg-sky-50/60 backdrop-blur-sm p-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-700 mb-4 px-2">
              Categories
            </h2>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/shop"
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    !category
                      ? "bg-sky-400 text-white shadow-sm"
                      : "bg-white/70 text-stone-600 border border-sky-200/40 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  All Products
                </Link>
              </li>
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${q ? `&q=${q}` : ""}${sort ? `&sort=${sort}` : ""}`}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-sky-400 text-white shadow-sm"
                          : "bg-white/70 text-stone-600 border border-sky-200/40 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-stone-500">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
