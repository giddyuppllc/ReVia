import Link from "next/link";

import { HEARING, PULL_QUOTE, STATEMENTS, STATEMENT_COUNT } from "@/data/federal-record";
import { POSITIONING } from "@/lib/positioning";
import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * The home page opens with the testimony, not with a product.
 *
 * What was here: four vials on a worktop, a "Shop Compounds" button, and the
 * line "Premium Peptides. Proven Purity. Real Results." — a storefront hero on a
 * site that sells nothing, and an outcome claim ("Real Results") that no
 * document supports.
 *
 * What replaces it is the one thing in this category nobody can copy: the
 * founder said this out loud, to a federal advisory committee, on a webcast with
 * a timecode anyone can check. It is the argument for the whole company and it
 * was buried three clicks down.
 *
 * The quote is `PULL_QUOTE`, which is asserted at module load to be a contiguous
 * run of an actual paragraph — never a splice. The citation line beneath it
 * carries the committee, the date, the docket and the timecode, in the shape a
 * reference takes, because a quotation you can go and verify is worth more than
 * one you are asked to believe.
 */
export default function TestimonyHero() {
  const statement = STATEMENTS.find((s) => s.n === PULL_QUOTE.n)!;

  return (
    <section className="relative overflow-hidden bg-[#F0EDE5]">
      {/* Paper. Two barely-there washes and a vertical hairline at the measure's
          edge — the page should feel like a sheet, not a screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(120% 80% at 12% 0%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 60% at 88% 8%, rgba(163,133,105,0.10) 0%, rgba(163,133,105,0) 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[73.75rem] px-5 sm:px-8">
        {/* ── masthead ── */}
        <Rise>
          <div className="flex flex-wrap items-baseline justify-between gap-y-2 pt-10 sm:pt-14">
            <Label>On the federal record</Label>
            <Label className="!text-[#3D3229]/40">
              {HEARING.committee} · {HEARING.dates}
            </Label>
          </div>
        </Rise>
        <DrawRule className="mt-3" delay={0.15} />

        {/* The house line, under the rule where a masthead motto sits. It is
            the only place on the page the brand speaks in its own voice rather
            than quoting a document. */}
        <Rise delay={0.06}>
          <p className="pt-5 font-display text-[1.0625rem] font-light tracking-[0.01em] text-[#A38569] sm:text-[1.1875rem]">
            {POSITIONING}
          </p>
        </Rise>

        {/* ── the quote ── */}
        <div className="grid gap-12 pt-8 pb-12 lg:grid-cols-[1fr_260px] lg:gap-20 sm:pt-10 sm:pb-16">
          {/* No ch measure on this wrapper: `ch` resolves against ITS font
              size (16px), not the display size inside it, so a "19ch" column
              came out four words wide under 72px type. The grid column sets the
              measure; the type size sets the line count. */}
          <div className="min-w-0">
            <Rise delay={0.1}>
              <blockquote>
                {/* Hung into the margin at large sizes, the way a set page does
                    it — the quote mark should not indent the first word. */}
                <span
                  aria-hidden
                  className="float-left -ml-1 mr-2 font-display text-[2.4em] leading-[0.62] text-[#A38569]/30 sm:-ml-7 sm:mr-3"
                >
                  &ldquo;
                </span>
                <Heading
                  as="h1"
                  className="text-[1.875rem] sm:text-[2.75rem] lg:text-[3.5rem] [text-wrap:balance]"
                >
                  {PULL_QUOTE.text}
                </Heading>
              </blockquote>
            </Rise>

            <Rise delay={0.22}>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-sans text-[0.8125rem] font-medium text-[#3D3229]">
                  Mike Stone
                </span>
                <span className="text-[#3D3229]/25">·</span>
                <span className="font-sans text-[0.8125rem] text-[#3D3229]/55">
                  Founder, ReVia
                </span>
              </div>
              <p className="mt-2 font-mono text-[0.6875rem] leading-relaxed tracking-tight text-[#3D3229]/40">
                {statement.date} · {statement.compound} · speaker {statement.speakerSlot} ·{" "}
                {statement.from}–{statement.to} · docket {HEARING.docket}
              </p>
            </Rise>

            <Rise delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href="/washington"
                  className="group inline-flex items-baseline gap-2 font-sans text-[0.8125rem] font-medium text-[#3D3229]"
                >
                  <span className="border-b border-[#A38569]/50 pb-0.5 transition group-hover:border-[#A38569]">
                    Read all {STATEMENT_COUNT} statements
                  </span>
                  <span className="text-[#A38569] transition group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
                <a
                  // The webcast for the day this statement was given, so "watch it"
                  // lands on the recording it cites rather than the meeting index.
                  href={
                    HEARING.webcasts.find((w) => w.day === statement.day)?.url ??
                    HEARING.meetingPage
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.8125rem] text-[#3D3229]/50 underline decoration-[#3D3229]/20 underline-offset-4 transition hover:text-[#3D3229]"
                >
                  Watch the webcast
                </a>
              </div>
            </Rise>
          </div>

          {/* ── the index: what the record contains ── */}
          <Rise delay={0.34} className="lg:w-[228px]">
            <div className="lg:border-l lg:border-[#3D3229]/12 lg:pl-8">
              <Label>In the record</Label>
              <ul className="mt-5 space-y-0">
                {STATEMENTS.map((s, i) => (
                  <li key={s.n}>
                    {i > 0 && <div className="h-px w-full bg-[#3D3229]/10" />}
                    <Link
                      href={`/washington#${s.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <span className="font-sans text-[0.8125rem] text-[#3D3229]/70 transition group-hover:text-[#3D3229]">
                        {s.compound}
                      </span>
                      <span className="font-mono text-[0.6875rem] tabular-nums text-[#3D3229]/30">
                        {s.from}
                      </span>
                    </Link>
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
