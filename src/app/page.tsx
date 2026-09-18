import HeroBanner from "@/components/HeroBanner";
import HeroCarousel from "@/components/HeroCarousel";
import FloatingPaths from "@/components/FloatingPaths";
import CompoundShowcase from "@/components/CompoundShowcase";
import NewsletterBanner from "@/components/NewsletterBanner";
import HomeFAQ from "@/components/HomeFAQ";
import TrustTicker from "@/components/TrustTicker";
import { getPublicStats } from "@/lib/stats";
import ReviaNetwork from "@/components/ReviaNetwork";
// Static. Nothing on this page reads a database any more — the showcase is a
// curated list in src/data/research-compounds.ts and the figures come from
// src/lib/stats.ts, which derives them from data files and the provider's
// catalogue.
export const revalidate = 3600;

export const metadata = {
  alternates: { canonical: "https://revialife.com" },
};

export default async function HomePage() {
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
            <CompoundShowcase />
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
