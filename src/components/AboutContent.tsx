import Link from "next/link";

import { STATEMENT_COUNT } from "@/data/federal-record";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * About ReVia.
 *
 * Copy from docs/BRAND-CONTEXT.md §3, published close to as written. It replaces
 * a page that opened "Built for People Who Expect More" and described "a
 * category that often feels crowded with noise" — wellness-brand filler, with
 * headings for Leadership and Why ReVia Exists carrying nothing underneath them.
 *
 * Four blocks, in the brief's order: why it exists, who runs it, the standard,
 * and how the site is paid for.
 *
 * ## Three things deliberately absent
 *
 *   * A founding year. The site said 2024, the intake form says 2025, and the
 *     active company is a 2026 filing. Three sources, no agreement, so no year.
 *   * Charlie Stone by name. The brief says to name him only with Mike's
 *     approval, so the page says what he does without saying who he is.
 *   * Any figure. The brief notes a sibling page carries a hand-typed "10
 *     batches on record" that will drift; nothing here states a count that is
 *     not derived.
 *
 * The funding paragraph is last in the source but is placed high on the page:
 * the conversion plan treats it as a disclosure, and a disclosure below the fold
 * is a disclosure nobody read.
 */
export default function AboutContent() {
  return (
    <div className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        {/* ── masthead ── */}
        <Rise>
          <div className="pt-12 sm:pt-16">
            <Label>About</Label>
            <Heading as="h1" className="mt-4 max-w-[18ch] text-[2rem] sm:text-[2.875rem]">
              I built the supplier I couldn&rsquo;t find.
            </Heading>
          </div>
        </Rise>

        <DrawRule className="mt-10" />

        {/* ── the disclosure, high ── */}
        <Rise delay={0.08}>
          <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20">
            <Label className="lg:pt-1">How this site is paid for</Label>
            <p className="max-w-[62ch] font-sans text-[0.9375rem] leading-[1.85] text-[#3D3229]/78">
              ReVia LLC publishes this site. ReVia LLC also supplies the
              compounds sold by i2b Health and ReVia Wholesale. I&rsquo;m telling
              you that up front because a resource that hides who&rsquo;s paying
              for it isn&rsquo;t worth much. This site takes no orders and no
              commissions, and every company in the group is held to the
              standard below.
            </p>
          </div>
        </Rise>

        {/* ── the blocks ── */}
        {[
          {
            label: "Why ReVia exists",
            body: (
              <>
                <p>
                  I started ReVia because I needed a supplier I could trust and
                  couldn&rsquo;t find one.
                </p>
                <p>
                  In 2019 I was diagnosed with a degenerative neurological
                  disease. Before that I was an entrepreneur and an Ironman
                  triathlete. Conventional medicine didn&rsquo;t work. I wasted
                  from 180 pounds to 125 and ended up bedridden. One of my doctors
                  suggested I look into peptides.
                </p>
                <p>
                  The market I found sold fakes, underdosed vials, and
                  certificates that were just decoration. I got scammed buying
                  overseas. One vial made me sick, and the same compound from
                  another vendor didn&rsquo;t. I had no way to know what I was
                  putting in my body, and I decided that wasn&rsquo;t acceptable
                  for me or for my family.
                </p>
                <p>
                  So I set a standard for anything I&rsquo;d put in my own body,
                  found a U.S. manufacturer I could walk into and shake hands
                  with, and started supplying it to other people. In July 2026 I
                  said all of this to the FDA&rsquo;s Pharmacy Compounding
                  Advisory Committee, on the record, five times.
                </p>
              </>
            ),
          },
          {
            label: "Who runs it",
            body: (
              <p>
                ReVia is a family business in Fort Myers, Florida. I run the
                professional and wholesale side. My son runs i2b Health, the
                research brand that supplies individual researchers. My name is
                on the FDA docket.
              </p>
            ),
          },
          {
            label: "The standard",
            body: (
              <p>
                Every lot we supply is finished and tested in the United States.
                An independent lab tests each lot and issues a certificate that
                names the lot, the tests, the limits, and the results, with a
                code you can use to verify it at the lab. If a lot fails, it
                doesn&rsquo;t ship. Nothing on this site describes a human use, a
                dose, or a result. These are research materials, and we only
                publish what the paperwork supports.
              </p>
            ),
          },
        ].map((block, i) => (
          <Rise key={block.label} delay={0.06 * i}>
            <div className="grid gap-8 border-t border-[#3D3229]/12 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20">
              <Label className="lg:pt-1">{block.label}</Label>
              <div className="max-w-[62ch] space-y-5 font-sans text-[0.9375rem] leading-[1.85] text-[#3D3229]/78">
                {block.body}
              </div>
            </div>
          </Rise>
        ))}

        {/* ── byline ── */}
        <Rise>
          <div className="border-t border-[#3D3229]/12 py-10">
            <p className="font-sans text-[0.8125rem] text-[#3D3229]/55">
              <span className="font-medium text-[#3D3229]">Mike Stone</span> ·
              Founder, ReVia
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6">
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
                How a lot is tested
              </Link>
            </div>
          </div>
        </Rise>
      </div>
    </div>
  );
}
