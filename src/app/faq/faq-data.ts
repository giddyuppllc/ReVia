import { B2B, D2C, b2bUrl, d2cUrl } from "@/lib/partner";

/* ------------------------------------------------------------------ */
/*  The FAQ, in one place.                                             */
/*                                                                     */
/*  This used to live twice: a `sections` array in faq-content.tsx for */
/*  what a visitor reads, and a flat `faqData` array in page.tsx for   */
/*  the FAQPage JSON-LD. The two had already drifted — the visible     */
/*  copy said ">99% purity", the structured data said "98%+" — so a    */
/*  correction applied to one surface silently left the other lying to */
/*  Google. Both now read from here.                                   */
/* ------------------------------------------------------------------ */

export interface FaqCta {
  label: string;
  href: string;
  /** True for the partner storefront — opens in a new tab. */
  external?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
  cta?: FaqCta;
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
}

export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What are research peptides?",
        a: "Research peptides are synthetic amino acid chains used in laboratory research to study biological processes. All ReVia compounds are labeled “For Research Use Only” (RUO) and are not intended for human or animal consumption, diagnosis, treatment, or prevention of any disease.",
      },
      {
        q: "How do I order ReVia compounds?",
        a: `Ordering is handled by our exclusive research partner, ${D2C.name}, which supplies researchers direct. Read about a compound here, then head over to place the order.`,
        cta: { label: `Shop at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
      {
        q: "Why can’t I order on this site?",
        a: `This site is where ReVia explains its compounds — mechanisms, research context, sourcing standards and stack composition. ${D2C.name} carries the catalogue and handles ordering, so each does one job properly.`,
        cta: { label: "See the compound library", href: "/research" },
      },
      {
        q: "Who can order?",
        a: `${D2C.name} supplies qualified researchers, independent labs and individuals aged 18+ who agree to use compounds solely for legitimate research purposes. Clinics, brands and distributors are supplied separately by ${B2B.name}.`,
      },
      {
        q: "Do I need an account here?",
        a: "No. Everything on this site is open to read without one. An account exists so returning customers can reach their earlier order history and reviews.",
      },
    ],
  },
  {
    title: "Products & Quality",
    items: [
      {
        q: "Are your peptides third-party tested?",
        a: "Yes. Every batch is tested by an independent laboratory, and the batch-specific Certificate of Analysis reports identity and purity by RP-HPLC.",
      },
      {
        q: "What purity level are your peptides?",
        a: "Compounds meet a >98% purity specification, verified by RP-HPLC with UV detection and reported on the batch Certificate of Analysis. The certificate shows the measured figure for the batch you have.",
      },
      {
        q: "Do you offer Certificates of Analysis?",
        a: "Yes. Batch-specific COAs are available for every compound. Where one has been uploaded, the COA link appears directly on that compound’s page. You can also email orders@revialife.com with your order number and we’ll send the batch documentation.",
      },
      {
        q: "How should I store my peptides?",
        a: "Store lyophilized peptides at 2–8°C, protected from light and moisture. Once reconstituted, use within 30 days and keep refrigerated. For long-term storage, −20°C is recommended.",
      },
      {
        q: "What is the shelf life?",
        a: "Lyophilized peptides remain stable 18–24 months when stored properly. Reconstituted peptides should be used within 30 days.",
      },
      {
        q: "What’s the difference between lyophilized and reconstituted?",
        a: "Lyophilized means freeze-dried powder — the stable form compounds ship and store in. Reconstituted means dissolved in a solvent such as bacteriostatic water, after which it should be used within 30 days. Reconstitute only when you are ready to begin.",
      },
    ],
  },
  {
    title: "Stacks & Blends",
    items: [
      {
        q: "What is a peptide stack?",
        a: "A stack is a blend: two or more complementary compounds combined in a single vial at fixed ratios, rather than handled as separate vials. It is reconstituted once and drawn as one solution.",
        cta: { label: "Read the full explainer", href: "/stacks" },
      },
      {
        q: "Which blends does ReVia formulate?",
        a: "LEAN (metabolic), LEAN PRO+ (advanced metabolic), RENEW (recovery), SCULPT & GLOW (body composition and aesthetics), GLOW (skin), and KLOW (aesthetics and hormonal support).",
      },
      {
        q: "Why use a blend instead of separate vials?",
        a: "The ratio between compounds is set at the point the vial is blended rather than at the bench, and there is one reconstitution instead of several — so the vial is organised around a single line of research.",
      },
    ],
  },
  {
    title: "Ordering & Supply",
    items: [
      {
        q: "Where do I place an order?",
        a: `Individual orders go through ${D2C.name}, our exclusive research partner.`,
        cta: { label: `Shop at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
      {
        q: "Do you offer wholesale pricing?",
        a: `Yes. Wholesale, bulk supply and tiered pricing for clinics, brands, distributors and research institutions are handled by ${B2B.name}, which supplies trade accounts only.`,
        cta: { label: "Wholesale enquiries", href: b2bUrl("wholesale"), external: true },
      },
      {
        q: "Can I private label ReVia compounds?",
        a: `Yes. Private label supply is arranged through ${B2B.name}.`,
        cta: { label: "Private label", href: b2bUrl("privateLabel"), external: true },
      },
      {
        // Deliberately does not promise a terms page on the partner site:
        // /shipping, /terms, /policies and /faq all 404 there today. Sending
        // someone to look for one would be a dead end.
        q: "Who ships my order?",
        a: `Whichever side you ordered from — ${D2C.name} for individual orders, ${B2B.name} for trade accounts. Payment, delivery and returns are handled there, and their desk confirms the current terms as the order is placed.`,
        cta: { label: `Order at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
    ],
  },
  {
    title: "Research & Safety",
    items: [
      {
        q: "Are your products FDA approved?",
        a: "No. These are research chemicals for laboratory use only. They are not FDA approved, not for human or animal consumption, and not for the diagnosis, treatment, cure or prevention of any disease.",
      },
      {
        q: "Can I get research guidance?",
        a: "We can answer questions about compound composition, storage and handling — email info@revialife.com. We cannot provide research protocols or dosing guidance.",
      },
      {
        q: "What is used to reconstitute a peptide?",
        a: "Bacteriostatic water is the usual solvent; acetic acid is used for a few compounds that need it. Which one applies is noted on the compound’s own page.",
        cta: { label: "Browse the compound library", href: "/research" },
      },
    ],
  },
  {
    title: "Policies",
    items: [
      {
        q: "Where can I read your full policies?",
        a: "Terms of Service, Privacy Policy, Shipping Policy, Refund Policy, Acceptable Use Policy, CCPA Notice, Cookie Policy and Payment Policy are all linked in the footer.",
        cta: { label: "All policies", href: "/policies" },
      },
    ],
  },
];

/** Flat list for the FAQPage structured data. */
export const FAQ_FLAT: { q: string; a: string }[] = FAQ_SECTIONS.flatMap((s) =>
  s.items.map(({ q, a }) => ({ q, a }))
);
