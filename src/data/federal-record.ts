/* ------------------------------------------------------------------ */
/*  ReVia on the federal record                                        */
/*                                                                     */
/*  Mike Stone's five statements to the FDA Pharmacy Compounding       */
/*  Advisory Committee, 23-24 July 2026.                               */
/*                                                                     */
/*  GENERATED from the source transcript document, not retyped. The    */
/*  statements are a verbatim public record, and hand-copying them is  */
/*  how a quote quietly acquires a word nobody said - which is exactly */
/*  what happened to the spliced version noted in CORRECTIONS below.   */
/*                                                                     */
/*  Provenance: transcribed from FDA's own webcast recordings          */
/*  (auto-generated captions), then cleaned - caption misspellings     */
/*  fixed, stutters removed, nothing added or reordered. FDA had not   */
/*  posted an official transcript as of 12 September 2026; check       */
/*  quotes against it when it appears.                                 */
/* ------------------------------------------------------------------ */

export interface Statement {
  /** Order spoken across the two days. */
  n: number;
  /** The bulk substance under review in that session. */
  compound: string;
  slug: string;
  day: number;
  date: string;
  speakerSlot: number;
  slotMinutes: number;
  /** Webcast timecode, so any quote can be heard in the original. */
  from: string;
  to: string;
  /** The chair's introduction, and who followed. */
  note: string;
  /**
   * How the committee voted on that substance, after the public hearing.
   *
   * PROVENANCE: secondary. These tallies come from the brand brief's table,
   * which cites NCPA, Holland & Knight, RAPS and The Epoch Times — not FDA's
   * own minutes, which had not been posted. `pcac-july-2026` deliberately
   * withheld them for exactly this reason, and that caution stands: they are
   * recorded here so a page CAN use them, but anything that renders them should
   * say where they came from, or wait for the minutes.
   *
   * The outcome is not the statement, and is recorded here so a page can say
   * what happened without implying Mike's remarks caused it. "Recommended"
   * means recommended to the FDA — a recommendation is advisory, and nothing
   * becomes compoundable until rulemaking ends.
   */
  vote: { tally: string; outcome: "recommended" | "not recommended" };
  /** Verbatim, one string per spoken paragraph. */
  body: string[];
}

export const HEARING = {
  committee: "FDA Pharmacy Compounding Advisory Committee",
  dates: "23-24 July 2026",
  location: "FDA White Oak Campus, Silver Spring, Maryland",
  docket: "FDA-2025-N-6895",
  /** Mike Stone's written comment to the docket. */
  comment: {
    id: "FDA-2025-N-6895-0071",
    received: "10 June 2026",
    url: "https://www.regulations.gov/docket/FDA-2025-N-6895",
  },
  webcasts: [
    { day: 1, date: "23 July 2026", url: "https://youtube.com/live/DhDC0DAYdBI" },
    { day: 2, date: "24 July 2026", url: "https://youtube.com/live/xXM5ecHxlMU" },
  ],
  meetingPage:
    "https://www.fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026",
  /** Slated for seven open-public-hearing slots; used five. */
  slotsOffered: 7,
} as const;

