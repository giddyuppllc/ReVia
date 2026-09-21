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
        a: "Research peptides are synthetic chains of amino acids used in laboratory research to study biological processes. Every ReVia compound is labeled For Research Use Only (RUO). They're not for human or animal consumption, and not for diagnosing, treating, or preventing any disease.",
      },
      {
        q: "How do I order ReVia compounds?",
        a: `Ordering goes through i2b Health, our exclusive research partner, which sells directly to researchers. Read up on a compound here, then head to ${D2C.name} to order.`,
        cta: { label: `Shop at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
      {
        q: "Why can’t I order on this site?",
        a: "This site is where we explain the compounds: how they work, what the research says, how we source and test them, and what's in each blend. i2b Health carries the catalog and handles orders. Each site does one job.",
        cta: { label: "See the compound library", href: "/research" },
      },
      {
        q: "Who can order?",
        a: `i2b Health sells to qualified researchers, independent labs, and individuals 18 or older who agree to use the compounds only for legitimate research. Clinics, brands, and distributors are handled separately by ${B2B.name}.`,
      },
      {
        q: "Do I need an account here?",
        a: "No. Everything on this site is free to read, no account needed. If you order through i2b Health, you'll create an account there to track orders and leave reviews.",
      },
    ],
  },
  {
    title: "Products & Quality",
    items: [
      {
        q: "Are your peptides third-party tested?",
        a: "Yes. An independent lab tests every lot, and the lot-specific Certificate of Analysis reports identity, quantity, purity, and heavy metals.",
      },
      {
        q: "What purity level are your peptides?",
        a: "Every compound is made to a purity spec of greater than 98%, verified by RP-HPLC with UV detection. The Certificate of Analysis shows the actual measured number for the lot you have.",
      },
      {
        q: "Do you offer Certificates of Analysis?",
        a: "Yes. There's a lot-specific COA for every compound. Where one has been uploaded, the link is right on the compound's page. You can also email orders@revialife.com with your order number and we'll send the documentation for your lot.",
      },
      {
        q: "How should I store my peptides?",
        a: "Keep lyophilized peptides at 2–8°C, away from light and moisture. Once reconstituted, keep them refrigerated and use within 30 days. For long-term storage, −20°C.",
      },
      {
        q: "What is the shelf life?",
        a: "Stored properly, lyophilized peptides stay stable for 18 to 24 months. Reconstituted peptides should be used within 30 days.",
      },
      {
        q: "What’s the difference between lyophilized and reconstituted?",
        a: "Lyophilized is freeze-dried powder, the stable form the compound ships and stores in. Reconstituted means it's been dissolved in a solvent like bacteriostatic water, after which it should be used within 30 days. Don't reconstitute until you're ready to start.",
      },
    ],
  },
  {
    title: "Stacks & Blends",
    items: [
      {
        q: "What is a peptide stack?",
        a: "A stack is a blend: two or more complementary compounds combined in one vial at fixed ratios instead of shipped as separate vials. You reconstitute it once and draw it as one solution.",
        cta: { label: "Read the full explainer", href: "/stacks" },
      },
      {
        q: "Which blends does ReVia formulate?",
        a: "LEAN (metabolic), LEAN PRO+ (advanced metabolic), RENEW (recovery), SCULPT & GLOW (body composition and aesthetics), GLOW (skin), and KLOW (aesthetics and hormonal support).",
      },
      {
        q: "Why use a blend instead of separate vials?",
        a: "The ratio between compounds is fixed when the vial is blended, so it isn't something you have to get right at the bench. And there's one reconstitution instead of several. The vial is built around one line of research.",
      },
    ],
  },
  {
    title: "Ordering & Supply",
    items: [
      {
        q: "Where can I obtain these compounds?",
        a: "Individual orders go through i2b Health, our exclusive research partner.",
        cta: { label: `Shop at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
      {
        q: "Do you offer wholesale pricing?",
        a: `Yes. ${B2B.name} handles bulk supply and tiered pricing for clinics, brands, distributors, and research institutions. It's trade accounts only.`,
        cta: { label: "Wholesale inquiries", href: b2bUrl("wholesale"), external: true },
      },
      {
        q: "Can I private label ReVia compounds?",
        a: `Yes. Private label is set up through ${B2B.name}.`,
        cta: { label: "Private label", href: b2bUrl("privateLabel"), external: true },
      },
      {
        // Deliberately does not promise a terms page on the partner site:
        // /shipping, /terms, /policies and /faq all 404 there today. Sending
        // someone to look for one would be a dead end.
        q: "Who ships my order?",
        a: `Whoever you ordered from: i2b Health for individual orders, ${B2B.name} for trade accounts. Payment, delivery, and returns are handled there, and they'll confirm the current terms when you place the order.`,
        cta: { label: `Order at ${D2C.name}`, href: d2cUrl(), external: D2C.isLive },
      },
    ],
  },
  {
    title: "Research & Safety",
    items: [
      {
        q: "Are your products FDA approved?",
        a: "No. These are research chemicals for laboratory use only. They're not FDA approved, not for human or animal consumption, and not for diagnosing, treating, curing, or preventing any disease.",
      },
      {
        q: "Can I get research guidance?",
        a: "We can answer questions about what's in a compound and how to store and handle it. Email info@revialife.com. We can't provide research protocols or dosing guidance.",
      },
      {
        q: "What is used to reconstitute a peptide?",
        a: "Bacteriostatic water, usually. A few compounds need acetic acid instead. Each compound's page says which one applies.",
        cta: { label: "Browse the compound library", href: "/research" },
      },
    ],
  },
  {
    title: "Policies",
    items: [
      {
        q: "Where can I read your full policies?",
        a: "Terms of Service, Privacy Policy, Shipping Policy, Refund Policy, Acceptable Use Policy, CCPA Notice, Cookie Policy, and Payment Policy are all linked in the footer.",
        cta: { label: "All policies", href: "/policies" },
      },
    ],
  },
];

/** Flat list for the FAQPage structured data. */
export const FAQ_FLAT: { q: string; a: string }[] = FAQ_SECTIONS.flatMap((s) =>
  s.items.map(({ q, a }) => ({ q, a }))
);
