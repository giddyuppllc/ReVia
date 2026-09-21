import Link from "next/link";

import { HEARING } from "@/data/federal-record";
import { statementForCompound } from "@/lib/record-links";

/**
 * "This compound is in the public record" — shown on the monographs for the
 * five compounds the founder testified about.
 *
 * Renders nothing for the other 33, which is most of the library. That is the
 * point: an element that appears on every page says nothing, and this one is
 * only worth having where it is remarkable.
 *
 * ## No excerpt
 *
 * It states the fact and links to the statement rather than quoting from it.
 * Pulling a sentence out of a five-minute statement to sit on a product page is
 * how a quotation starts drifting from what was said — and this repo already
 * carries `CORRECTIONS` recording that happening to this exact testimony. The
 * fact on its own is strong enough: the person who founded the company stood up
 * in front of a federal advisory committee and talked about this compound, and
 * here is the timecode.
 */
export default function OnTheRecord({ researchSlug }: { researchSlug: string }) {
  const s = statementForCompound(researchSlug);
  if (!s) return null;

  return (
    <aside className="mt-10 border-t border-[#3D3229]/15 pt-6">
      <span className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#A38569]">
        In the public record
      </span>
      <p className="mt-3 max-w-[58ch] font-sans text-[0.9062rem] leading-[1.75] text-[#3D3229]/75">
        ReVia&rsquo;s founder, Mike Stone, spoke on {s.compound} before the{" "}
        {HEARING.committee} on {s.date} &mdash; the session that reviewed it as a
        bulk substance for compounding.
      </p>
      <p className="mt-2 font-mono text-[0.6875rem] tracking-tight text-[#3D3229]/40">
        speaker {s.speakerSlot} · {s.from}&ndash;{s.to} · docket {HEARING.docket}
      </p>
      <Link
        href={`/washington#${s.slug}`}
        className="group mt-4 inline-flex items-baseline gap-2 font-sans text-[0.8125rem] font-medium text-[#3D3229]"
      >
        <span className="border-b border-[#A38569]/50 pb-0.5 transition group-hover:border-[#A38569]">
          Read the statement in full
        </span>
        <span className="text-[#A38569] transition group-hover:translate-x-0.5">&rarr;</span>
      </Link>
    </aside>
  );
}
