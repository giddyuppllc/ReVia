import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | ReVia",
  description:
    "ReVia is built for people who expect more from the wellness brands they choose. Quality, transparency, and a thoughtful standard of care.",
};

export default function AboutPage() {
  return <AboutContent />;
}
