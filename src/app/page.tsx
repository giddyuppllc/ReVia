import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import TrustTicker from "@/components/TrustTicker";
import { getPublicStats } from "@/lib/stats";
import ReviaNetwork from "@/components/ReviaNetwork";
export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "https://revialife.com" },
};

export default async function HomePage() {
  const tier = await getActiveTier();

  // Four figures the site can actually stand behind. "Results Reported Per
  // COA" is deliberately the smallest number on the row — it replaces a
  // claim of twelve QC tests with the four the certificate prints, and it
  // is checkable against the document.
  const trustStats = await getPublicStats([
    "documentedCompounds",
    "citations",
    "compoundCategories",
    "coaResults",
  ]);
  // Three top sellers on the home page. `featured` is the admin-managed flag
  // that has always driven this carousel, so the picks stay editable from
  // /admin without a deploy.
  let rawFeatured = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { variants: true, category: true },
    take: 3,
  });
  // Nothing flagged featured would render an empty carousel, so fall back to
  // active products rather than a blank band across the home page.
  if (rawFeatured.length === 0) {
    rawFeatured = await prisma.product.findMany({
      where: { active: true },
      include: { variants: true, category: true },
      orderBy: { name: "asc" },
      take: 3,
    });
  }
  const featuredProducts = rawFeatured.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, image: p.image,
    variants: p.variants.map((v) => ({
      id: v.id, label: v.label,
      price: resolvePriceForVariant(v, tier),
    })),
    category: { name: p.category.name },
  }));

  return (
    <div className="relative">
      {/* Hero background */}
      <div className="absolute top-0 left-0 right-0 h-[58vh] sm:h-[74vh] z-0 overflow-hidden bg-[#F0EDE5]">
        <img
          src="/images/hero-lab-coa.webp"
          alt=""
          width={1536}
          height={1024}
          fetchPriority="high"
          className="h-full w-full object-cover object-[50%_55%] sm:object-[68%_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0EDE5] from-0% via-[#F0EDE5]/20 via-14% to-transparent to-38%" />
        <div className="absolute inset-0 bg-[#F0EDE5]/20 sm:hidden" />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <FloatingPaths />
      </div>

      <div className="relative z-[2]">
        {/* Hero */}
        <HeroBanner />

        {/* Image links (3 cards) */}
        <HeroCarousel />

        {/* Featured Products Carousel */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30" />
          <div className="relative">
            <FeaturedProducts products={featuredProducts} />
          </div>
        </div>

        {/* Quality Assurance */}
        <TrustTicker stats={trustStats} />

        {/* The portal: where ordering happens, and every sibling site */}
        <ReviaNetwork />

        {/* FAQ */}
        <HomeFAQ />

        {/* Newsletter */}
        <NewsletterBanner />
      </div>
    </div>
  );
}
