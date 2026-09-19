import type { Metadata } from "next";
import Link from "next/link";
import { REVIA_NETWORK, PARTNER_LINK_PROPS, D2C } from "@/lib/partner";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * The expanded map of the group.
 *
 * The home page carries a directory of the same six properties; this is where
 * the footer link on every page lands, and it answers the question the
 * directory cannot fit: not only who does what, but why they are separate
 * companies and separate sites rather than sections of one.
 *
 * That separation is the substance of ReVia's position, not an org chart. A
 * peptide sold beside a syringe reads as intended for human use; a trade price
 * shown to an individual is a different transaction under different rules; and
 * a site that publishes the record cannot also be the site that takes the
 * order. Each split has a reason, and the reasons are what this page prints.
 */

export const metadata: Metadata = {
  title: "The ReVia group | ReVia",
  description:
    "Six properties, one standard. Who each ReVia site is for, and why they are separate rather than sections of one.",
  alternates: { canonical: "https://revialife.com/network" },
};

/** Why each property stands apart. Keyed by the id in REVIA_NETWORK. */
const WHY_SEPARATE: Record<string, string> = {
  i2b:
    "A separate company, not a storefront of this one. It sets its own prices and its own terms, and it is the only ReVia property that will sell a single unit to an individual researcher.",
  wholesale:
    "Trade pricing shown to an individual is a different transaction under different rules. Every order there stops for approval before it reaches fulfilment, which is not a step a direct-purchase flow can carry.",
  providers:
    "A price list for qualified accounts is not public information. It sits behind a login and opens on a referral code from a professional, so the page cannot be found and quoted out of context.",
  cosmetics:
    "The one consumer line with no research designation. Keeping it away from the research catalogue is what stops a finished cosmetic being read as a research compound, or the reverse.",
  supply:
    "Syringes, bacteriostatic water and acetic acid, on their own site on purpose. A peptide listed beside a syringe reads as intended for human use whatever the label says.",
  well:
    "The buyer's guides — how to vet a supplier, how to read a certificate. Education that names no product keeps its value precisely because nothing on the page is for sale.",
};

export default function NetworkPage() {
  return (
    <main className="bg-[#F6F3EC]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <div className="pt-16 sm:pt-24">
          <Rise>
            <Label>The group</Label>
            <Heading className="mt-4 max-w-[18ch] text-[2.125rem] sm:text-[2.875rem]">
              One standard, several doors.
            </Heading>
            <p className="mt-6 max-w-[62ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              ReVia is not one site with several sections. It is a group of
              properties that answer to different audiences under different
              rules, and the separations are deliberate. This page is the map,
              and the reason for each line on it.
            </p>
            <p className="mt-4 max-w-[62ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              revialife.com is the one you are on. It publishes the record — the
              statements made in Washington, what the certificates say, and what
              we think about the news — and it sells nothing at all.
            </p>
          </Rise>
        </div>

        <div className="mt-14 sm:mt-20">
          <DrawRule />
          <ul>
            {REVIA_NETWORK.map((site, i) => (
              <li key={site.id}>
                <Rise delay={0.04 * i}>
                  <div className="grid gap-4 border-b border-[#3D3229]/12 py-9 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-12">
                    <div>
                      <Label>{site.audience}</Label>
                      <p className="mt-3 font-serif text-[1.3125rem] leading-tight text-[#3D3229]">
                        {site.name}
                      </p>
                      {site.url ? (
                        <a
                          {...PARTNER_LINK_PROPS}
                          href={site.url}
                          className="mt-3 inline-flex items-baseline gap-2 font-sans text-[0.8125rem] font-medium text-[#3D3229]"
                        >
                          <span className="border-b border-[#A38569]/50 pb-0.5 transition hover:border-[#A38569]">
                            {site.url.replace(/^https?:\/\//, "")}
                          </span>
                          <span className="text-[#A38569]">&rarr;</span>
                        </a>
                      ) : (
                        // Listed without a link rather than hidden. A gap in
                        // the group is information about the group.
                        <p className="mt-3 font-sans text-[0.8125rem] text-[#3D3229]/45">
                          No public address yet.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="max-w-[58ch] font-sans text-[0.9062rem] leading-[1.75] text-[#3D3229]/75">
                        {site.tagline}
                      </p>
                      {WHY_SEPARATE[site.id] && (
                        <p className="mt-3 max-w-[58ch] font-sans text-[0.8438rem] leading-[1.75] text-[#3D3229]/55">
                          <span className="font-medium text-[#3D3229]/75">
                            Why it stands apart.{" "}
                          </span>
                          {WHY_SEPARATE[site.id]}
                        </p>
                      )}
                    </div>
                  </div>
                </Rise>
              </li>
            ))}
          </ul>
        </div>

        <Rise>
          <div className="py-14 sm:py-20">
            <p className="max-w-[62ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              If you are looking for a compound rather than the structure, the
              monographs are here and {D2C.name} is where they are obtained.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 font-sans text-[0.8125rem] font-medium text-[#3D3229]">
              <Link href="/research" className="border-b border-[#A38569]/50 pb-0.5">
                Every compound we document &rarr;
              </Link>
              <Link href="/washington" className="border-b border-[#A38569]/50 pb-0.5">
                The federal record &rarr;
              </Link>
            </div>
          </div>
        </Rise>
      </div>
    </main>
  );
}
