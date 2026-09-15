import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";
import PartnerShopButton from "@/components/PartnerShopButton";
import FloatingOrbs from "@/components/FloatingOrbs";
import ItemListSchema from "@/components/seo/ItemListSchema";
import { D2C } from "@/lib/partner";

// ISR — cache for 60s, serve stale while revalidating up to 5min
export const revalidate = 60;

/* ------------------------------------------------------------------ */
/*  Showcase, not a catalogue.                                         */
/*                                                                     */
/*  revialife.com does not sell. This page used to be the full store   */
/*  — search, category filter, sort and pagination over every product  */
/*  — and all of that apparatus went with the checkout. What is left   */
/*  is a short showcase that hands a visitor onward: to the compound   */
/*  library to read, or to the partner storefront to order.            */
/* ------------------------------------------------------------------ */

const SHOWCASE_COUNT = 6;

export const metadata: Metadata = {
  title: "Research Compounds | ReVia Life",
  description:
    "A look at the research-grade peptides and compounds ReVia works with, and where to read about them in depth.",
  alternates: { canonical: "https://revialife.com/shop" },
  openGraph: {
    title: "Research Compounds | ReVia Life",
    description:
      "A look at the research-grade peptides and compounds ReVia works with, and where to read about them in depth.",
    url: "https://revialife.com/shop",
    type: "website",
  },
};

export default async function ShopPage() {
  const tier = await getActiveTier();

  // A few showcased compounds. `featured` is the admin-managed flag, so which
  // ones appear here stays editable from /admin without a deploy.
  let showcase = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { variants: true, category: true },
    take: SHOWCASE_COUNT,
  });
  if (showcase.length === 0) {
    showcase = await prisma.product.findMany({
      where: { active: true },
      include: { variants: true, category: true },
      orderBy: { name: "asc" },
      take: SHOWCASE_COUNT,
    });
  }

  const showcaseWithTierPricing = showcase.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      price: resolvePriceForVariant(v, tier),
    })),
  }));

  return (
    <section className="relative mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
      <ItemListSchema
        name="ReVia Life — Research Compounds"
        items={showcaseWithTierPricing.map((p) => ({
          name: p.name,
          url: `https://revialife.com/shop/${p.slug}`,
        }))}
      />
      <FloatingOrbs />

      {/* ── Header ── */}
      <div className="relative z-10 mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
          A Closer Look
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Research Compounds
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600">
          A few of the compounds we work with. Each one has a page explaining what it is and
          what the research says. Ordering happens at {D2C.name}.
        </p>
      </div>

      {/* ── Showcase ── */}
      <div className="relative z-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6">
        {showcaseWithTierPricing.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ── Onward: read, or order ── */}
      <div className="relative z-10 mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-sky-200/60 bg-sky-50/50 p-7">
          <BookOpen className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold text-stone-800">
            The compound library
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
            Mechanisms, research applications and cited studies, compound by compound.
          </p>
          <Link
            href="/research"
            className="mt-5 inline-flex items-center gap-1.5 self-start rounded-xl border border-sky-300/60 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Browse the library
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-sky-200/60 bg-sky-50/50 p-7">
          <h2 className="text-lg font-semibold text-stone-800">Ready to order?</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
            The full catalogue is carried by our exclusive research partner, {D2C.name}.
          </p>
          <PartnerShopButton audience="d2c" size="md" variant="solid" className="mt-5 self-start">
            Shop at {D2C.name}
          </PartnerShopButton>
        </div>
      </div>
    </section>
  );
}
