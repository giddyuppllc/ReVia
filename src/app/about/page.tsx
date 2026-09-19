import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About ReVia | Why Mike Stone Started ReVia",
  description:
    "ReVia is built for people who expect more from the wellness brands they choose. Quality, transparency, and a thoughtful standard of care.",
  alternates: { canonical: "https://revialife.com/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