export const STATEMENTS: Statement[] = [
  {
    n: 1,
    compound: "BPC-157",
    slug: "bpc-157",
    vote: { tally: "8-6-1", outcome: "recommended" },
    day: 1,
    date: "July 23, 2026",
    speakerSlot: 2,
    slotMinutes: 5,
    from: "52:39",
    to: "56:48",
    note: "Introduced by the chair: \"Speaker number two, please state your name and your organization affiliation if you wish to. And you have 5 minutes.\" Followed by Dr. Peter Lurie, Center for Science in the Public Interest.",
    body: [
      "Good morning, everybody. My name is Mike Stone. I'd like to thank the staff for the excellent report that they did and the recommendations. I'm sure that's not easy. I'd like to thank the panel for your time and your effort in this issue. I don't envy anyone's job.",
      "I come from starting a company called ReVia. I'm a peptide supplier. Some of you might consider that the gray market. It is. But more importantly, I come here as somebody who got sick. Somebody who was introduced to peptides by some of the world's leading physicians at an institution in America. Somebody who came to believe that they saved my life. Somebody who made some bad choices in buying stuff overseas, unregulated, been scammed financially. And somebody who decided that if I was going to put something like this in my body, I wanted to know exactly what it is. And more importantly, if anybody in my family was going to put something like this in their body, that they would know what it is.",
      "See, up until several years ago, I was an entrepreneur and an Ironman triathlete. And I was diagnosed with a degenerative neurological disease. We tried conventional medicine. It didn't work. I was wasting. I went from 180 pounds to 125 pounds and I was bedridden. One of the doctors suggested I explore peptides. One of the peptides I explored was BPC-157. I have come to believe that that has been instrumental in giving me some type of life back. I still have my days where I'm in bed. I still have days where I can't get out and walk half a mile. I have days. Last week, my wife and I were able to hike four miles in Colorado.",
      "But regarding BPC-157, as all of you know, it's one of the more popular peptides out there. And the staff has concluded — which I agree with, with their scope and their direction — their analysis is absolutely right. The problem is, even if the compounding pharmacies are given the authority to do this, that's not going to eliminate the problem. As we've seen, let's look at GLP-1. Even though that's available from a doctor who can prescribe it and it's manufactured in US FDA-registered cGMP manufacturing facilities — I don't know what the numbers are, they're hard to find — but how many people are going online and buying it because it's cheaper and it's easier to access?",
      "So I'm going to use the same analogy with BPC-157. People have already made the decision that they're going to do it. They're doing their research. There's limited in-human clinical data that proves it works or it doesn't work. What there is, is an online presence that's full of misinformation. It's full of influencers who are trying to sell a particular product that they're representing. It's full of suppliers like me who are trying to get you to buy something from me.",
      "So what I did, and which I encourage the panel to think about, is I took it upon myself to find a United States-based manufacturer who's FDA registered, who's cGMP compliant, that I can trace. It's not a fake COA. I can go there. I can shake hands with the people. I can walk in the lab. And that's the issue I want to bring up about BPC-157: no matter what decision is made here, it's not going to eliminate the gray market. So the bigger question is how do we address a market where potentially millions of people are already using it, and the staff and the panel is working in a limited definition. I don't know the answer to that. That's up to you guys. That's beyond my pay grade.",
      "So I'd like to leave with this. I'm going to continue using it. I gave myself an injection this morning. I believe in it, and I'm going to get it whichever means possible I can. Thank you.",
    ],
  },
  {
    n: 2,
    compound: "KPV",
    slug: "kpv",
    vote: { tally: "8-6-1", outcome: "recommended" },
    day: 1,
    date: "July 23, 2026",
    speakerSlot: 1,
    slotMinutes: 3,
    from: "5:17:10",
    to: "5:20:35",
    note: "\"We will proceed with speaker number one. Please state your name and any organization you may be representing for the record. And you have three minutes.\"",
    body: [
      "Good afternoon. My name is Mike Stone. I'm with ReVia. I'm a peptide supplier and, as I mentioned in my first talk, yes, I'm in the gray market. First of all, I'd like to thank the staff and the committee. What a tedious job you've all done. I don't envy your position one bit. It's an incredible, incredible process to watch firsthand.",
      "One thing keeps going through my mind as I've listened to everybody today: are we dealing with policy issues or regulatory issues? And I'm trying to get a crash course on what's the difference between a 503A and an FDA-registered cGMP facility, and I still don't have quite the clarity that I need. But somebody asked me what did I think of what just happened, and I said, I think no matter what happened, we just opened Pandora's box, because everybody's going to run and try to find the quickest product they can and the cheapest product they can, even though we're months away from any final decision or implementation.",
      "But speaking specifically about KPV, I don't have any personal experience with it, other than I know some women who like to mix it with GHK and Snap-8 and put it in their daily moisturizer and put it on their face, and they swear it's a heck of a lot cheaper than plastic surgery.",
      "One thing I've heard throughout the day is we need more data. We need more evidence. And I completely agree. No matter what direction this goes, if I'm a consumer, I need more data — more than just animal data. If I'm on the panel, I need more data to make an educated decision. But the question I have, and what's become evident with KPV, is this represents the evidence gap between the market demand. KPV is obviously of interest enough because we're sitting here talking about it. I'm not quite sure what the numbers are. I found one study that there's over 66 manufacturers or suppliers out there, but I can't validate that.",
      "So the question is, where I go with this evidence gap: it'd be great to have more data, but who's going to pay for it? Large pharmaceuticals is not going to take KPV. It's a generic. How are they going to make money? They have shareholders they need to be accountable to. We all know that's the case, and that's not a criticism or rip on them. That's just reality. So even though there's interest in KPV and we're sitting here discussing it, we can't just say we need more studies. I think we need to do something about it. And I think by moving it to an arena where it can be manufactured in compounding is a good thing, because at least that opens up a door where we can start to collect some data — data from the doctors, data from the users, data from the manufacturers and data from the emergency rooms.",
      "So with that said, I would encourage the committee to consider adding this and approving this in their recommendation to the FDA commissioner for approval. Thank you.",
    ],
  },
  {
    n: 3,
    compound: "TB-500",
    slug: "tb-500",
    vote: { tally: "8-6-1", outcome: "recommended" },
    day: 1,
    date: "July 23, 2026",
    speakerSlot: 2,
    slotMinutes: 3,
    from: "8:21:42",
    to: "8:24:12",
    note: "\"Speaker number two, please state your name, any affiliations, and you have three minutes.\" The chair afterward: \"Thank you for abiding by the times. Very much appreciated.\" Followed by Hims's medical officer.",
    body: [
      "Good afternoon, ladies and gentlemen. My name is Mike Stone. Again, this will probably be the last time you'll see me today. I'd like to share with you a personal story about TB-500. It taught me two essential things. It taught me to look at research, and it taught me to look at patterns.",
      "When I first started peptides, I started with BPC and I thought it was the greatest thing since sliced bread. About a month later, I decided to add TB-500. I had a horrible reaction. I had hot flashes. I had nausea. I had welts at the site of injection. And it occurred to me, maybe it has something to do with the combination. Maybe it has something to do with the manufacturer. So I ordered another vial from another gray market vendor. I got that vial — no reaction, no negative reaction whatsoever. And so I learned that every manufacturer out there, every supplier, is different. Everyone carries certain risks, no matter how credible they are, no matter how good the reviews are on Facebook, Instagram, or Reddit.",
      "The second thing it taught me: when it comes to peptides, I'm not looking at a specific peptide. I'm looking at stacks. I'm doing my research and I'm looking at why BPC and TB are combined to be what's known as the Wolverine stack. How does it play off each other? How does it feed each other? So I've had the benefit of contributing thousands of hours to researching different manufacturers and different compounds. Why does CJC and Ipamorelin seem to work over other compounds, what have you.",
      "And I'll finish with this. Over the break, I was asked, since I'm a supplier and I supply practitioners and I supply the gray market: if these peptides are approved, what do I think about that, and what's that do to my business? I said, I hope to God they are approved so I can shut the doors. Because I didn't pick this business. This business picked me. I'm not in this for the money. I'm in this to get on my high horse and preach safety — do your research — and for the people who are going to inject themselves to know more. Isn't their body worth it?",
      "So if there's anything I can do, any message I can carry that is going to help one person to not make the same mistakes I did, I'll give up anything to do that. Thank you.",
    ],
  },
  {
    n: 4,
    compound: "Emideltide (DSIP)",
    slug: "emideltide-dsip",
    vote: { tally: "6-7-1", outcome: "not recommended" },
    day: 2,
    date: "July 24, 2026",
    speakerSlot: 2,
    slotMinutes: 4,
    from: "1:17:10",
    to: "1:19:26",
    note: "\"Speaker number two, please state your name and any affiliations. And you have exactly four minutes.\" Followed by John Hertig, Collaborative for Evidence-Based Medicines.",
    body: [
      "Good morning, ladies and gentlemen of the staff and the committee. Thank you again for having me. My name is Mike Stone. I'm founder and CEO of a peptide supply company called ReVia Wellness.",
      "Well, I just realized I'm either anecdotal or a classic example of placebo effect, because I use DSIP, having a neurological disorder. I can't shut my brain off. I can't sleep. I've tried, under the direct care of a psychiatrist, numerous sleep medications, some habit-forming and some not. Nothing has worked. And again, at the suggestion of a wellness doctor: explore peptides. He didn't tell me to go take them. He told me to explore them.",
      "So what do I do? I hop on the internet. I go to Joe Rogan, chat on Reddit, and I ask people, \"Where do you get your stuff?\" So without a doctor's direct involvement, or without a compound coming from a US manufacturer, I'm rolling the dice every single time I buy.",
      "So what I hear in this room is one side seems to be suggesting that I and my doctor cannot make a decision that's best for me, and the other side's suggesting that I and my doctor can make the best decision for me. Left to my own devices, I'm rolling the dice. It's just that simple.",
      "So I, as somebody who does use this and other compounds we've discussed, and will continue using them, would much rather do this with the input and the guidance of a licensed physician who at least knows what the heck I'm doing, what I'm putting in my body, and can watch my blood work — and then I can get it from a US manufacturer pharmacy. I love those risks a hell of a lot better than buying stuff on the internet. That's negligence. That's negligence on my part to me and my family, but that's what I'm left with when I'm trying to find a quality of life that I don't have. So, sorry I got off track a little bit this morning, and I appreciate your time. Thank you.",
    ],
  },
  {
    n: 5,
    compound: "Semax",
    slug: "semax",
    vote: { tally: "8-5-1", outcome: "recommended" },
    day: 2,
    date: "July 24, 2026",
    speakerSlot: 1,
    slotMinutes: 4,
    from: "6:12:03",
    to: "6:15:05",
    note: "\"We will invite speaker number one to the podium. Please, if you're in the room — yeah, there you are. Please remember to state your name, any affiliations for the record, and you have four minutes.\"",
    body: [
      "My name is Mike Stone. I am founder and CEO of a company called ReVia Wellness. I am a supplier of peptides to practitioners and the gray market. Ladies and gentlemen of the committee and the staff, thank you so much. Your commitment, your time, your attention, your patience has been incredible.",
      "Finally we get to talk about a peptide called Semax. Aren't these really why we're here — a vial of Semax right here? But that's not why we're here. There's a bigger picture at play. Some might think it's about politics, others think it's about financials. Some of you might call it a conspiracy theory. But I'll tell you one thing before I go on. It's become apparent to me that everybody in this room is united in the sense that we all care about the patient, regardless of what our position is. And for that, I am entirely grateful to have experienced this with you.",
      "As I've sat here and thought about this, the one word that's continued to pop into my head has been innovation. And innovation in pharmaceuticals and biotechnology is moving at the speed of light. And our society is so fixated right now on health, wellness, longevity, anti-aging and biomaxxing, and they're getting their data quicker than we can say Timbuktu. America, in my opinion, is the best damn country when it comes to pharmaceutical standards and manufacturing and innovation, creativity, and patient safety.",
      "This decision that you guys are making today and the recommendations that the staff has come up with — I don't think anybody's taking it lightly. And who knows if it's the cure-all for all the problems around peptides that are out there. But what I do know is, regardless, it's a step in the right direction. It's a step in trying to establish patient safety and manufacturing regulations. You've heard my story before. I'm not going to go on about that — adverse effects and this and that.",
      "So I'd like to leave the committee with this. I don't know if at the end of the day this becomes a policy issue or if this is a regulatory issue. I don't know who ultimately makes the decision, what direction this goes. But being in this room with you all, and caring about the patient, and having some healthy debates back and forth, is I think what we all need on the subject of peptides. While I don't agree with a lot of you, I certainly respect you. And so for that, thank you for having me.",
    ],
  },
];

