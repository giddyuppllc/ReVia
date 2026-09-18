import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { D2C, PARTNER_LINK_PROPS, d2cUrl } from "@/lib/partner";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { researchCompounds, SHOWCASE_SLUGS } from "@/data/research-compounds";
import I2bAvailability from "@/components/I2bAvailability";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { getProductImage } from "@/lib/product-images";
import { CITIES, getCity } from "@/data/cities";
import { getCityProductCopy } from "@/data/geo-copy";
import { getCityProductContext } from "@/data/geo-context";

// Geofenced product × city money page: "Buy [Product] Research Peptide in
// [City]". Research-use-only / informational framing throughout — these pages
// target local SEARCH INTENT, not a physical storefront. No medical, treatment,
// or dosing claims. Links to the live /shop product page for purchase.

const SITE = "https://revialife.com";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ city: string; product: string }>;
}

// Pre-render featured products × all cities; the long tail renders on demand
// (ISR) the first time it's crawled, then caches. Keeps build time sane while
// every URL is still indexable + in the sitemap.
export function generateStaticParams() {
  // The showcase compounds across every city at build time; the rest of the
  // 38 x 25 grid renders on first crawl and caches (dynamicParams above).
  return CITIES.flatMap((c) =>
    SHOWCASE_SLUGS.map((slug) => ({ city: c.slug, product: slug })),
  );
}

