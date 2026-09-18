import Link from "next/link";

import { COA_SPEC } from "@/lib/coa";
import { D2C, PARTNER_LINK_PROPS } from "@/lib/partner";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * How to buy anything in this category — with our own handoff as the worked
 * example.
 *
 * A bare "Shop" button on a site that sells nothing is the weakest thing on the
 * page: it asks for a click and teaches nothing, and it does not say that the
 * click leaves ReVia entirely. This section does the opposite. It states the
 * method a buyer should apply to *any* supplier, and then shows where ReVia
 * sends people and why — so the handoff reads as the last step of an argument
 * rather than as an advert.
 *
 * The steps are deliberately ones ReVia can be held to. Each is a question a
 * reader can put to i2b, to us, or to anybody else, and every one of them has a
 * checkable answer on a certificate.
 *
 * ## The leaving notice
 *
 * The line above the button says plainly that the link leaves ReVia and where it
 * goes. `PartnerShopButton` already appends an sr-only "(opens in a new tab)",
 * which handles the mechanics; this handles the substance — a reader should know
 * they are being handed to a different company before they click, not after.
 */

const STEPS = [
  {
    n: "01",
    title: "Ask for the certificate before you buy",
    body:
      "Not a purity number in a product description — the document. A supplier who cannot produce one for the batch on the shelf is asking you to take the number on faith.",
  },
  {
    n: "02",
    title: "Check the batch on the paper is the batch in the box",
    body:
      "A certificate for a different lot tells you nothing about the one you receive. The batch number should appear on the vial and on the document, and they should match.",
  },
  {
    n: "03",
    title: "Find out who ran the analysis",
    body:
      `An independent laboratory should be named, with the method stated. Ours is ${COA_SPEC.lab}, by ${COA_SPEC.method}. "Third-party tested" without a name is not a claim you can check.`,
  },
  {
    n: "04",
    title: "Read what is reported, and what is not",
    body:
      "A certificate reports the tests that were run. Assume nothing about the ones it does not mention — an absent result is not a passed result, and a long list of assays nobody performed is a common way to look thorough.",
  },
];

export default function HowToBuy() {
  return (
    <section className="bg-[#F0EDE5]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <DrawRule />
        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 sm:py-20">
          <Rise>
            <Label>How to buy in this category</Label>
            <Heading className="mt-4 text-[26px] sm:text-[31px]">
              Four questions, for anyone selling you a peptide.
            </Heading>
            <p className="mt-5 max-w-[42ch] font-sans text-[14.5px] leading-[1.75] text-[#3D3229]/62">
              Including us. None of these depend on trusting a brand — each one
              has an answer on a document, or it does not have an answer.
            </p>
            <Link
              href="/blog/how-to-evaluate-peptide-supplier"
              className="group mt-6 inline-flex items-baseline gap-2 font-sans text-[13px] font-medium text-[#3D3229]"
            >
              <span className="border-b border-[#A38569]/50 pb-0.5 transition group-hover:border-[#A38569]">
                The long version
              </span>
              <span className="text-[#A38569] transition group-hover:translate-x-0.5">&rarr;</span>
            </Link>
          </Rise>

          <Rise delay={0.12}>
            <ol className="grid grid-cols-1 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`border-t border-[#3D3229]/12 py-6 ${
                    i % 2 === 0 ? "sm:pr-8" : "sm:border-l sm:border-l-[#3D3229]/12 sm:pl-8"
                  }`}
                >
                  <span className="font-mono text-[11px] text-[#A38569]">{s.n}</span>
                  <h3 className="mt-2 font-display text-[19px] font-light leading-snug text-[#3D3229]">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[44ch] font-sans text-[13px] leading-[1.7] text-[#3D3229]/58">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>

            {/* ── the worked example: where we send people, and that it is not us ── */}
            <div className="mt-10 border-t border-[#3D3229]/12 pt-8">
              <Label>Where ReVia sends researchers</Label>
              <p className="mt-3 max-w-[58ch] font-sans text-[14px] leading-[1.75] text-[#3D3229]/70">
                ReVia Life publishes; it does not sell. Compounds are supplied by{" "}
                <strong className="font-medium text-[#3D3229]">i2b Health</strong>, our
                exclusive research provider — a separate company, with its own
                catalogue, its own terms and its own checkout.{" "}
                <span className="text-[#3D3229]/50">
                  The link below leaves ReVia Life and opens i2b in a new tab.
                </span>
              </p>
              {D2C.origin && (
                <a
                  href={`${D2C.origin}?src=revialife.howtobuy`}
                  {...PARTNER_LINK_PROPS}
                  className="mt-5 inline-flex items-baseline gap-2 border border-[#3D3229]/25 px-5 py-2.5 font-sans text-[13px] font-medium text-[#3D3229] transition hover:border-[#A38569] hover:text-[#A38569]"
                >
                  Continue to i2b Health
                  <span aria-hidden>&#8599;</span>
                  <span className="sr-only"> (opens i2b Health in a new tab)</span>
                </a>
              )}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
