import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Fraunces, Space_Grotesk, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";
import JsonLd from "@/components/JsonLd";
import LayoutShell from "@/components/LayoutShell";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookieConsent";
import AffiliateTracker from "@/components/AffiliateTracker";
import RuoBanner from "@/components/RuoBanner";
import AgeGate from "@/components/AgeGate";
import { Suspense } from "react";
import { POSITIONING_TITLE } from "@/lib/positioning";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `ReVia | ${POSITIONING_TITLE}`,
    template: "%s",
  },
  description:
    "Independently verified research peptides — >98% purity by RP-HPLC with UV detection, and a batch-specific certificate of analysis. US-based.",
  authors: [{ name: "ReVia" }],
  creator: "ReVia LLC",
  metadataBase: new URL("https://revialife.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReVia",
    url: "https://revialife.com/",
    title: `ReVia | ${POSITIONING_TITLE}`,
    description:
      "Independently verified research peptides \u2014 >98% purity by RP-HPLC, with a batch-specific COA.",
    images: [
      {
        url: "/images/hero-lab-coa.webp",
        width: 1200,
        height: 630,
        alt: "ReVia — Premium peptides, proven purity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `ReVia | ${POSITIONING_TITLE}`,
    description:
      "Independently verified research peptides \u2014 >98% purity by RP-HPLC, with a batch-specific COA.",
    images: ["/images/hero-overlook.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReVia Research Supply",
  url: "https://revialife.com",
  logo: "https://revialife.com/logo.png",
  description: "Premium research-grade peptides and compounds for scientific research.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@revialife.com",
    contactType: "customer service",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

// The SearchAction that used to sit here pointed at /shop?q={term}. That search
// went with the storefront, so advertising the endpoint in structured data would
// hand Google a query URL that silently ignores the query.
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ReVia Life",
  url: "https://revialife.com/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${mono.variable} ${fraunces.variable} ${spaceGrotesk.variable} ${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-overlook.webp"
          fetchPriority="high"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WDJGY6R2PS" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-WDJGY6R2PS',{linker:{domains:['revialife.com','world-wide-peptide.com']}});`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-[#453834]">
        <RuoBanner />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <Toast />
        <LayoutShell>{children}</LayoutShell>
        <ChatWidget />
        <CookieConsent />
        <Suspense><AffiliateTracker /></Suspense>
        <AgeGate />
        {/* WelcomePopup is unmounted, not deleted. It traded an email for the
            WELCOME first-order discount code and told the visitor to "use this
            code at checkout" — an offer this site can no longer honour now that
            it does not take orders. The component and its /api/newsletter path
            are intact, so it can come back as a plain updates sign-up whenever
            Edward has written that copy. NewsletterBanner on the home page
            still captures email in the meantime. */}
      </body>
    </html>
  );
}
