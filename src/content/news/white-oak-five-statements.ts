import type { NewsPost } from "@/lib/news";
import { HEARING, STATEMENTS } from "@/data/federal-record";

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
    "Our founder spoke five times at the FDA's Pharmacy Compounding Advisory Committee over two days in July 2026. Every word is published here, with the webcast timecode for each statement.",
  published: "2026-09-18",
  category: "Federal",
  status:
    "The statements are public record. As of September 18, 2026, the FDA hadn't posted an official transcript.",
  stance:
    "A supplier who wants this category regulated should say so where it counts: on the record, under his own name. Then he should publish what he said without trimming it.",
  body: [
    {
      kind: "p",
      text:
        "On July 23 and 24, 2026, the FDA's Pharmacy Compounding Advisory Committee met at White Oak in Silver Spring, Maryland, to consider a group of peptides proposed for compounding. The meeting included an open public hearing, which is the part where anyone who registers gets a few minutes at a podium. Mike Stone, who founded ReVia, took five of those slots.",
    },
    {
      kind: "p",
      text:
        "He went there to tell the committee that his market is gray, that he's in it, and that he wants it regulated. Suppliers don't usually say that at a hearing about restricting what they sell.",
    },
    { kind: "h2", text: "What he spoke on" },
    {
      kind: "table",
      caption: "The five statements, with the webcast timecode for each.",
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
        "A statement to a federal advisory committee is a primary source. Quote one sentence of it on a product page and you've turned it into marketing. Publish all of it with the timecode, and a reader can go check that the sentence wasn't doing work the rest of the paragraph would have undone.",
    },
    {
      kind: "callout",
      title: "One version in circulation is spliced",
      text:
        "Mike didn't speak in the MOTS-c hearing (Day 1, 4:40 p.m. session) or the Epitalon hearing (Day 2, 11:15 a.m. session). The captions show no appearance, and in the TB-500 session he said it would \"probably be the last time you'll see me today.\"",
    },
    {
      kind: "p",
      text:
        "The FDA hadn't posted an official transcript when this was written. We transcribed what's published here from the FDA's own webcast recordings and cleaned up caption errors and stutters, with nothing added and nothing reordered. When the FDA's version comes out, we'll check ours against it and correct any differences.",
    },
    { kind: "h2", text: "What a recommendation is" },
    {
      kind: "p",
      text:
        "The committee advises. It doesn't decide. Nothing said at that meeting, and nothing voted on at it, changed what a pharmacy could lawfully compound the day it ended. Any page that implies otherwise, ours included, is wrong.",
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
