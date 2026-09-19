import Link from "next/link";

import { COA_EXAMPLE, COA_SPEC } from "@/lib/coa";
import { HEARING } from "@/data/federal-record";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * Why Us — written to the certificate, and linked to it.
 *
 * Copy from docs/BRAND-CONTEXT.md §5. The page it replaces opened "Not All
 * Peptides Are Created Equal" over the line "Most vendors resell unverified
 * powder from overseas factories", and its six pillars asserted cGMP
 * certification, ISO certification, FDA-registered laboratories and an API
 * origin — none of which any document in the archive supports.
 *
 * The positive case is the certificate itself. Written to that document and
 * linked to it, the page is stronger than the superlatives it replaces, and
 * every line of it survives contact with the file.
 *
 * ## The comparison, without a competitor
 *
 * Charlie asked for a comparison chart. It is built as questions a reader can
 * put to any supplier's site, with our answer in one column and theirs left
 * blank for them to fill in. No competitor is named and no row asserts what
 * anybody else fails to do — which is the constraint that got the previous
 * table deleted, when it claimed rivals' certificates were "fake or reused"
 * with nothing behind it.
 */


/** Questions a reader can check on anybody's site. Ours answered; theirs blank. */
const CHECKS = [
  "A certificate for this lot, linked from the product page",
  "A verification code that pulls the certificate from the lab's own site",
  "The lab named on the certificate",
  "Identity, quantity, purity, and metals, each with a limit and a result",
  "A chemist's signature and the test dates",
  "Finished and tested in the United States",
  "The supplier's name on the docket of the July 2026 FDA hearing",
] as const;

export default function WhyReVia() {
  return (
    <div className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        <Rise>
          <div className="pt-12 sm:pt-16">
            <Label>Why us</Label>
            <Heading as="h1" className="mt-4 max-w-[20ch] text-[2rem] sm:text-[2.875rem]">
              Every lot gets tested. Here&rsquo;s the certificate.
            </Heading>
          </div>
        </Rise>

        <DrawRule className="mt-10" />

        {/* ── the claim, in full ── */}
        <Rise delay={0.08}>
          <div className="grid gap-8 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20">
            <Label className="lg:pt-1">What happens to a lot</Label>
            <div className="max-w-[62ch] space-y-5 font-sans text-[0.9375rem] leading-[1.85] text-[#3D3229]/78">
              <p>
                Before a lot ships, it goes to an independent lab in the United
                States. The lab reports four things on one page:
              </p>
              <p>
                <strong className="font-medium text-[#3D3229]">Identity</strong>: is the material the
                peptide on the label?
              </p>
              <p>
                <strong className="font-medium text-[#3D3229]">Quantity</strong>: how many milligrams are
                actually in the vial, against what the label says.
              </p>
              <p>
                <strong className="font-medium text-[#3D3229]">Purity</strong>: how much of the material
                is the named peptide, measured by reversed-phase HPLC with UV
                detection.
              </p>
              <p>
                <strong className="font-medium text-[#3D3229]">Heavy metals</strong>: tested against a
                limit of 50 parts per billion.
              </p>
              <p>
                The certificate shows the lot code, the date the sample arrived,
                the date it was run, the chromatogram, the chemist&rsquo;s name,
                and an access code. Type that code into the lab&rsquo;s
                verification page and the lab&rsquo;s own database returns the
                same certificate.
              </p>
              <p className="text-[#3D3229]">
                If a lot fails, it doesn&rsquo;t ship. If we change a method, the
                next certificate says so. If you find a certificate and a vial
                that don&rsquo;t match, tell us. We&rsquo;ll investigate and write
                back. These are research materials for laboratory use, and
                nothing here describes a human use.
              </p>
            </div>
          </div>
        </Rise>

        {/* ── the certificate, line by line ── */}
        <Rise delay={0.06}>
          <div className="grid gap-8 border-t border-[#3D3229]/12 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20">
            <div>
              <Label className="lg:pt-1">One certificate, line by line</Label>
              <p className="mt-3 max-w-[30ch] font-sans text-[0.8125rem] leading-[1.7] text-[#3D3229]/55">
                COA #{COA_EXAMPLE.number} &mdash; {COA_EXAMPLE.product}. Sample
                received {COA_EXAMPLE.received}, analyzed {COA_EXAMPLE.analysed}.
              </p>
            </div>
            <dl className="max-w-[62ch]">
              {COA_EXAMPLE.rows.map(([k, v], i) => (
                <div
                  key={k}
                  className={`grid gap-1 py-3 sm:grid-cols-[13rem_1fr] sm:gap-6 ${
                    i > 0 ? "border-t border-[#3D3229]/10" : ""
                  }`}
                >
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[#A38569]">
                    {k}
                  </dt>
                  <dd className="font-sans text-[0.875rem] leading-relaxed text-[#3D3229]/78">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Rise>

        {/* ── the comparison, nobody named ── */}
        <Rise delay={0.06}>
          <div className="grid gap-8 border-t border-[#3D3229]/12 py-10 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-20">
            <div>
              <Label className="lg:pt-1">Run this on anyone</Label>
              <p className="mt-3 max-w-[30ch] font-sans text-[0.8125rem] leading-[1.7] text-[#3D3229]/55">
                Seven questions, each with an answer you can check. Ours are in
                the left column. The right column is for whoever else you&rsquo;re
                considering. We left it blank because it&rsquo;s yours to fill in.
              </p>
            </div>
            <div className="max-w-[62ch]">
              <div className="grid grid-cols-[1fr_5rem_5rem] items-end gap-3 pb-2">
                <span />
                <Label className="text-right">ReVia</Label>
                <Label className="text-right !text-[#3D3229]/35">Theirs</Label>
              </div>
              {CHECKS.map((c) => (
                <div
                  key={c}
                  className="grid grid-cols-[1fr_5rem_5rem] items-baseline gap-3 border-t border-[#3D3229]/10 py-3"
                >
                  <span className="font-sans text-[0.8438rem] leading-snug text-[#3D3229]/75">{c}</span>
                  <span className="text-right font-sans text-[0.8125rem] text-[#3D3229]">Yes</span>
                  <span className="text-right font-mono text-[0.8125rem] text-[#3D3229]/22">&mdash;</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>

        {/* ── the record ── */}
        <Rise>
          <div className="border-t border-[#3D3229]/12 py-10">
            <p className="max-w-[58ch] font-sans text-[0.875rem] leading-[1.8] text-[#3D3229]/62">
              That last one can&rsquo;t be bought. Our founder is on the docket
              of the {HEARING.committee}, {HEARING.dates}, and everything he said
              there is{" "}
              <Link
                href="/washington"
                className="border-b border-[#A38569]/50 pb-0.5 text-[#3D3229] transition hover:border-[#A38569]"
              >
                published here in full
              </Link>
              .
            </p>
          </div>
        </Rise>
      </div>
    </div>
  );
}
