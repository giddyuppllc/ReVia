import type { Metadata } from "next";

/*
 * The contact page is a client component and cannot export metadata, so its
 * title fell back to the homepage's. Title from the copy rewrite (19 Sep).
 */
export const metadata: Metadata = {
  title: "Contact ReVia",
  alternates: { canonical: "https://revialife.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
