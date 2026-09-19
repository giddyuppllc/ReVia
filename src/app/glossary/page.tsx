import type { Metadata } from "next";
import Link from "next/link";

import { GLOSSARY_SORTED, GLOSSARY_COUNT } from "@/data/glossary";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Glossary — the vocabulary of research peptides",
  description:
    "What the terms on a certificate and a product page actually mean — RUO, COA, batch, RP-HPLC, cGMP, 503A — and which of them mean nothing at all.",
  alternates: { canonical: "https://revialife.com/glossary" },
};

/**
 * The vocabulary, as a reference page.
 *
 * Set as a definition list rather than as cards, and alphabetical rather than
 * grouped: somebody arriving here has one word in mind, and grouping by theme
 * asks them to guess which theme it was filed under.
 *
 * DefinedTermSet structured data, because that is what this is. It also means
 * the page can be cited by the compound and article pages without duplicating
 * the definitions into each of them.
 */
export default function GlossaryPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "ReVia Life glossary",
    url: "https://revialife.com/glossary",
    hasDefinedTerm: GLOSSARY_SORTED.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `https://revialife.com/glossary#${t.slug}`,
      name: t.term,
      description: t.definition,
    })),
  };

  return (
    <>
      <JsonLd data={ld} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://revialife.com/" },
          { name: "Glossary", url: "https://revialife.com/glossary" },
        ]}
      />

      <div className="bg-[#F0EDE5]">
        <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
          <Rise>
            <div className="pt-12 sm:pt-16">
              <Label>Reference</Label>
              <Heading as="h1" className="mt-4 text-[2rem] sm:text-[2.75rem]">
                The vocabulary.
              </Heading>
              <p className="mt-5 max-w-[56ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/65">
                {GLOSSARY_COUNT} terms that appear on a certificate, a label or a
                product page in this category — including the three that are used
                constantly and mean nothing on their own.
              </p>
            </div>
          </Rise>

          <DrawRule className="mt-10" />

          {/* Index */}
          <Rise delay={0.08}>
            <nav aria-label="Terms" className="flex flex-wrap gap-x-5 gap-y-2 py-6">
              {GLOSSARY_SORTED.map((t) => (
                <a
                  key={t.slug}
                  href={`#${t.slug}`}
                  className="font-sans text-[0.7812rem] text-[#3D3229]/55 underline decoration-[#3D3229]/15 underline-offset-4 transition hover:text-[#A38569] hover:decoration-[#A38569]/50"
                >
                  {t.term}
                </a>
              ))}
            </nav>
          </Rise>

          <dl className="pb-20">
            {GLOSSARY_SORTED.map((t, i) => (
              <div
                key={t.slug}
                id={t.slug}
                className="scroll-mt-28 border-t border-[#3D3229]/12 py-8 sm:grid sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-12"
              >
                <dt>
                  <Heading as="h2" className="text-[1.3125rem]">
                    {t.term}
                  </Heading>
                  {t.expansion && (
                    <span className="mt-1 block font-mono text-[0.6875rem] text-[#3D3229]/42">
                      {t.expansion}
                    </span>
                  )}
                </dt>
                <dd className="mt-3 sm:mt-0">
                  <p className="max-w-[62ch] font-sans text-[0.9062rem] leading-[1.8] text-[#3D3229]/78">
                    {t.definition}
                  </p>
                  {t.inPractice && (
                    <p className="mt-3 max-w-[62ch] border-l border-[#A38569]/35 pl-4 font-sans text-[0.8438rem] leading-[1.75] text-[#3D3229]/58">
                      {t.inPractice}
                    </p>
                  )}
                  {t.see && t.see.length > 0 && (
                    <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <Label className="!inline">See also</Label>
                      {t.see.map((ref) => {
                        const target = GLOSSARY_SORTED.find((x) => x.slug === ref)!;
                        return (
                          <a
                            key={ref}
                            href={`#${ref}`}
                            className="font-sans text-[0.7812rem] text-[#3D3229]/55 underline decoration-[#3D3229]/15 underline-offset-4 transition hover:text-[#A38569]"
                          >
                            {target.term}
                          </a>
                        );
                      })}
                    </p>
                  )}
                </dd>
                {i === GLOSSARY_SORTED.length - 1 && <span className="sr-only" />}
              </div>
            ))}
          </dl>

          <Rise>
            <div className="border-t border-[#3D3229]/12 py-10">
              <p className="max-w-[58ch] font-sans text-[0.875rem] leading-[1.8] text-[#3D3229]/62">
                Most of these matter when you are reading a certificate.{" "}
                <Link
                  href="/blog/how-to-evaluate-peptide-supplier"
                  className="border-b border-[#A38569]/50 pb-0.5 text-[#3D3229] transition hover:border-[#A38569]"
                >
                  How to evaluate a supplier
                </Link>{" "}
                puts them to work.
              </p>
            </div>
          </Rise>
        </div>
      </div>
    </>
  );
}
