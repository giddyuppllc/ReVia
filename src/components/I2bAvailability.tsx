import { ArrowUpRight } from "lucide-react";

import { getI2bCatalogue } from "@/lib/i2b-catalogue";
import { i2bSlugFor } from "@/lib/i2b-aliases";
import { D2C, PARTNER_LINK_PROPS } from "@/lib/partner";

/**
 * Where to obtain a compound, when the provider actually carries it.
 *
 * ReViaLife sells nothing. This is the one control that answers "and where do I
 * get it, then", and it answers it from i2b's live catalogue rather than from a
 * list committed here — see `src/lib/i2b-catalogue.ts` for why a committed list
 * is guaranteed to rot under the way stock is actually decided.
 *
 * ## A server component, and it has to be
 *
 * i2b's `/api/catalogue` sets no CORS headers, deliberately, so it can only be
 * read server-to-server. A client component could not read live state at all —
 * which is the reason the vendored `Handoff.tsx` from the i2b repo was not used
 * here, along with its second environment variable for a destination
 * `src/lib/partner.ts` already owns.
 *
 * ## Three states, and the quiet one is the important one
 *
 *   catalogue unreachable  → render NOTHING
 *   reachable, no match    → say it plainly, no link
 *   reachable, match       → link to the product
 *
 * The first is the safety property. "i2b does not stock this" is a claim about
 * another company's inventory, and it cannot be made on the strength of a
 * request that never arrived. When the catalogue cannot be read the page simply
 * carries no availability note — the monograph is the point of the page, and it
 * is complete without one.
 *
 * ## No price, ever
 *
 * Not enforced here so much as made impossible: the feed this reads carries no
 * prices by design, so there is nothing to leak. The only figure that can reach
 * the page is a label size like "5mg".
 */

/** i2b's own words for its role. Kept identical to `legal.ts` in that repo. */
const ROLE = "the exclusive research provider for this catalogue";

export default async function I2bAvailability({
  researchSlug,
  compoundName,
  placement = "monograph",
}: {
  /** The compound's slug as ReViaLife knows it. */
  researchSlug: string;
  /** For the link's accessible name, so it is not a bare "i2b". */
  compoundName: string;
  /** Appended to the outbound URL so i2b can see which surface sent the reader. */
  placement?: "monograph" | "location";
}) {
  const catalogue = await getI2bCatalogue();

  // Unreachable. Say nothing at all — see the header.
  if (catalogue === null) return null;

  const wanted = i2bSlugFor(researchSlug);
  const match = catalogue.find((p) => p.slug === wanted) ?? null;

  return (
    <aside className="mt-10 rounded-2xl border border-[#3E97CE]/25 bg-[#3E97CE]/[0.04] p-5 sm:p-6">
      <p className="text-sm leading-relaxed text-stone-700">
        ReVia Life does not sell compounds. i2b Health is {ROLE}.
      </p>

      {match ? (
        <>
          <a
            href={`${D2C.origin}/shop/${match.slug}?src=revialife.${placement}`}
            {...PARTNER_LINK_PROPS}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-[#3E97CE] bg-[#3E97CE] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-[#3585B8] hover:bg-[#3585B8] active:scale-[0.97]"
          >
            View {compoundName} at i2b Health
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only"> (opens i2b Health in a new tab)</span>
          </a>
          {match.sizes.length > 0 && (
            <p className="mt-2 text-xs text-stone-500">
              Available in {match.sizes.join(", ")}.
            </p>
          )}
        </>
      ) : (
        // Reachable and genuinely absent. A statement of fact with no link is
        // the honest answer; a link to the catalogue front would be a guess
        // dressed as an answer.
        <p className="mt-3 text-sm text-stone-600">
          {compoundName} is not currently among the compounds i2b carries.
        </p>
      )}
    </aside>
  );
}
