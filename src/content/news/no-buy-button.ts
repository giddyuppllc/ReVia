import type { NewsPost } from "@/lib/news";
import { REVIA_NETWORK } from "@/lib/partner";

/* ------------------------------------------------------------------ */
/*  About this site's own structure, which is the one subject it can    */
/*  write about without citing anybody. The sources are the site        */
/*  itself and the group it belongs to.                                 */
/* ------------------------------------------------------------------ */

export const post: NewsPost = {
  slug: "no-buy-button",
  title: "Why there is no buy button on this site",
  summary:
    "ReVia Life publishes and sells nothing. That is a structural decision, not a stage we are passing through — and it is the only reason anything here is worth reading.",
  published: "2026-09-18",
  category: "Compounding",
  status: "Current structure. ReVia Life takes no orders and no commission.",
  stance:
    "The day a buy button appears here, every article on the site becomes an advertisement retrospectively. It is cheaper to keep the button off than to spend years earning back the doubt.",
  body: [
    {
      kind: "p",
      text:
        "This site carries a compound library, a set of regulatory explainers and the full text of five statements its founder made to a federal advisory committee. It does not sell anything, and it does not take a commission on anything sold elsewhere.",
    },
    {
      kind: "p",
      text:
        "That is unusual enough to be worth explaining, because the obvious question is what the site is for.",
    },
    { kind: "h2", text: "What a buy button does to a paragraph" },
    {
      kind: "p",
      text:
        "A guide to evaluating a supplier, published by a supplier, on a page with an order form, is an advertisement. It may be an accurate advertisement — the advice can be sound and the standard genuinely high — but a reader cannot tell the difference from the outside, and is right not to try.",
    },
    {
      kind: "p",
      text:
        "The problem is not that the advice becomes false. It is that it becomes unfalsifiable: every recommendation happens to favour the thing being sold on the same page, and there is no version of the page where it would not have.",
    },
    { kind: "h2", text: "So who does sell" },
    {
      kind: "p",
      text:
        "Compounds are supplied by i2b Health, which is a separate company with its own catalogue, terms and checkout. The other properties in the group serve audiences with different rules — trade, practitioners, consumables — and none of them is this one.",
    },
    {
      kind: "list",
      items: REVIA_NETWORK.map((s) => `${s.name} — ${s.audience.toLowerCase()}.`),
    },
    {
      kind: "p",
      text:
        "Supplies sit on their own site deliberately rather than by accident. A peptide sold beside a syringe reads as a product intended for human use, whatever the label says, and the separation is there because of how that is read rather than because of how the catalogue is organised.",
    },
    { kind: "h2", text: "What that costs us" },
    {
      kind: "p",
      text:
        "A site that sells nothing has no revenue to point at and no conversion rate to optimise. Every link out of here to i2b is a reader we stop measuring. That is the trade, and it is worth making, because the alternative is a library nobody has a reason to believe.",
    },
    {
      kind: "callout",
      title: "How this site is paid for",
      text:
        "ReVia Life is published by ReVia LLC, which also supplies the compounds sold by i2b Health and through ReVia Wholesale. We say so on the About page, above the fold. A resource that hides its funding is not a resource.",
    },
  ],
  sources: [
    {
      title: "About ReVia Life",
      publisher: "ReVia Life",
      url: "https://revialife.com/about",
      type: "Analysis",
      note: "Carries the funding disclosure quoted above.",
    },
    {
      title: "The group",
      publisher: "ReVia Life",
      url: "https://revialife.com/#the-group",
      type: "Analysis",
      note: "Which property serves which audience, and under which rules.",
    },
  ],
  related: ["pcac-july-2026", "reading-a-certificate"],
};
