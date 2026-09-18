import Link from "next/link";

import { researchCompounds, SHOWCASE_SLUGS } from "@/data/research-compounds";

/**
 * Three compounds on the home page, as reading rather than as stock.
 *
 * Replaces `FeaturedProducts`, which read `prisma.product` and rendered a price
 * under each card. Both halves of that are gone: ReVia Life publishes no price,
 * and it no longer has a database to ask what is featured.
 *
 * Each card goes to the monograph, not to a product page — which is the whole
 * change in one link. Where to obtain a compound is answered at the foot of the
 * monograph, from the provider's live catalogue, and only when he actually
 * stocks it.
 */
export default function CompoundShowcase() {
  const picks = SHOWCASE_SLUGS.map((slug) =>
    researchCompounds.find((c) => c.slug === slug),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (picks.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {picks.map((c) => (
        <Link
          key={c.slug}
          href={`/research/${c.slug}`}
          className="group rounded-2xl border border-[#E2DCD0] bg-white/70 p-6 transition hover:border-[#A38569]/60 hover:bg-white"
        >
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A38569]">
            {c.type}
          </p>
          <h3 className="mt-2 font-serif text-xl text-[#3D3229]">{c.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#5b5048]">
            {c.description}
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[#A38569] group-hover:underline">
            Read the research →
          </span>
        </Link>
      ))}
    </div>
  );
}
