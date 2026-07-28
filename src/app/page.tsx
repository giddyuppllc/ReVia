import { prisma } from "@/lib/prisma";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import TrustTicker from "@/components/TrustTicker";
export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "https://revialife.com" },
};

export default async function HomePage() {
  const tier = await getActiveTier();
  const rawFeatured = await prisma.product.findMany({
    where: { featured: true, active: true },
    include: { variants: true, category: true },
    take: 8,
  });
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0EDE5] from-2% via-[#F0EDE5]/25 via-22% to-transparent to-55%" />
        <div className="absolute inset-0 bg-[#F0EDE5]/82 sm:hidden" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#F0EDE5] from-25% via-[#F0EDE5]/88 via-44% to-transparent to-74%" />
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
        <TrustTicker />

        {/* FAQ */}
        <HomeFAQ />

        {/* Newsletter */}
        <NewsletterBanner />
      </div>
    </div>
  );
}
