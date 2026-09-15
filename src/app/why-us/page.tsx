import type { Metadata } from "next";
import WhyReVia from "@/components/WhyReVia";

export const metadata: Metadata = {
  title: "Why ReVia | ReVia Research Supply",
  description:
    "What sets ReVia apart — US-manufactured, cGMP and ISO certified, >98% purity by RP-HPLC, and a batch-specific Certificate of Analysis on every batch.",
  alternates: { canonical: "https://revialife.com/why-us" },
};

export default function WhyUsPage() {
  return (
    <div className="bg-sky-50/30">
      <WhyReVia />
    </div>
  );
}
