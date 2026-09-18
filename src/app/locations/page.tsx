import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { researchCompounds, SHOWCASE_SLUGS } from "@/data/research-compounds";
import { CITIES } from "@/data/cities";

const SITE = "https://revialife.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Research Peptides by Location — Florida & East Coast | ReVia",
  description:
    "Research peptide monographs for 25 major Florida and East Coast metros — mechanism, published studies and certificates of analysis. Research use only.",
  alternates: { canonical: `${SITE}/locations` },
};

export default async function LocationsIndexPage() {
  const florida = CITIES.filter((c) => c.region === "Florida");
  const eastCoast = CITIES.filter((c) => c.region === "East Coast");

  // Most-searched products — gives the index outbound links to the /shop money
  // pages so crawl equity flows down to them, not only to the city hubs.
  const topProducts = researchCompounds
    .filter((c) => (SHOWCASE_SLUGS as readonly string[]).includes(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name, category: { name: c.category } }));
  const breadcrumb = [
    { name: "Home", url: SITE },
    { name: "Locations", url: `${SITE}/locations` },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ReVia Life research peptide locations",
    itemListElement: CITIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.name}, ${c.stateAbbr}`,
      url: `${SITE}/locations/${c.slug}`,
    })),
  };

  const Section = ({ title, items }: { title: string; items: typeof CITIES }) => (
    <section className="mt-10">
      <h2 className="font-display text-[21px] font-light leading-snug text-[#3D3229]">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/locations/${c.slug}`}
            className="rounded-xl border border-[#3D3229]/12 p-4 transition-colors hover:border-[#A38569] hover:bg-[#EFEAE1]/70"
          >
            <p className="font-semibold text-[#3D3229]">{c.name}</p>
            <p className="text-xs text-[#3D3229]/50">{c.stateAbbr}</p>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <JsonLd data={itemListSchema} />
      <BreadcrumbSchema items={breadcrumb} />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A38569]">Locations</p>
      <h1 className="mt-2 font-display text-[34px] font-light leading-[1.06] tracking-[-0.015em] text-[#3D3229] sm:text-[44px]">
        Research Peptides by Location
      </h1>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[#3D3229]/75">
        Research peptide monographs, written for Florida and the East Coast. Choose your metro to
        see the compounds documented there and what the published literature reports on each. Every
        ReVia-branded lot carries its own certificate of analysis, and every compound is intended
        strictly for research use.
      </p>

      <Section title="Florida" items={florida} />
      <Section title="East Coast" items={eastCoast} />

      {topProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[21px] font-light leading-snug text-[#3D3229]">Most-searched research peptides</h2>
          <p className="mt-2 max-w-3xl text-sm text-[#3D3229]/62">
            The compounds asked about most often — documented across all {CITIES.length} metros.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/research/${p.slug}`}
                className="flex items-center justify-between rounded-xl border border-[#3D3229]/12 p-4 transition-colors hover:border-[#A38569] hover:bg-[#EFEAE1]/70"
              >
                <span className="font-medium text-[#3D3229]">{p.name}</span>
                {p.category?.name && (
                  <span className="ml-3 shrink-0 text-xs text-[#3D3229]/50">{p.category.name}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 border-t border-[#3D3229]/12 pt-6 text-xs leading-relaxed text-[#3D3229]/40">
        For research use only. Not for human or veterinary use.
      </p>
    </main>
  );
}
