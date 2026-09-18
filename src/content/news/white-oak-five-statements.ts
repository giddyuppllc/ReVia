import type { NewsPost } from "@/lib/news";
import { HEARING, STATEMENTS, STATEMENT_COUNT, CORRECTIONS } from "@/data/federal-record";

/* ------------------------------------------------------------------ */
/*  Grounded entirely in this repository's own primary material: the    */
/*  transcribed statements in src/data/federal-record.ts, FDA's meeting  */
/*  page, and FDA's two webcast recordings. No secondary source is       */
/*  needed for any assertion below, which is why this one could be       */
/*  written without opening anybody else's coverage.                     */
/*                                                                      */
/*  It states no vote tally. Those are secondary-sourced — see the       */
/*  provenance note on Statement.vote — and this post does not need      */
/*  them to make its point.                                             */
/* ------------------------------------------------------------------ */

export const post: NewsPost = {
  slug: "white-oak-five-statements",
  title: "Five minutes at a time: what our founder told the FDA",
  summary:
    `ReVia's founder spoke ${STATEMENT_COUNT} times at FDA's Pharmacy Compounding Advisory Committee over two days in July 2026. Every word is published here, with the webcast timecode for each.`,
  published: "2026-09-18",
  category: "Federal",
  status:
    "The statements are a matter of public record. FDA had posted no official transcript as of 18 September 2026.",
  stance:
    "A supplier who wants the category regulated should say so where it counts, on the record, under his own name — and then publish what he said without trimming it.",
  body: [
    {
      kind: "p",
      text:
        `On 23 and 24 July 2026, FDA's Pharmacy Compounding Advisory Committee met at White Oak in Silver Spring, Maryland, to consider a group of peptides proposed for use in compounding. The meeting had an open public hearing, which is the part where anybody who registers gets a few minutes at a podium. Mike Stone, who founded ReVia, took ${STATEMENT_COUNT} of those slots.`,
    },
    {
      kind: "p",
      text:
        "He was not there to defend a product. He told the committee that his market is gray, that he is in it, and that he wanted it regulated — which is not the position a supplier is expected to take at a hearing about restricting what he sells.",
    },
    { kind: "h2", text: "What he spoke on" },
    {
      kind: "table",
      caption: `The ${STATEMENT_COUNT} statements, with the webcast timecode for each.`,
      rows: [
        ["Day", "Substance", "Slot", "Webcast"],
        ...STATEMENTS.map((s) => [
          `Day ${s.day}`,
          s.compound,
          `Speaker ${s.speakerSlot}, ${s.slotMinutes} min`,
          `${s.from}–${s.to}`,
        ]),
      ],
    },
    { kind: "h2", text: "Why we publish them whole" },
    {
      kind: "p",
      text:
        "A statement to a federal advisory committee is a primary source. Quoting a sentence of it on a product page turns it into marketing; publishing all of it, with the timecode, lets a reader go and check that the sentence was not doing work the rest of the paragraph would have undone.",
    },
    {
      kind: "callout",
      title: "One version in circulation is spliced",
      text:
        CORRECTIONS[0] ??
        "A transcript circulating from these sessions joins material from two different statements and adds sentences that were not said. Check any quotation against the webcast timecode.",
    },
    {
      kind: "p",
      text:
        "FDA had not posted an official transcript when this was written. What is published here was transcribed from FDA's own webcast recordings, cleaned of caption errors and stutters, with nothing added and nothing reordered. When FDA's version appears, ours should be checked against it and corrected where they differ.",
    },
    { kind: "h2", text: "What a recommendation is" },
    {
      kind: "p",
      text:
        "The committee advises; it does not decide. Nothing said at that meeting, and nothing voted on at it, changed what may lawfully be compounded on the day it ended. Any page that implies otherwise — ours included — is wrong.",
    },
  ],
  sources: [
    {
      title: "July 23-24, 2026 Meeting of the Pharmacy Compounding Advisory Committee",
      publisher: "U.S. Food and Drug Administration",
      url: HEARING.meetingPage,
      type: "FDA",
      note: "The meeting notice, agenda and materials.",
    },
    {
      title: "Day 1 webcast",
      publisher: "U.S. Food and Drug Administration",
      url: HEARING.webcasts[0].url,
      type: "FDA",
      date: HEARING.webcasts[0].date,
      note: "The recording the Day 1 timecodes refer to.",
    },
    {
      title: "Day 2 webcast",
      publisher: "U.S. Food and Drug Administration",
      url: HEARING.webcasts[1].url,
      type: "FDA",
      date: HEARING.webcasts[1].date,
      note: "The recording the Day 2 timecodes refer to.",
    },
    {
      title: `Docket ${HEARING.docket}`,
      publisher: "Regulations.gov",
      url: HEARING.comment.url,
      type: "Regulations.gov",
      note: `Holds the written comment filed to the docket, ${HEARING.comment.id}, received ${HEARING.comment.received}.`,
    },
  ],
  related: ["pcac-july-2026"],
};
