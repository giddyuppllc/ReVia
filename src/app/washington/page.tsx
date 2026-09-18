import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, Mic, Scale } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { RECORD_LINKS } from "@/lib/record-links";
import { HEARING, STATEMENTS, STATEMENT_COUNT, CORRECTIONS } from "@/data/federal-record";

/* ------------------------------------------------------------------ */
/*  ReVia in Washington                                                */
/*                                                                     */
/*  The five statements Mike Stone made to the FDA Pharmacy            */
/*  Compounding Advisory Committee, published in full with the         */
/*  timecode for each one so any quote can be checked against FDA's    */
/*  own recording.                                                     */
/*                                                                     */
/*  This page makes no claim about what the committee decided or what  */
/*  the law now is. It is a record of what was said, by us, in public. */
/*  That distinction is the reason it can be published at all.         */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "ReVia in Washington | The Federal Record",
  description:
    "Mike Stone spoke five times at the FDA Pharmacy Compounding Advisory Committee on 23-24 July 2026. Every statement in full, with the webcast timecode for each.",
  alternates: { canonical: "https://revialife.com/washington" },
  openGraph: {
    title: "ReVia in Washington | The Federal Record",
    description:
      "Five statements to the FDA Pharmacy Compounding Advisory Committee, published in full with timecodes.",
    url: "https://revialife.com/washington",
    type: "article",
  },
};

const ORIGIN = "https://revialife.com";

/** The monograph a statement belongs to. The mapping lives in one place. */
function researchSlugFor(s: { slug: string }): string {
  return RECORD_LINKS.find((l) => l.statement.slug === s.slug)?.researchSlug ?? s.slug;
}

