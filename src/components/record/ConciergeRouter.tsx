import { B2B, D2C, PARTNER_LINK_PROPS, wellUrl } from "@/lib/partner";
import { DrawRule, Label, Rise, Sheet } from "@/components/record/primitives";

/**
 * The three doors, directly under the menu.
 *
 * A reader arriving on revialife.com is one of a handful of people, and the
 * property that serves each of them is a different company on a different
 * domain. The directory that says so (`TheNetwork`) sits six screens down the
 * page, behind the testimony and the certificate — correct for a reader who
 * came to read the argument, useless for one who already knows what they are
 * and just wants out of here. This strip is for the second reader.
 *
 * ## Why it is a strip and not a hero
 *
 * The testimony is still the page's opening statement; this must not displace
 * it. So: one label line, three compact panels, a hairline, and the masthead
 * begins. It fits above the fold on a phone alongside the top of the hero
 * rather than instead of it.
 *
 * ## Why there is no interstitial
 *
 * ReViaWell puts up a modal on its own shop control that says the reader is
 * being redirected and then navigates on a three-second timer, and the question
 * was whether to copy it here. Three arguments against, and none for:
 *
 *   - a timer that navigates is a decision taken away from someone who has
 *     already made one. The click WAS the choice;
 *   - a countdown cannot be read by everybody in three seconds, and pausing it
 *     for reduced-motion or screen-reader users means writing two behaviours
 *     and hoping the right one runs;
 *   - a plain link is announced correctly by assistive technology, works with
 *     middle-click and open-in-new-tab, and is honest about its destination
 *     before it is followed rather than after.
 *
 * So each panel is an anchor, the domain it leads to is printed on its face,
 * and nothing on this page navigates on its own. If an interstitial is wanted
 * later it has to be dismissible and must never move a reader who did not ask
 * to be moved.
 *
 * ## The cards
 *
 * `Sheet` rather than the hairline rows used elsewhere. The house rule is
 * "hairlines, never boxes", with cards allowed where something genuinely is a
 * discrete object — and three separate companies are about as discrete as
 * objects get. It is also the pattern the owner pointed at.
 */

interface Route {
  id: string;
  /** Who the reader is. The thing they scan for. */
  audience: string;
  /** What is at the other end, in one line. No claim beyond what the group publishes. */
  body: string;
  href: string;
  /** The destination company, named for the screen-reader leaving notice. */
  site: string;
}

const ROUTES: Route[] = [
  {
    id: "researcher",
    audience: "Researcher",
    body: "For an individual researcher. Opens i2b Health, our exclusive research supplier.",
    // d2cUrl() would fall back to /contact if i2b ever went dark; this strip is
    // a directory of companies, so a panel with no company behind it should not
    // render at all. Filtered below rather than silently pointed inward.
    href: D2C.origin ?? "",
    site: "i2b Health",
  },
  {
    id: "wholesale",
    audience: "Wholesale",
    body: "For businesses and brands. Opens ReVia Wholesale, for trade accounts, bulk and private label.",
    href: B2B.origin,
    site: B2B.name,
  },
  {
    id: "practitioner",
    audience: "Practitioner",
    body: "For clinics and prescribers. Opens the ReViaWell practitioner program.",
    href: wellUrl("practitioner"),
    site: "ReViaWell",
  },
];

/** The bare domain, printed on the card so the destination is visible unclicked. */
function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function ConciergeRouter() {
  const routes = ROUTES.filter((r) => r.href);
  if (routes.length === 0) return null;

  return (
    // Named as a region rather than opened with a heading: the page's h1 is
    // the testimony immediately below, and a h2 above it would put the document
    // outline out of order to label three links.
    <section className="bg-[#F0EDE5]" aria-label="Where to go next">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        {/* Measured, not guessed: on a 390x844 phone this strip has to leave
            the masthead and the top of the quote on screen, so the destination
            domain shares the head line with the arrow instead of taking a row
            of its own. */}
        <div className="pt-6 pb-6 sm:pt-9 sm:pb-9">
          <Rise>
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-8">
              <Label>Where to go next</Label>
              <p className="font-sans text-[0.8125rem] leading-[1.6] text-[#3D3229]/50">
                This site publishes the record. These open the ReVia property built for you.
              </p>
            </div>
          </Rise>

          <Rise delay={0.08}>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-4">
              {routes.map((r) => (
                <li key={r.id}>
                  <a href={r.href} {...PARTNER_LINK_PROPS} className="group block h-full">
                    <Sheet className="flex h-full flex-col px-4 py-3.5 transition group-hover:border-[#A38569]/45 sm:px-5 sm:py-4">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-[1.25rem] font-light leading-none text-[#3D3229] transition group-hover:text-[#A38569] sm:text-[1.375rem]">
                          {r.audience}
                        </span>
                        {/* The destination, printed unclicked. A router that
                            does not say where each door goes is asking for
                            trust it has not earned yet. */}
                        <span className="shrink-0 font-mono text-[0.6875rem] tracking-tight text-[#3D3229]/38 transition group-hover:text-[#A38569]">
                          {host(r.href)} <span aria-hidden>&#8599;</span>
                        </span>
                      </span>
                      <span className="mt-2 block font-sans text-[0.8125rem] leading-[1.65] text-[#3D3229]/58">
                        {r.body}
                      </span>
                      <span className="sr-only"> (opens {r.site} in a new tab)</span>
                    </Sheet>
                  </a>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
        <DrawRule />
      </div>
    </section>
  );
}
