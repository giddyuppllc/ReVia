import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { D2C, PARTNER_LINK_PROPS, d2cUrl } from "@/lib/partner";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { researchCompounds, SHOWCASE_SLUGS } from "@/data/research-compounds";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { CITIES, getCity } from "@/data/cities";
import { getCityCopy } from "@/data/geo-copy";

// City hub: "Research Peptides in [City]". Lists the catalog with links to each
// product × city page, plus links to the live shop/stacks. Research-use-only.

const SITE = "https://revialife.com";

export const dynamic = "force-static";
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  const title = `Research Peptides in ${city.name}, ${city.stateAbbr} | ReVia Life`;
  const description = `Research peptides documented for ${city.name}, ${city.state} — GLP-1, recovery, longevity and cognitive compounds, each with its mechanism, published studies and certificate of analysis. Research use only.`;
  const url = `${SITE}/locations/${city.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function CityHubPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return notFound();

  const products = researchCompounds.map((c) => ({
    slug: c.slug,
    name: c.name,
    category: { name: c.category },
    featured: (SHOWCASE_SLUGS as readonly string[]).includes(c.slug),
  }));
  const copy = getCityCopy(city.slug);
  const intro =
    copy.intro ??
    `Researchers and labs in ${city.name}, ${city.state} work across the compounds documented here. ${city.angle} — and the same monographs cover ${city.nearbyAreas.join(", ")} and the surrounding region. Every ReVia-branded lot carries a batch-specific certificate of analysis, and every compound is intended strictly for research use.`;

  // Group by category for a scannable, non-thin layout.
  type ProductRow = (typeof products)[number];
  const byCategory = new Map<string, ProductRow[]>();
  for (const p of products) {
    const k = p.category.name;
    const arr = byCategory.get(k);
    if (arr) arr.push(p);
    else byCategory.set(k, [p]);
  }

  const breadcrumb = [
    { name: "Home", url: SITE },
    { name: "Locations", url: `${SITE}/locations` },
    { name: city.name, url: `${SITE}/locations/${city.slug}` },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Research peptides available in ${city.name}, ${city.stateAbbr}`,
    itemListElement: products.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE}/locations/${city.slug}/${p.slug}`,
    })),
  };

  // Lateral hub-to-hub mesh: link to sibling city hubs (same region first) so
  // the 25 metros interlink, not just hang off the /locations index.
  const relatedCities = [
    ...CITIES.filter((c) => c.slug !== city.slug && c.region === city.region),
    ...CITIES.filter((c) => c.slug !== city.slug && c.region !== city.region),
  ].slice(0, 8);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <JsonLd data={itemListSchema} />
      <BreadcrumbSchema items={breadcrumb} />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-[#3D3229]/50">
        <Link href="/" className="hover:text-[#3D3229]">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/locations" className="hover:text-[#3D3229]">Locations</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#3D3229]">{city.name}</span>
      </nav>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A38569]">
        {city.region} · {city.stateAbbr}
      </p>
      <h1 className="mt-2 font-display text-[2.125rem] font-light leading-[1.06] tracking-[-0.015em] text-[#3D3229] sm:text-[2.75rem]">
        Research Peptides in {city.name}, {city.stateAbbr}
      </h1>
      <p className="mt-5 max-w-3xl text-[0.9375rem] leading-relaxed text-[#3D3229]/75">{intro}</p>

      {/*
        This was a solid blue "Shop at i2b" pill — the only blue control on a
        site whose entire palette is warm, and the only place that asked for the
        sale without saying whose sale it was. It now reads the way the home
        page's handoff does: the reader is told they are leaving ReVia and where
        they are going before the link, not after clicking it.
      */}
      <div className="mt-8 border-t border-[#3D3229]/12 pt-6">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#A38569]">
          Where researchers obtain these
        </p>
        <p className="mt-3 max-w-[58ch] text-[0.875rem] leading-[1.75] text-[#3D3229]/70">
          ReVia publishes; it does not sell. Compounds are supplied by{" "}
          <strong className="font-medium text-[#3D3229]">{D2C.name}</strong>, our
          exclusive research provider &mdash; a separate company with its own
          catalog and its own terms.{" "}
          <span className="text-[#3D3229]/50">
            The link below leaves ReVia and opens {D2C.name} in a new tab.
          </span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href={d2cUrl()}
            {...(D2C.isLive ? PARTNER_LINK_PROPS : {})}
            className="inline-flex items-center gap-1.5 border border-[#3D3229]/25 px-5 py-2.5 font-medium text-[#3D3229] transition hover:border-[#A38569] hover:text-[#A38569]"
          >
            Continue to {D2C.name}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            href="/stacks"
            className="inline-flex items-center border border-transparent px-5 py-2.5 text-[#3D3229]/70 transition hover:text-[#A38569]"
          >
            What&rsquo;s a stack?
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-[#3D3229]/50">Catalog loading — check back shortly.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {Array.from(byCategory.entries()).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="font-display text-[1.3125rem] font-light leading-snug text-[#3D3229]">
                {cat} in {city.name}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/locations/${city.slug}/${p.slug}`}
                    className="rounded-xl border border-[#3D3229]/12 p-4 transition-colors hover:border-[#A38569] hover:bg-[#EFEAE1]/70"
                  >
                    <p className="font-semibold text-[#3D3229]">{p.name}</p>
                    <p className="mt-0.5 text-xs text-[#3D3229]/50">Research use only</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {relatedCities.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[1.3125rem] font-light leading-snug text-[#3D3229]">
            Research peptides in other {city.region} cities
          </h2>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {relatedCities.map((rc) => (
              <Link
                key={rc.slug}
                href={`/locations/${rc.slug}`}
                className="rounded-full border border-[#3D3229]/25 px-4 py-2 transition-colors hover:border-[#A38569] hover:bg-[#EFEAE1]/70"
              >
                {rc.name}, {rc.stateAbbr}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 border-t border-[#3D3229]/12 pt-6 text-xs leading-relaxed text-[#3D3229]/40">
        For research use only. Not for human or veterinary use. Products ship
        nationwide for laboratory and research purposes.
      </p>
    </main>
  );
}
