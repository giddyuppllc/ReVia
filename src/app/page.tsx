import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getActiveTier, resolvePriceForVariant } from "@/lib/pricing";
import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import TrustTicker from "@/components/TrustTicker";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  const isLoggedIn = !!user;

  // Only fetch products if logged in (paywall)
  let featuredProducts: Array<{
    id: string; name: string; slug: string; image: string | null;
    variants: Array<{ id: string; label: string; price: number }>;
    category: { name: string };
  }> = [];

  if (isLoggedIn) {
    const tier = await getActiveTier();
    const rawFeatured = await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { variants: true, category: true },
      take: 8,
    });
    featuredProducts = rawFeatured.map((p) => ({
      id: p.id, name: p.name, slug: p.slug, image: p.image,
      variants: p.variants.map((v) => ({ id: v.id, label: v.label, price: resolvePriceForVariant(v, tier) })),
      category: { name: p.category.name },
    }));
  }

  return (
    <div className="relative">
      {/* Hero background */}
      <div className="absolute top-4 left-4 right-4 h-[55vh] sm:top-6 sm:left-8 sm:right-8 sm:h-[65vh] lg:left-12 lg:right-12 z-0 overflow-hidden rounded-2xl sm:rounded-3xl">
        <img src="/images/hero-vials.webp" alt="" className="h-full w-full object-cover object-[65%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0EDE5] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#F0EDE5]/70 sm:hidden" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#F0EDE5]/80 from-10% to-transparent to-50%" />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <FloatingPaths />
      </div>

      <div className="relative z-[2]">
        {/* Hero */}
        <div>
          <HeroBanner />
          <HeroCarousel />
        </div>

        {/* Trust Ticker — always visible */}
        <TrustTicker />

        {/* Featured Products — logged-in only */}
        {isLoggedIn && featuredProducts.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30" />
            <div className="relative">
              <FeaturedProducts products={featuredProducts} />
            </div>
          </div>
        )}

        {/* FAQ */}
        <HomeFAQ />

        {/* Newsletter */}
        <NewsletterBanner />
      </div>
    </div>
  );
}