function load(citySlug: string, productSlug: string) {
  const city = getCity(citySlug);
  if (!city) return null;
  const compound = researchCompounds.find((c) => c.slug === productSlug);
  if (!compound) return null;
  // Shaped like the row this used to load, so the page body below is unchanged
  // except where it printed a price.
  const product = {
    slug: compound.slug,
    name: compound.name,
    description: compound.description,
    category: { name: compound.category },
  };
  return { city, product };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug, product: productSlug } = await params;
  const data = await load(citySlug, productSlug);
  if (!data) return {};
  const { city, product } = data;
  const title = `Buy ${product.name} Research Peptide in ${city.name}, ${city.stateAbbr} | ReVia Life`;
  const description = `${product.name} research peptide for researchers in ${city.name}, ${city.state} — third-party COA tested, fast shipping. Research use only. ${product.category.name} compound from ReVia Life.`;
  const url = `${SITE}/locations/${city.slug}/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function CityProductPage({ params }: PageProps) {
  const { city: citySlug, product: productSlug } = await params;
  const data = await load(citySlug, productSlug);
  if (!data) return notFound();
  const { city, product } = data;

  const image = `${SITE}${getProductImage(product.slug, null)}`;
  const copy = getCityProductCopy(city.slug, product.slug);
  const context = getCityProductContext(city.slug, product.slug);

  const intro =
    copy.intro ??
    `Researchers in ${city.name} and across ${city.region === "Florida" ? "Florida" : `the ${city.stateAbbr} area`} source ${product.name} through ReVia Life. Every batch ships with a third-party certificate of analysis and is intended strictly for laboratory and research use. ReVia ships ${product.name} to ${city.name}, ${[...city.nearbyAreas].slice(0, 3).join(", ")}, and the surrounding ${city.state} region.`;

  const faq =
    copy.faq ??
    [
      {
        q: `Can I get ${product.name} research peptide shipped to ${city.name}?`,
        a: `Yes. ReVia Life ships ${product.name} to ${city.name}, ${city.state} and nearby areas including ${city.nearbyAreas.slice(0, 3).join(", ")}. Orders are fulfilled for research use only.`,
      },
      {
        q: `Is ${product.name} from ReVia third-party tested?`,
        a: `Every ReVia ${product.name} lot ships with an independent certificate of analysis (COA) verifying identity and purity. COAs are available on request.`,
      },
      {
        q: `What is ${product.name} classified as?`,
        a: `${product.name} is a ${product.category.name.toLowerCase()} research compound supplied strictly for laboratory and research purposes. It is not intended for human or veterinary use.`,
      },
    ];

  // Internal-link mesh: other products available in this city (same category
  // first), and this product across other cities in the region. Turns the
  // 1,800+ geo pages into a crawlable network instead of isolated leaves —
  // the single biggest lever for programmatic-SEO health.
  const siblings = researchCompounds
    .filter((c) => c.slug !== product.slug)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      featured: (SHOWCASE_SLUGS as readonly string[]).includes(c.slug),
      category: { name: c.category },
    }));
  const sameCategory = siblings.filter((s) => s.category?.name === product.category.name);
  const otherCategory = siblings.filter((s) => s.category?.name !== product.category.name);
  const relatedProducts = [
    ...sameCategory,
    ...otherCategory.filter((o) => o.featured),
    ...otherCategory,
  ]
    .filter((s, i, a) => a.findIndex((x) => x.slug === s.slug) === i)
    .slice(0, 8)
    .map((s) => ({ slug: s.slug, name: s.name, categoryName: s.category?.name ?? "" }));

  const relatedCities = [
    ...CITIES.filter((c) => c.slug !== city.slug && c.region === city.region),
    ...CITIES.filter((c) => c.slug !== city.slug && c.region !== city.region),
  ].slice(0, 8);

  const breadcrumb = [
    { name: "Home", url: SITE },
    { name: "Locations", url: `${SITE}/locations` },
    { name: city.name, url: `${SITE}/locations/${city.slug}` },
    { name: product.name, url: `${SITE}/locations/${city.slug}/${product.slug}` },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — Research Peptide (${city.name}, ${city.stateAbbr})`,
    description: product.description ?? intro,
    category: product.category.name,
    image,
    brand: { "@type": "Brand", name: "ReVia Life" },
    // No `offers`. It was an AggregateOffer with a lowPrice pointing at
    // /shop/:slug — structured data telling Google this site sells at a price,
    // on a site that sells nothing and no longer has a /shop.
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      <BreadcrumbSchema items={breadcrumb} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-800">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/locations" className="hover:text-neutral-800">Locations</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/locations/${city.slug}`} className="hover:text-neutral-800">{city.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">{product.name}</span>
      </nav>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        {product.category.name} · {city.name}, {city.stateAbbr}
      </p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
        Buy {product.name} Research Peptide in {city.name}, {city.stateAbbr}
      </h1>

      <p className="mt-5 text-[15px] leading-relaxed text-neutral-700">{intro}</p>

      {/* Availability, from the provider's live catalogue. Replaces a "From
          $X — Order at i2b" panel: revialife publishes no price, and the link
          only appears for a compound i2b actually stocks. */}
      <div className="mt-7">
        <I2bAvailability
          researchSlug={product.slug}
          compoundName={product.name}
          placement="location"
        />
      </div>

      {/* Overview */}
      {product.description && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">About {product.name}</h2>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-700">
            {product.description}
          </p>
        </section>
      )}

      {/* Unique per-city research context — kills cross-city duplication */}
      {context && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">
            {product.name} research in {city.name}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">{context}</p>
        </section>
      )}

      {/* Local framing */}
      <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold text-neutral-900">
          {product.name} research peptides shipped to {city.name}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">
          ReVia Life supplies {product.name} to research customers throughout the {city.name} metro —
          including {city.nearbyAreas.join(", ")} — as part of our {city.region} coverage. {city.angle}.
          Orders ship quickly with tracking, and every order is intended strictly for research use.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-neutral-900">
          {product.name} in {city.name} — FAQ
        </h2>
        <div className="mt-4 space-y-4">
          {faq.map((f) => (
            <div key={f.q} className="rounded-xl border border-neutral-200 p-4">
              <p className="font-semibold text-neutral-900">{f.q}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-neutral-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Other research peptides in this city — internal mesh */}
      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">
            Other research peptides available in {city.name}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/locations/${city.slug}/${rp.slug}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 hover:bg-neutral-50"
              >
                <span className="text-[15px] font-medium text-neutral-800">{rp.name}</span>
                <span className="ml-3 shrink-0 text-xs text-neutral-500">{rp.categoryName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Same product across other cities in the region — geo cluster mesh */}
      {relatedCities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-neutral-900">
            Buy {product.name} in other {city.region} cities
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {relatedCities.map((rc) => (
              <Link
                key={rc.slug}
                href={`/locations/${rc.slug}/${product.slug}`}
                className="rounded-full border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
              >
                {product.name} in {rc.name}, {rc.stateAbbr}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <section className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/shop/${product.slug}`} className="rounded-full border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
          {product.name} product page
        </Link>
        <Link href={`/locations/${city.slug}`} className="rounded-full border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
          All research peptides in {city.name}
        </Link>
        <Link href="/shop" className="rounded-full border border-neutral-300 px-4 py-2 hover:bg-neutral-50">
          Full catalog
        </Link>
      </section>

      <p className="mt-10 border-t border-neutral-200 pt-6 text-xs leading-relaxed text-neutral-400">
        For research use only. Not for human or veterinary use. The information on this page is provided
        for educational and research purposes and does not constitute medical advice.
      </p>
    </main>
  );
}
