import { ArrowUpRight } from "lucide-react";
import type { Block, Source } from "@/lib/news";

/* ------------------------------------------------------------------ */
/*  Post rendering                                                     */
/*                                                                     */
/*  Two deliberate choices:                                            */
/*                                                                     */
/*  Inline markers like [1] are turned into links down to the source   */
/*  ledger, so a claim and its evidence are one click apart.           */
/*                                                                     */
/*  The ledger is a ledger, not a card grid. References that look like */
/*  marketing tiles read as decoration; references that look like      */
/*  references read as evidence.                                       */
/* ------------------------------------------------------------------ */

/** Turn "[1]" / "[1][2]" into superscript links into the ledger. */
function withCitations(text: string, slugPrefix: string) {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/);
    if (!m) return <span key={i}>{part}</span>;
    return (
      <a
        key={i}
        href={`#${slugPrefix}-source-${m[1]}`}
        className="ml-0.5 align-super font-mono text-[0.68em] text-sky-700 no-underline hover:text-sky-600"
        aria-label={`Source ${m[1]}`}
      >
        [{m[1]}]
      </a>
    );
  });
}

export function PostBody({ body, slug }: { body: Block[]; slug: string }) {
  return (
    <div className="space-y-6">
      {body.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="scroll-mt-24 border-t border-sky-200/60 pt-8 text-2xl font-light tracking-tight text-stone-800"
              >
                {block.text}
              </h2>
            );

          case "p":
            return (
              <p key={i} className="max-w-[68ch] text-[17px] leading-[1.75] text-stone-700">
                {withCitations(block.text, slug)}
              </p>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className="max-w-[68ch] space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-[1.75] text-stone-700">
                    <span
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500"
                      aria-hidden="true"
                    />
                    <span>{withCitations(item, slug)}</span>
                  </li>
                ))}
              </Tag>
            );
          }

          case "quote":
            return (
              <figure key={i} className="my-8 rounded-2xl bg-sky-50/70 p-7">
                <blockquote className="max-w-[60ch] text-lg font-light leading-relaxed text-stone-800">
                  &ldquo;{block.text}&rdquo;
                </blockquote>
                {block.attribution && (
                  <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
                    {block.attribution}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <aside
                key={i}
                className="my-8 max-w-[68ch] rounded-2xl border-l-2 border-[#3E97CE] bg-white p-6 shadow-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#2f7ba8]">
                  {block.title}
                </p>
                <p className="mt-2 text-[16px] leading-[1.7] text-stone-700">
                  {withCitations(block.text, slug)}
                </p>
              </aside>
            );

          case "timeline":
            return (
              <ol key={i} className="my-8 space-y-6">
                {block.entries.map((e, j) => (
                  <li key={j} className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <span className="font-mono text-xs tabular-nums text-sky-700">
                      {e.date}
                      {e.pending && (
                        <span className="ml-2 rounded bg-sky-100 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-sky-700">
                          pending
                        </span>
                      )}
                    </span>
                    <div className="border-l border-sky-200/70 pl-5 sm:border-l-0 sm:pl-0">
                      <p className="font-semibold text-stone-800">{e.title}</p>
                      <p className="mt-1 max-w-[60ch] text-[15px] leading-relaxed text-stone-600">
                        {withCitations(e.text, slug)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "table":
            return (
              <figure key={i} className="my-8 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-sky-100/70">
                      {block.rows[0]?.map((h, j) => (
                        <th
                          key={j}
                          className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.slice(1).map((row, j) => (
                      <tr key={j} className="border-b border-sky-100">
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 align-top text-stone-700">
                            {withCitations(cell, slug)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {block.caption && (
                  <figcaption className="mt-2 font-mono text-[11px] text-stone-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}

export function SourceLedger({ sources, slug }: { sources: Source[]; slug: string }) {
  return (
    <ol className="mt-6 space-y-5">
      {sources.map((s, i) => (
        <li
          key={s.url}
          id={`${slug}-source-${i + 1}`}
          className="scroll-mt-24 grid gap-2 border-t border-sky-200/50 pt-5 sm:grid-cols-[3rem_1fr] sm:gap-4"
        >
          <span className="font-mono text-xs tabular-nums text-sky-700">
            [{i + 1}]
          </span>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group font-medium text-stone-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-700"
              >
                {s.title}
                <ArrowUpRight
                  className="ml-1 inline h-3 w-3 align-baseline text-sky-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-700">
                {s.type}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-stone-500">
              {s.publisher}
              {s.date ? ` · ${s.date}` : ""}
            </p>
            {s.note && (
              <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-stone-600">
                {s.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
