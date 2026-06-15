import type { Metadata } from "next";

// The contact page itself is a client component (form state), so its
// canonical + title live here in a sibling server-component layout.
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with ReVia Research Supply — questions about products, orders, shipping, returns, or wholesale.",
  alternates: { canonical: "https://revialife.com/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
