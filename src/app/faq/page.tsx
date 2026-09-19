import type { Metadata } from "next";
import FAQContent from "./faq-content";
import JsonLd from "@/components/JsonLd";
import { FAQ_FLAT } from "./faq-data";

export const metadata: Metadata = {
  title: "FAQ | ReVia",
  description:
    "Frequently asked questions about ReVia research compounds — testing, purity, storage, stacks, and where to order.",
};

// Built from the same source the page renders. This file used to carry its own
// copy of every question, which had already drifted from the visible answers.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FLAT.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <FAQContent />
    </>
  );
}
