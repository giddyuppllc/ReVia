import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
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
  const description = `Buy research peptides in ${city.name}, ${city.state} — GLP-1 compounds, recovery, longevity, and cognitive peptides, third-party COA tested and shipped fast. Research use only.`;
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

  const products = await prisma.product
    .findMany({
      where: { active: true },
      include: { category: true, variants: { select: { price: true } } },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    })
    .catch(() => []);

  const copy = getCityCopy(city.slug);
  const intro =
    copy.intro ??
    `ReVia Life supplies research-grade peptides to researchers and labs in ${city.name}, ${city.state}. ${city.angle} — and ReVia ships the full catalog to ${city.name} and nearby areas including ${city.nearbyAreas.join(", ")}. Every compound is third-party COA tested and intended strictly for research use.`;

  // Group by category for a scannable, non-thin layout.
  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const k = p.category.name;
    if (!byCategory.has(k)) byCategory.set(k, []);
    byCategory.get(k)!.push(p);
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <JsonLd data={itemListSchema} />
      <BreadcrumbSchema items={breadcrumb} />

      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-800">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/locations" className="hover:text-neutral-800">Locations</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">{city.name}</span>
      </nav>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        {city.region} · {city.stateAbbr}
      </p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
        Research Peptides in {city.name}, {city.stateAbbr}
      </h1>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-700">{intro}</p>

      <div className="mt-7 flex flex-wrap gap-3 text-sm">
        <Link href="/shop" className="rounded-full bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800">
          Shop all peptides
        </Link>
        <Link href="/stacks" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:bg-neutral-50">
          ReVia stacks
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-500">Catalog loading — check back shortly.</p>
      ) : (
        <div className="mt-10 space-y-10">
          {Array.from(byCategory.entries()).map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-lg font-bold text-neutral-900">
                {cat} in {city.name}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => {
                  const prices = p.variants.map((v) => v.price).filter((x) => x > 0);
                  const min = prices.length ? Math.min(...prices) : 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/locations/${city.slug}/${p.slug}`}
                      className="rounded-xl border border-neutral-200 p-4 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40"
                    >
                      <p className="font-semibold text-neutral-900">{p.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {min > 0 ? `From $${(min / 100).toFixed(2)} · ` : ""}Research use only
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-12 border-t border-neutral-200 pt-6 text-xs leading-relaxed text-neutral-400">
        For research use only. Not for human or veterinary use. ReVia Life targets local search intent in{" "}
        {city.name}; products ship nationwide for laboratory and research purposes.
      </p>
    </main>
  );
}
