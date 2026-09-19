import Link from "next/link";

import { HEARING, STATEMENT_COUNT } from "@/data/federal-record";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * Why ReVia exists, and the four things it can show for it.
 *
 * Copy from docs/BRAND-CONTEXT.md §1, which traces every line of it to Mike
 * Stone's own words on the FDA record rather than to a brand workshop. It is
 * published close to as written; the only liberties are paragraph breaks.
 *
 * The four bands beneath are the brief's, in its order, and each is a thing a
 * reader can go and check — a laboratory report, a verification code, a webcast,
 * a set of sibling sites. None of them is a badge.
 */

const BANDS = [
  {
    n: "01",
    title: "Finished and tested in the United States",
    body: "Every lot goes to an independent U.S. lab before it ships.",
  },
  {
    n: "02",
    title: "One certificate per lot",
    body:
      "Identity, quantity, purity, and heavy metals on one page, with a code you can type into the lab's site to pull up the same certificate.",
  },
  {
    n: "03",
    title: "On the record at the FDA",
    body: `Five statements at White Oak, ${HEARING.dates}. Full transcripts, with the FDA's own webcast timecodes.`,
  },
  {
    n: "04",
    title: "One standard across the group",
    body:
      "i2b Health, ReVia Wholesale, and ReVia Providers all ship the same lots with the same certificates.",
  },
];

export default function Positioning() {
  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <DrawRule />
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20 sm:py-20">
          <Rise>
            <Label>Why ReVia exists</Label>
            <Heading className="mt-4 text-[1.625rem] sm:text-[1.9375rem]">
              It started with a patient who couldn&rsquo;t find a supplier he trusted.
            </Heading>
          </Rise>

          <Rise delay={0.1}>
            <div className="max-w-[62ch] space-y-5 font-sans text-[0.9375rem] leading-[1.85] text-[#3D3229]/78">
              <p>
                In 2019, our founder, Mike Stone, was diagnosed with a
                degenerative neurological disease. Conventional treatment
                didn&rsquo;t work. He went from 180 pounds to 125 and was
                bedridden. One of his doctors suggested he look into peptides.
              </p>
              <p>
                What he found was an industry that couldn&rsquo;t tell him what
                was in the vial. Certificates were fake. Vials were underdosed.
                One order made him sick, and the same compound from another
                vendor didn&rsquo;t.
              </p>
              <p>
                So he built the supplier he&rsquo;d been looking for. Every lot
                is finished and tested in the United States. Every lot ships
                with a certificate you can verify with the lab yourself. And
                nothing goes on a page that the paperwork can&rsquo;t back up.
              </p>
              <p>
                In July 2026, Mike took that case to the FDA&rsquo;s Pharmacy
                Compounding Advisory Committee. He spoke five times in two days
                and said what most suppliers won&rsquo;t: this market is gray,
                he&rsquo;s in it, and the way out runs through a licensed
                physician and a U.S. manufacturer.
              </p>
              <p className="text-[#3D3229]">
                This site is where we keep all of that on the record. Nothing on
                it is for sale.
              </p>
            </div>

            <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2">
              {BANDS.map((b, i) => (
                <li
                  key={b.n}
                  className={`border-t border-[#3D3229]/12 py-5 ${
                    i % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:border-l-[#3D3229]/12 sm:pl-8"
                  }`}
                >
                  <span className="font-mono text-[0.6875rem] text-[#A38569]">{b.n}</span>
                  <h3 className="mt-1.5 font-display text-[1.125rem] font-light leading-snug text-[#3D3229]">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 max-w-[44ch] font-sans text-[0.8125rem] leading-[1.7] text-[#3D3229]/58">
                    {b.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/washington"
                className="group inline-flex items-baseline gap-2 font-sans text-[0.8125rem] font-medium text-[#3D3229]"
              >
                <span className="border-b border-[#A38569]/50 pb-0.5 transition group-hover:border-[#A38569]">
                  Read the {STATEMENT_COUNT} statements
                </span>
                <span className="text-[#A38569] transition group-hover:translate-x-0.5">&rarr;</span>
              </Link>
              <Link
                href="/why-us"
                className="font-sans text-[0.8125rem] text-[#3D3229]/50 underline decoration-[#3D3229]/20 underline-offset-4 transition hover:text-[#3D3229]"
              >
                See how a lot is tested
              </Link>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/**
 * The closing line.
 *
 * "Know More." is Mike's own principle, from his own email. The brief is
 * specific that it runs as the last line of the home page and nowhere else — a
 * principle repeated on every page is a slogan, and this one is worth more than
 * that.
 */
export function KnowMore() {
  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <DrawRule />
        <Rise>
          <p className="py-16 text-center font-display text-[1.875rem] font-light tracking-[-0.01em] text-[#3D3229] sm:py-24 sm:text-[2.625rem]">
            Know More.
          </p>
        </Rise>
      </div>
    </section>
  );
}
