import type { NewsPost } from "@/lib/news";

/* ------------------------------------------------------------------ */
/*  Seeded from primary sources only.                                  */
/*                                                                     */
/*  Deliberately absent: the per-compound vote tallies. They circulate  */
/*  widely, but the copy of them available here traces to a secondary   */
/*  site rather than to FDA's own record, and a number nobody can       */
/*  source is exactly what this site does not publish. They go in when  */
/*  the minutes or the webcast confirm them.                            */
/* ------------------------------------------------------------------ */

export const post: NewsPost = {
  slug: "pcac-july-2026",
  title: "The committee voted. That's not the same as access.",
  summary:
    "The FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides on July 23–24, 2026 and recommended six. A recommendation is one step in a long process. Here's what actually changed, and what didn't.",
  published: "2026-09-12",
  category: "Federal",
  status:
    "Recommended by the advisory committee. Still not compoundable; the FDA hasn't acted on the recommendation.",

  body: [
    {
      kind: "p",
      text: "On July 23 and 24, 2026, the FDA's Pharmacy Compounding Advisory Committee met at White Oak to consider whether a group of peptides should be added to the list of bulk drug substances that can be used in compounding under section 503A. Seven substances were reviewed. The committee recommended six and did not recommend emideltide, also known as DSIP. [1][2]",
    },
    {
      kind: "callout",
      title: "The distinction that matters",
      text: "A committee recommendation is advice to the FDA. It isn't an approval. It doesn't change what a pharmacy can compound today, and it doesn't make any substance legal to sell for human use. The FDA decides what happens next, on its own schedule.",
    },
    {
      kind: "p",
      text: "That distinction is doing a lot of work, and it's getting flattened almost everywhere the vote is reported. Reports that a peptide was “approved” in July got it wrong. An advisory committee told the FDA what it thinks, and that's all that happened. None of the six recommended substances can be compounded on the strength of that vote.",
    },
    {
      kind: "h2",
      text: "What the record actually contains",
      id: "the-record",
    },
    {
      kind: "p",
      text: "The meeting was announced in the Federal Register, and a public docket, FDA-2025-N-6895, was opened for written comment. Comments received by July 9 went to the committee. Comments received up to the docket's close on July 22 were to be considered by the FDA. Both days were webcast in full, and the recordings are still public. [2][3]",
    },
    {
      kind: "p",
      text: "We were in the room. Our founder took five of the open-public-hearing slots across the two days and spoke on BPC-157, KPV, TB-500, emideltide, and Semax. Those statements are published here in full, each with the timecode from the FDA's own recording, so any quote can be checked instead of trusted. [4]",
    },
    {
      kind: "quote",
      text: "I don't know if at the end of the day this becomes a policy issue or if this is a regulatory issue. I don't know who ultimately makes the decision, what direction this goes. But being in this room with you all, and caring about the patient, and having some healthy debates back and forth, is I think what we all need on the subject of peptides.",
      attribution: "Mike Stone, Semax session, day 2",
    },
    {
      kind: "h2",
      text: "What hasn't changed",
      id: "unchanged",
    },
    {
      kind: "list",
      items: [
        "No recommended substance became compoundable the day of the vote.",
        "The vote changes nothing about research-grade material, which is still for laboratory research only and is not for human or animal consumption.",
        "The regulatory lanes stay separate. An approved drug, a 503A compounded preparation, a 503B outsourcing facility product, and a research-use compound are four different things. A decision about one says nothing about the others.",
      ],
    },
    {
      kind: "p",
      text: "That last one deserves bluntness, because mixing up those lanes is how people end up buying something they've misunderstood. A committee recommending that a substance may one day be compoundable by a licensed pharmacy for a named patient says nothing about whether that same substance is safe, legal, or smart to buy from an anonymous website.",
    },
    {
      kind: "h2",
      text: "What we're watching",
      id: "watching",
    },
    {
      kind: "p",
      text: "The FDA's response is the next real event, and there's no published deadline for it. Until then, nothing has changed in practice. The gap between what a committee has recommended and what a person can lawfully get is where most of the harm in this category lives.",
    },
  ],

  stance:
    "We argued for the recommendations, and we'd argue for them again. The alternative is where most people already are: buying from strangers, with no certificate, no recourse, and no physician who knows what they're taking. A clearer legal framework is the only way quality becomes the default instead of something you have to hunt for. The faster peptides move into a regulated lane with real manufacturing and real testing behind them, the less this industry needs companies like ours in the form we take today.",

  sources: [
    {
      title: "July 23-24, 2026: Meeting of the Pharmacy Compounding Advisory Committee",
      publisher: "U.S. Food and Drug Administration",
      url: "https://www.fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026",
      type: "FDA",
      date: "23 July 2026",
      note: "The meeting announcement, agenda and materials, including links to both days' webcasts.",
    },
    {
      title:
        "Pharmacy Compounding Advisory Committee; Notice of Meeting; Establishment of a Public Docket; Request for Comments",
      publisher: "Federal Register",
      url: "https://public-inspection.federalregister.gov/2026-07361.pdf",
      type: "Federal Register",
      note: "Establishes docket FDA-2025-N-6895 and the comment deadlines of 9 and 22 July 2026.",
    },
    {
      title: "Docket FDA-2025-N-6895",
      publisher: "Regulations.gov",
      url: "https://www.regulations.gov/docket/FDA-2025-N-6895",
      type: "Regulations.gov",
      note: "The public docket, including ReVia's written comment FDA-2025-N-6895-0071, received 10 June 2026.",
    },
    {
      title: "ReVia in Washington — the five statements in full",
      publisher: "ReVia",
      url: "https://revialife.com/washington",
      type: "Analysis",
      note: "Our own record, transcribed from FDA's webcast with timecodes against each statement.",
    },
    {
      title: "FDA considers adding a dozen peptides to its bulk drug compounding list",
      publisher: "Regulatory Affairs Professionals Society",
      url: "https://www.raps.org/resource/fda-considers-adding-a-dozen-peptides-to-its-bulk-drug-compounding-list.html",
      type: "Analysis",
      note: "Background on how substances reach the 503A bulks list and what the committee's role is.",
    },
  ],
};