/** How many times he spoke. Derived, never typed. */
export const STATEMENT_COUNT = STATEMENTS.length;

/**
 * Corrections the source document makes about other versions of this
 * record. Published deliberately: a page that shows its own working is
 * worth more than one that asks to be believed.
 */
export const CORRECTIONS: string[] = [
  "The captions show no Mike Stone appearance in the MOTS-c open public hearing (Day 1, 4:40 p.m. session) or the Epitalon open public hearing (Day 2, 11:15 a.m. session). In the TB-500 session he said it would \"probably be the last time you'll see me today.\"",
  "A transcript circulating that runs 52:47–1:02:33 and has him describing \"products that come back to us\" does not match the recording: the BPC-157 slot ended at 56:48 and the next speaker began at 56:59; that text splices the TB-500 closing lines onto a BPC-157 speech and adds sentences he did not say.",
  "His written comment to the docket (Regulations.gov FDA-2025-N-6895-0071, received June 10, 2026) is reproduced in full in the Source Dossier, Section 6.6.",
];


/* ------------------------------------------------------------------ */
/*  The pull quote                                                     */
/*                                                                     */
/*  One passage, carried to the home page. It is the whole argument     */
/*  this company makes, said by its founder, on the federal record,     */
/*  with a timecode anyone can check.                                   */
/*                                                                     */
/*  It MUST be a contiguous run of the body, never a splice. A spliced  */
/*  version of this same testimony is what CORRECTIONS above exists to  */
/*  record — quotes acquire words nobody said the moment you join two   */
/*  halves with an ellipsis. `assertPullQuote` below fails the build if */
/*  the text here is not found verbatim inside a single paragraph.      */
/* ------------------------------------------------------------------ */

