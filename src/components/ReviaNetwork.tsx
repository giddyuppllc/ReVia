import { ArrowUpRight } from "lucide-react";
import PartnerShopButton from "@/components/PartnerShopButton";
import {
  B2B,
  D2C,
  PARTNER_LINK_PROPS,
  REVIA_NETWORK,
  type NetworkSite,
} from "@/lib/partner";

/* ------------------------------------------------------------------ */
/*  The ReVia network                                                  */
/*                                                                     */
/*  revialife.com is the portal, so this is the map: every sibling     */
/*  site, who it serves, and a way in.                                 */
/*                                                                     */
/*  The two that take orders lead, because they are what most          */
/*  visitors are actually looking for, and they are kept visibly       */
/*  apart — Wholesale does no D2C, so a researcher sent there has      */
/*  wasted the trip. The rest follow as a quieter row.                 */
/*                                                                     */
/*  A site with no public address yet renders unlinked rather than     */
/*  hidden: the visitor still learns it exists, and never meets a      */
/*  dead link.                                                         */
/* ------------------------------------------------------------------ */

function SecondaryCard({ site }: { site: NetworkSite }) {
  const shell =
    "group flex h-full flex-col rounded-2xl border border-sky-200/60 bg-white/60 p-6 transition";
  const body = (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-600">
        {site.audience}
      </p>
      <h3 className="mt-2 flex items-center gap-1.5 text-base font-semibold text-stone-800">
        {site.name}
        {site.url && (
          <ArrowUpRight
            className="h-3.5 w-3.5 shrink-0 text-sky-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{site.tagline}</p>
      {!site.url && <p className="mt-3 text-xs font-medium text-stone-400">Coming soon</p>}
    </>
  );

  if (!site.url) return <div className={shell}>{body}</div>;

  return (
    <a
      href={site.url}
      {...PARTNER_LINK_PROPS}
      className={`${shell} hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg hover:shadow-stone-300/25`}
    >
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function ReviaNetwork() {
  const secondary = REVIA_NETWORK.filter((s) => s.id !== "i2b" && s.id !== "wholesale");

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-600">
            The ReVia Network
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            One family of sites, each with a job.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
            ReVia Life is where the research lives. Ordering, trade supply, education and
            the bench each have a home of their own.
          </p>
        </div>

        {/* The two that take orders */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Researchers → i2b */}
          <div className="flex flex-col rounded-3xl border border-[#3E97CE]/25 bg-gradient-to-br from-white to-sky-50/70 p-8 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2f7ba8]">
              For researchers
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-800">
              Order from {D2C.name}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
              Our exclusive research partner supplies researchers direct. Read a compound
              here, order it there.
            </p>
            <PartnerShopButton
              audience="d2c"
              size="md"
              variant="solid"
              className="mt-6 self-start"
            >
              Shop at {D2C.name}
            </PartnerShopButton>
          </div>

          {/* Trade → ReVia Wholesale */}
          <div className="flex flex-col rounded-3xl border border-sky-200/70 bg-white/70 p-8 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-600">
              For business &amp; brands
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-stone-800">
              Are you a business or brand?
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
              Wholesale pricing, private label and bulk supply for clinics, brands and
              distributors, through {B2B.name}.
            </p>
            <PartnerShopButton
              audience="b2b"
              size="md"
              variant="outline"
              b2bPath="wholesale"
              className="mt-6 self-start"
            >
              Click here
            </PartnerShopButton>
          </div>
        </div>

        {/* Everything else */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {secondary.map((site) => (
            <SecondaryCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </section>
  );
}
