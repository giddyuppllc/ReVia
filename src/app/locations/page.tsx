import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { prisma } from "@/lib/prisma";
import { CITIES } from "@/data/cities";

const SITE = "https://revialife.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Research Peptides by Location — Florida & East Coast | ReVia Life",
  description:
    "Find research peptides in your metro. ReVia Life ships COA-tested research compounds to 25 major Florida and East Coast cities. Research use only.",
  alternates: { canonical: `${SITE}/locations` },
};

export default async function LocationsIndexPage() {
  const florida = CITIES.filter((c) => c.region === "Florida");
  const eastCoast = CITIES.filter((c) => c.region === "East Coast");

  // Most-searched products — gives the index outbound links to the /shop money
  // pages so crawl equity flows down to them, not only to the city hubs.
  const topProducts = await prisma.product
    .findMany({
      where: { active: true },
      select: { slug: true, name: true, category: { select: { name: true } } },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
      take: 12,
    })
    .catch(() => [] as { slug: string; name: string; category: { name: string } | null }[]);

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
      <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/locations/${c.slug}`}
            className="rounded-xl border border-neutral-200 p-4 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40"
          >
            <p className="font-semibold text-neutral-900">{c.name}</p>
            <p className="text-xs text-neutral-500">{c.stateAbbr}</p>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <JsonLd data={itemListSchema} />
      <BreadcrumbSchema items={breadcrumb} />

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Locations</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
        Research Peptides by Location
      </h1>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-700">
        ReVia Life ships COA-tested research peptides across Florida and the East Coast. Choose your
        metro to see the catalog and local shipping details. Every compound is third-party tested and
        intended strictly for research use.
      </p>

      <Section title="Florida" items={florida} />
      <Section title="East Coast" items={eastCoast} />

      {topProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-neutral-900">Most-searched research peptides</h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600">
            Popular compounds researchers source through ReVia Life — available across all {CITIES.length} metros.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40"
              >
                <span className="font-medium text-neutral-900">{p.name}</span>
                {p.category?.name && (
                  <span className="ml-3 shrink-0 text-xs text-neutral-500">{p.category.name}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 border-t border-neutral-200 pt-6 text-xs leading-relaxed text-neutral-400">
        For research use only. Not for human or veterinary use.
      </p>
    </main>
  );
}
