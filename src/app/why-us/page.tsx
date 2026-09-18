import type { Metadata } from "next";
import WhyReVia from "@/components/WhyReVia";

export const metadata: Metadata = {
  title: "Why ReVia | ReVia Research Supply",
  description:
    "What sets ReVia apart — every lot finished and tested in the United States, and a certificate for that lot naming the laboratory, the method, the limits and the results on every batch.",
  alternates: { canonical: "https://revialife.com/why-us" },
};

export default function WhyUsPage() {
  return (
    <div className="bg-sky-50/30">
      <WhyReVia />
    </div>
  );
}
