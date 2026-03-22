import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ShippingBanner from "@/components/ShippingBanner";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ReVia | Research-Grade Peptides",
    template: "%s | ReVia",
  },
  description:
    "Premium research-grade peptides and compounds for scientific research. Rigorous testing, fast shipping, extensive catalog.",
  keywords: [
    "research peptides",
    "peptide supply",
    "BPC-157",
    "semaglutide",
    "tirzepatide",
    "GHK-Cu",
    "research compounds",
    "peptide vendor",
  ],
  authors: [{ name: "ReVia Research Supply" }],
  creator: "ReVia Research Supply LLC",
  metadataBase: new URL("https://revia.bio"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReVia",
    title: "ReVia | Research-Grade Peptides",
    description:
      "Premium research-grade peptides and compounds for scientific research.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReVia | Research-Grade Peptides",
    description:
      "Premium research-grade peptides and compounds for scientific research.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://revia.bio",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReVia Research Supply",
  url: "https://revia.bio",
  logo: "https://revia.bio/logo.png",
  description: "Premium research-grade peptides and compounds for scientific research.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@revia.bio",
    contactType: "customer service",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#1a2e1a]">
        <JsonLd data={organizationLd} />
        <Navbar />
        <ShippingBanner />
        <CartDrawer />
        <Toast />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