export default function WashingtonPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ReVia in Washington: five statements to the FDA Pharmacy Compounding Advisory Committee",
    datePublished: "2026-07-24",
    author: { "@type": "Person", name: "Mike Stone" },
    publisher: { "@type": "Organization", name: "ReVia" },
    isBasedOn: HEARING.webcasts.map((w) => w.url),
    citation: [HEARING.meetingPage, HEARING.comment.url],
    mainEntityOfPage: `${ORIGIN}/washington`,
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${ORIGIN}/` },
          { name: "ReVia in Washington", url: `${ORIGIN}/washington` },
        ]}
      />

      {/* ── Statement ── */}
      <section className="bg-stone-900 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-500">
            The Federal Record
          </p>
          <h1 className="mt-4 text-4xl font-light leading-[1.05] tracking-tight text-stone-50 sm:text-5xl lg:text-6xl">
            ReVia in Washington
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300">
            On 23 and 24 July 2026, our founder stood at the podium of the{" "}
            {HEARING.committee} and spoke {STATEMENT_COUNT} times on the record.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-400">
            Every statement is published below in full &mdash; including the parts that are
            not flattering to this industry, or to us. Each carries the timecode of FDA&rsquo;s
            own recording, so you can hear it said rather than take our word for it.
          </p>

          {/* The record, as data */}
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-stone-700 pt-8 sm:grid-cols-4">
            {[
              { t: "Committee", d: "FDA PCAC" },
              { t: "Dates", d: HEARING.dates },
              { t: "Docket", d: HEARING.docket },
              { t: "Statements", d: String(STATEMENT_COUNT) },
            ].map((row) => (
              <div key={row.t}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                  {row.t}
                </dt>
                <dd className="mt-1 font-mono text-sm text-stone-200">{row.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Primary sources ── */}
      <section className="border-b border-sky-200/60 bg-sky-50/50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-700">
            Go to the source
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: Scale, label: "FDA meeting page", href: HEARING.meetingPage },
              { icon: FileText, label: `Docket ${HEARING.docket}`, href: HEARING.comment.url },
              ...HEARING.webcasts.map((w) => ({
                icon: Mic,
                label: `Webcast — day ${w.day}, ${w.date}`,
                href: w.url,
              })),
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-sky-200/70 bg-white/70 px-4 py-3 text-sm text-stone-700 transition hover:border-sky-300 hover:bg-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 text-sky-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
          <p className="mt-5 font-mono text-[11px] leading-relaxed text-stone-500">
            Written comment {HEARING.comment.id}, received {HEARING.comment.received}. He was
            offered {HEARING.slotsOffered} open-public-hearing slots and used {STATEMENT_COUNT}.
          </p>
        </div>
      </section>

      {/* ── Contents ── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-light tracking-tight text-stone-800">The statements</h2>
          <ol className="mt-5 space-y-1">
            {STATEMENTS.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="group flex items-baseline gap-4 rounded-lg py-2 transition hover:bg-sky-50/70"
                >
                  <span className="font-mono text-xs tabular-nums text-sky-600">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-stone-800 group-hover:text-sky-700">
                    {s.compound}
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-stone-400">
                    day {s.day} &middot; {s.slotMinutes} min
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── The statements ── */}
      {STATEMENTS.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          aria-labelledby={`${s.slug}-heading`}
          className={`scroll-mt-24 px-6 py-16 ${i % 2 === 0 ? "bg-sky-50/40" : ""}`}
        >
          <div className="mx-auto max-w-4xl">
            <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
              {/* Metadata rail — everything checkable about this statement */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-600">
                  Statement {String(s.n).padStart(2, "0")}
                </p>
                <h3
                  id={`${s.slug}-heading`}
                  className="mt-2 text-2xl font-light tracking-tight text-stone-800"
                >
                  {s.compound}
                </h3>
                <dl className="mt-5 space-y-2.5 border-t border-sky-200/60 pt-4 font-mono text-[11px]">
                  {[
                    ["Date", s.date],
                    ["Session", `Day ${s.day}`],
                    ["Speaker", `No. ${s.speakerSlot}`],
                    ["Slot", `${s.slotMinutes} minutes`],
                    ["Webcast", `${s.from} – ${s.to}`],
                  ].map(([t, d]) => (
                    <div key={t} className="flex justify-between gap-3">
                      <dt className="text-stone-400">{t}</dt>
                      <dd className="text-right text-stone-600">{d}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={HEARING.webcasts.find((w) => w.day === s.day)?.url ?? HEARING.meetingPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-sky-700 hover:text-sky-600"
                >
                  Hear it
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>

                {/* Into the library. These five compounds are the only ones on
                    the site seen from both sides — what was said about them in
                    public, and what the research says. Each half was previously
                    unaware of the other. */}
                <Link
                  href={`/research/${researchSlugFor(s)}`}
                  className="mt-3 block font-mono text-[11px] text-stone-500 underline decoration-stone-300 underline-offset-4 transition hover:text-stone-700"
                >
                  Read the {s.compound} research &rarr;
                </Link>
              </div>

              {/* Verbatim */}
              <div className="mt-8 lg:mt-0">
                <p className="mb-6 border-l-2 border-sky-300 pl-4 font-mono text-[11px] leading-relaxed text-stone-500">
                  {s.note}
                </p>
                <div className="space-y-5">
                  {s.body.map((para, j) => (
                    <p
                      key={j}
                      className="max-w-[68ch] text-[17px] leading-[1.75] text-stone-700"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Corrections ── */}
      <section className="border-t border-sky-200/60 bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-light tracking-tight text-stone-800">
            What the recording does and does not show
          </h2>
          <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-stone-600">
            A version of this testimony circulating elsewhere is not accurate. We would rather
            correct our own record than let a flattering error stand.
          </p>
          <ul className="mt-6 space-y-4">
            {CORRECTIONS.map((c, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-1 font-mono text-xs tabular-nums text-sky-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="max-w-[68ch] text-sm leading-relaxed text-stone-600">{c}</p>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-[68ch] border-t border-sky-200/60 pt-6 font-mono text-[11px] leading-relaxed text-stone-500">
            Transcribed from FDA&rsquo;s webcast recordings (auto-generated captions), then
            cleaned: caption misspellings corrected, stutters and filler repeats removed,
            nothing added or reordered. FDA had not posted an official transcript as of 12
            September 2026. When it does, this page will be checked against it.
          </p>
        </div>
      </section>

      {/* ── Onward ── */}
      <section className="bg-sky-50/60 px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            href="/about"
            className="group rounded-2xl border border-sky-200/60 bg-white/70 p-7 transition hover:border-sky-300 hover:shadow-lg hover:shadow-stone-300/25"
          >
            <h3 className="text-lg font-semibold text-stone-800">Why we were there</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              The story behind the testimony, and what this company is for.
            </p>
          </Link>
          <Link
            href="/news"
            className="group rounded-2xl border border-sky-200/60 bg-white/70 p-7 transition hover:border-sky-300 hover:shadow-lg hover:shadow-stone-300/25"
          >
            <h3 className="text-lg font-semibold text-stone-800">Our thoughts on the news</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              What is changing in peptide regulation, what it means, and where we stand.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
