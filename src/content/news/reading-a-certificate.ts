import type { NewsPost } from "@/lib/news";
import { COA_EXAMPLE, COA_RESULTS, COA_SPEC } from "@/lib/coa";

/* ------------------------------------------------------------------ */
/*  Written from one document this site holds: COA #33593. Every        */
/*  reading quoted is transcribed in src/lib/coa.ts, which is the       */
/*  authority check-claims itself reads the purity specification from.  */
/*  No external source was needed and none is cited beyond the          */
/*  certificate and the laboratory's own verification portal.           */
/* ------------------------------------------------------------------ */

export const post: NewsPost = {
  slug: "reading-a-certificate",
  title: "How to read a certificate of analysis, using one of ours",
  summary:
    "A certificate with one number on it is decoration. A real one names the lot, the method, the limits, and the results, and lets you pull the same document from the lab yourself.",
  published: "2026-09-18",
  category: "Manufacturing & Testing",
  status: "Evergreen. The example is a real certificate on a real lot.",
  stance:
    "The number on a website is a spec. The number on a certificate is a measurement of one lot. Anyone selling you a peptide should be able to hand you the second, and most of what looks like proof in this category is the first.",
  body: [
    {
      kind: "p",
      text:
        "Every supplier in this category says its material is tested. Almost none of them will show you the test. That gap is where the whole problem lives, and it closes the moment you ask for the document instead of the adjective.",
    },
    { kind: "h2", text: "What a certificate has to name" },
    {
      kind: "p",
      text:
        "A certificate is evidence about one lot of material, and it's only evidence if it says which lot. Everything else on it is context: who measured, by what method, against what limit, and what they found.",
    },
    {
      kind: "list",
      items: [
        "The lot code, which should also be on the vial.",
        "The lab, by name.",
        "The method, so you know what the number measures.",
        "The limit, so you know what counts as a pass.",
        "The result, so you know what this lot actually did.",
        "The dates the sample arrived and was analyzed.",
        "A person's signature.",
      ],
    },
    { kind: "h2", text: "One of ours, line by line" },
    {
      kind: "p",
      text:
        `Certificate #${COA_EXAMPLE.number} covers ${COA_EXAMPLE.product}, lot ${COA_EXAMPLE.lotCode}. The sample reached the lab on ${COA_EXAMPLE.received} and was analyzed on ${COA_EXAMPLE.analysed}.`,
    },
    {
      kind: "table",
      caption: `COA #${COA_EXAMPLE.number}, transcribed.`,
      rows: [["Line", "What it says on this lot"], ...COA_EXAMPLE.rows.map((r) => [r[0], r[1]])],
    },
    {
      kind: "p",
      text:
        `Four results, because that's what this certificate reports: ${COA_RESULTS.map((r) => r.label.toLowerCase()).join(", ")}. A longer list of assays doesn't automatically make a better document. It's only better if the lab actually ran them, and the certificate is where you find that out.`,
    },
    { kind: "h2", text: "Which number actually matters" },
    {
      kind: "p",
      text:
        `The purity reading on this lot is a measurement against a ${COA_SPEC.puritySpec} spec. It's a fact about this lot and nothing else. A headline number on a website, averaged across lots nobody names, is a different kind of claim. If a supplier quotes an average, ask which lots it averages.`,
    },
    {
      kind: "callout",
      title: "Quantity is the one people skip",
      text:
        "Purity tells you what fraction of the material is the named compound. Quantity tells you how much of it is in the vial. A vial can be pure and underfilled, and only one of those two numbers will tell you.",
    },
    { kind: "h2", text: "Verify it without asking us" },
    {
      kind: "p",
      text:
        `The certificate has an access code. Type it into ${COA_SPEC.lab}'s verification page and the lab returns the same document from its own records. A certificate you can only get from the seller is a PDF. A certificate you can pull from the lab is a record.`,
    },
    {
      kind: "p",
      text:
        "Apply that test to anyone, including us. If the document can't be retrieved independently, all it's told you is what the seller wanted to say.",
    },
  ],
  sources: [
    {
      title: `Certificate of Analysis #${COA_EXAMPLE.number} — ${COA_EXAMPLE.product}, lot ${COA_EXAMPLE.lotCode}`,
      publisher: COA_SPEC.lab,
      url: COA_SPEC.verifyUrl,
      type: "Analysis",
      date: COA_EXAMPLE.analysed,
      note: `Signed ${COA_EXAMPLE.chemist}; produced ${COA_EXAMPLE.produced}. The readings quoted above are transcribed from it.`,
    },
    {
      title: `${COA_SPEC.lab} certificate verification`,
      publisher: COA_SPEC.lab,
      url: COA_SPEC.verifyUrl,
      type: "Analysis",
      note: "Where an access code returns the certificate from the laboratory's own database.",
    },
  ],
  related: ["pcac-july-2026"],
};
