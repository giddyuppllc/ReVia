import { REVIA_NETWORK, PARTNER_LINK_PROPS } from "@/lib/partner";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * Who does what across the group, as a directory.
 *
 * The rule this encodes is the reason it exists at all: ReVia Life sells
 * nothing, and each of the other properties serves a different audience under
 * different rules. Collapsing them into one "shop" link is how an individual
 * ends up on a trade portal and a clinic ends up on a consumer checkout — which
 * is why `src/lib/partner.ts` requires an explicit audience on every outbound
 * control and refuses a default.
 *
 * Set as a directory rather than a card grid: audience on the left in small
 * caps, the property and its remit on the right, hairline between. A card grid
 * of six sibling sites reads as a portfolio; a directory reads as a structure,
 * which is what a reader is trying to understand.
 *
 * A property with no address yet renders unlinked and says so. It is not hidden
 * — the shape of the group is the point, and a gap in it is information.
 */
export default function TheNetwork() {
  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <DrawRule />
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 sm:py-20">
          <Rise>
            <Label>The group</Label>
            <Heading className="mt-4 text-[1.625rem] sm:text-[1.9375rem]">
              Who does what in the ReVia group.
            </Heading>
            <p className="mt-5 max-w-[42ch] font-sans text-[0.9062rem] leading-[1.75] text-[#3D3229]/62">
              Each ReVia property serves a different audience under a different
              set of rules. This one publishes the record and sells nothing.
            </p>
          </Rise>

          <Rise delay={0.12}>
            <ul>
              {REVIA_NETWORK.map((site, i) => {
                const body = (
                  <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-6">
                    <Label className="sm:pt-1">{site.audience}</Label>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-[1.25rem] font-light text-[#3D3229] transition group-hover:text-[#A38569]">
                          {site.name}
                        </span>
                        {site.preview && (
                          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-[#3D3229]/32">
                            preview
                          </span>
                        )}
                        {!site.url && (
                          <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-[#3D3229]/32">
                            coming soon
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 max-w-[52ch] font-sans text-[0.8438rem] leading-[1.7] text-[#3D3229]/58">
                        {site.tagline}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={site.id} className={i > 0 ? "border-t border-[#3D3229]/12" : ""}>
                    {site.url ? (
                      <a href={site.url} {...PARTNER_LINK_PROPS} className="group block">
                        {body}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <div className="group block opacity-70">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Rise>
        </div>
      </div>
    </section>
  );
}
