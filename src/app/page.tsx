import TestimonyHero from "@/components/record/TestimonyHero";
import Positioning, { KnowMore } from "@/components/record/Positioning";
import TheStandard from "@/components/record/TheStandard";
import HowToBuy from "@/components/record/HowToBuy";
import TheRecord from "@/components/record/TheRecord";
import TheNetwork from "@/components/record/TheNetwork";
import NewsletterBanner from "@/components/NewsletterBanner";

/**
 * ReVia Life — the record.
 *
 * The page this replaces opened with four vials on a worktop, a "Shop
 * Compounds" button and the line "Premium Peptides. Proven Purity. Real
 * Results." It was a storefront on a site that sells nothing, it made an outcome
 * claim no document supports, and the hero photograph had a certificate composed
 * into it reading ">= 99% purity", "Endotoxins < 0.1 EU/mg" and "Residual
 * Solvents — Complies" — three claims this site's own build gate forbids, sitting
 * in a JPEG where no checker can reach them.
 *
 * What is here instead is an argument in four movements:
 *
 *   1. the testimony — the founder, on the federal record, with a timecode
 *   2. why it exists — the standard he built for his own family, and the four
 *                      things ReVia can show for it
 *   3. the standard  — what the certificate actually reports
 *   4. how to buy    — the questions to ask anyone, ours answered
 *   5. the record    — what this site publishes
 *   6. the group     — who serves whom, and under which rules
 *
 * Nothing on it is for sale, and there is no photograph of a product anywhere.
 * The authority is meant to come from what can be checked.
 */
export const revalidate = 3600;

export const metadata = {
  alternates: { canonical: "https://revialife.com" },
};

export default function HomePage() {
  return (
    <>
      <TestimonyHero />
      <Positioning />
      <TheStandard />
      <HowToBuy />
      <TheRecord />
      <TheNetwork />
      <KnowMore />
      <div className="bg-[#F0EDE5] pb-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <NewsletterBanner />
        </div>
      </div>
    </>
  );
}
