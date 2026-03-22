import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";
import { FlaskConical, Truck, HeadphonesIcon, Atom } from "lucide-react";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { variants: true, category: true },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <HeroBanner />

      {/* Stats bar */}
      <section className="border-y border-emerald-200/40 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            { icon: FlaskConical, label: "Lab-Verified", sub: "98%+ Purity" },
            { icon: Truck, label: "Fast Shipping", sub: "Same-Day Processing" },
            { icon: HeadphonesIcon, label: "Expert Support", sub: "24hr Response" },
            { icon: Atom, label: "74+ Compounds", sub: "Growing Catalog" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 px-6 py-6 sm:py-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                <s.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-950">{s.label}</p>
                <p className="text-xs text-emerald-800/50">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Curated Selection</p>
            <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl">Featured Products</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-emerald-200/40 bg-white/50 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-emerald-900/60 transition hover:bg-neutral-50 hover:text-emerald-950"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  price: v.price,
                })),
                category: { name: product.category.name },
              }}
            />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="text-emerald-600 font-medium text-sm">
            View All Products →
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Browse</p>
        <h2 className="text-3xl font-bold text-emerald-950 mb-8 sm:text-4xl">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              productCount={cat._count.products}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-10 md:p-16">
          <div className="relative text-center">
            <h2 className="text-2xl font-bold text-emerald-950 md:text-3xl">
              Stay in the Loop
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-emerald-900/60">
              New compounds, research news, and exclusive offers — straight to your inbox.
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>

      {/* RUO */}
      <section className="border-t border-emerald-200/40 bg-emerald-50/50 py-10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700/40 mb-2">
            Important Notice
          </p>
          <p className="text-sm text-emerald-800/50 leading-relaxed">
            All products sold by ReVia are intended for laboratory research use
            only. They are not intended for human or animal consumption, or for
            use in the diagnosis, treatment, cure, or prevention of any disease.
          </p>
        </div>
      </section>
    </>
  );
}
