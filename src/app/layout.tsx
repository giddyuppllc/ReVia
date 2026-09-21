import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Fraunces, Space_Grotesk, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";
import JsonLd from "@/components/JsonLd";
import LayoutShell from "@/components/LayoutShell";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import RuoBanner from "@/components/RuoBanner";
import { Suspense } from "react";
import { REVIA_NETWORK } from "@/lib/partner";
import { isCanonicalDeployment } from "@/lib/canonical-host";
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
    /* This was /images/hero-lab-coa.webp — a rendered photograph of vials beside
       a framed "CERTIFICATE OF ANALYSIS" whose fields are legible at card size.

       It is a fabricated document. The product name, batch number and dates are
       blank; there is a drawn signature over "QA APPROVAL"; it reports ≥99%
       purity against a real specification of >98% (src/lib/coa.ts); and it
       reports results for endotoxins and residual solvents — two tests named in
       scripts/check-claims.ts as things no certificate here carries.

       The claim gate could not see any of it, because the claims are pixels in
       a WebP. And it was the share card for every page: every link posted to
       Slack, LinkedIn or iMessage rendered a fake certificate as the preview for
       a site whose only product is that its documents can be checked.

       Moved to docs/quarantine/. The two cards now agree, which they did not
       before — Twitter and LinkedIn were rendering different images for the
       same URL. See the note there: the replacement is stock photography and is
       a placeholder, not an endorsement of it. */
    images: [
      {
        url: "/images/hero-overlook.webp",
        width: 1200,
        height: 630,
        alt: "ReVia Research Peptides",
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
  // Indexable only when this deployment IS revialife.com — see
  // src/lib/canonical-host.ts. The preview on *.vercel.app says noindex, so it
  // cannot become a second copy of the site competing with the real one.
  robots: isCanonicalDeployment()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

// `sameAs` and `subOrganization` assert the group relationship to a search
// engine, which is what lets authority earned on the record accrue to the
// properties it points at.
//
// ReVia Providers is deliberately absent from both. It is noindex,nofollow
// site-wide, so naming it here would assert a relationship with pages search
// engines have been told to ignore — and a property with no public address is
// not a URL at all.
const NETWORK_URLS = REVIA_NETWORK.filter((s) => s.id !== "providers" && s.url).map(
  (s) => s.url as string,
);

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ReVia",
  url: "https://revialife.com",
  logo: "https://revialife.com/logo.png",
  description:
    "ReVia's brand and public record: the statements made to the FDA, what the certificates of analysis report, and the compound monographs. This site sells nothing.",
  sameAs: NETWORK_URLS,
  subOrganization: REVIA_NETWORK.filter((s) => s.id !== "providers" && s.url).map((s) => ({
    "@type": "Organization",
    name: s.name,
    url: s.url as string,
  })),
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
      </head>
      <body className="min-h-full flex flex-col text-[#453834]">
        <RuoBanner />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <Toast />
        <LayoutShell>{children}</LayoutShell>
        <ChatWidget />
        <CookieConsent />
        <Analytics />
        {/*
          AffiliateTracker was mounted here. It set a `revia_ref` tracking
          cookie for thirty days and POSTed to /api/affiliate/click, a route
          deleted with the rest of the affiliate programme — so on every visit
          carrying a ?ref it wrote a cookie nothing read and made a request
          that 404d. The programme runs at i2b now, and its own tracking with
          it.
        */}
        {/*
          AgeGate was mounted here. It put a full-screen "You must be 21 years
          of age or older to access this website" modal in front of every page,
          including Mike Stone's testimony to the FDA — a public record — and it
          said "all products are intended for qualified researchers" on a site
          that has no products.

          An age gate belongs in front of a purchase. This site has none: it
          publishes, and the properties that do sell keep their own. Gating the
          record is the one thing that makes a public record less public, and it
          was never a control anyway — it stored a localStorage flag.

          The RUO banner above stays. That is the disclosure that carries
          meaning, and it is on every page without standing in front of it.
        */}
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
