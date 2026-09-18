import { COA_RESULTS, COA_SPEC } from "@/lib/coa";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * What the certificate actually says, set as a specification.
 *
 * This replaces a row of icons reading ">98% PURITY · RP-HPLC VERIFIED ·
 * CGMP CERTIFIED · PER-BATCH COA". Badges are the weakest way to make a
 * verifiable claim: they compress a document into a sticker, and a sticker is
 * exactly what an unverifiable brand also has.
 *
 * Every value here is read from `src/lib/coa.ts`, which is the transcription of
 * the published Chromate certificates and the single authority for the purity
 * figure — `check-claims` reads its `puritySpec` rather than hardcoding one, so
 * a number typed anywhere else on the site fails the build.
 *
 * Four results, because the certificate reports four. The count is
 * `COA_RESULTS.length`, never typed.
 */
export default function TheStandard() {
  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <DrawRule />
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 sm:py-20">
          <Rise>
            <Label>The standard we publish</Label>
            <Heading className="mt-4 text-[26px] sm:text-[31px]">
              One method. Four results. Named laboratory.
            </Heading>
            <p className="mt-5 max-w-[42ch] font-sans text-[14.5px] leading-[1.75] text-[#3D3229]/62">
              Every certificate reports the same four things, by the same method,
              from the same independent laboratory — and names the batch it was
              run on. The figure that matters is on the document, not in a
              headline.
            </p>
          </Rise>

          <Rise delay={0.12}>
            {/* A reference table, not cards. Hairlines between rows; the label
                in small caps on the left, the value set in the display face on
                the right — the shape a spec sheet takes. */}
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              {[
                { k: "Laboratory", v: COA_SPEC.lab, n: "Independent, named on every certificate" },
                { k: "Method", v: COA_SPEC.method, n: "The single analytical method, as printed" },
                { k: "Purity specification", v: COA_SPEC.puritySpec, n: "Measured figure varies by batch" },
                { k: "Heavy metals", v: COA_SPEC.metalsSpec, n: "Specification, per batch" },
              ].map((row, i) => (
                <div
                  key={row.k}
                  className={`border-t border-[#3D3229]/12 py-5 sm:py-6 ${
                    i % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:border-l-[#3D3229]/12 sm:pl-8"
                  }`}
                >
                  <dt>
                    <Label>{row.k}</Label>
                  </dt>
                  <dd className="mt-2 font-display text-[21px] font-light leading-tight text-[#3D3229] sm:text-[23px]">
                    {row.v}
                  </dd>
                  <dd className="mt-1.5 font-sans text-[11.5px] leading-snug text-[#3D3229]/42">
                    {row.n}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border-t border-[#3D3229]/12 pt-6">
              <Label>Reported on every certificate</Label>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {COA_RESULTS.map((r) => (
                  <li key={r.key} className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[10px] text-[#A38569]">
                      {String(COA_RESULTS.indexOf(r) + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-[13.5px] text-[#3D3229]/75">{r.label}</span>
                    <span className="font-sans text-[11.5px] text-[#3D3229]/38">{r.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