export const PULL_QUOTE = {
  /** Index into STATEMENTS. */
  n: 1,
  /*
   * The thesis sentence, and nothing around it.
   *
   * The first version carried the whole passage — 424 characters, five
   * sentences. Set at display size it filled a viewport on its own, which made
   * the page a wall rather than an opening, and a reader has to finish a
   * paragraph before reaching the point. This is the point. The passage it comes
   * from is on /washington in full, where the length is the right length.
   */
  text:
    "And somebody who decided that if I was going to put something like this in my body, I wanted to know exactly what it is.",
} as const;

/** Throws at module load if the pull quote is not verbatim and contiguous. */
function assertPullQuote(): void {
  const st = STATEMENTS.find((s) => s.n === PULL_QUOTE.n);
  if (!st) throw new Error(`PULL_QUOTE references statement ${PULL_QUOTE.n}, which does not exist`);
  const contiguous = st.body.some((para) => para.includes(PULL_QUOTE.text));
  if (!contiguous) {
    throw new Error(
      "PULL_QUOTE is not a contiguous run of any paragraph in statement " +
        `${PULL_QUOTE.n}. It has been edited, reordered or spliced — which is ` +
        "exactly what CORRECTIONS records happening to this testimony before.",
    );
  }
}
assertPullQuote();
