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
    "We publish here and sell nothing. That's how the site is built, and it's the only reason anything on it is worth reading.",
  published: "2026-09-18",
  category: "Compounding",
  status: "Current structure. ReVia Life takes no orders and no commissions.",
  stance:
    "The day a buy button shows up on this site, every article on it becomes an ad, retroactively. It's a lot cheaper to keep the button off than to spend years earning back the doubt.",
  body: [
    {
      kind: "p",
      text:
        "This site has a compound library, a set of regulatory explainers, and the full text of five statements our founder made to a federal advisory committee. It doesn't sell anything, and it doesn't take a commission on anything sold anywhere else.",
    },
    {
      kind: "p",
      text:
        "That's unusual enough to be worth explaining, because the obvious question is what the site is for.",
    },
    { kind: "h2", text: "What a buy button does to a paragraph" },
    {
      kind: "p",
      text:
        "A guide to choosing a supplier, written by a supplier, on a page with an order form, is an ad. It might be an accurate ad. The advice might be sound and the standard might be high. But you can't tell from the outside, and you're right not to try.",
    },
    {
      kind: "p",
      text:
        "The advice doesn't have to be wrong to be a problem. The problem is that every recommendation on the page happens to favor the thing being sold on that page, and there's no version of the page where it wouldn't.",
    },
    { kind: "h2", text: "So who does sell" },
    {
      kind: "p",
      text:
        "Compounds come from i2b Health, a separate company with its own catalog, terms, and checkout. The other properties in the group each serve a different audience under different rules: trade, practitioners, consumables. None of them is this site.",
    },
    {
      kind: "list",
      items: REVIA_NETWORK.map((s) => `${s.name} — ${s.audience.toLowerCase()}.`),
    },
    {
      kind: "p",
      text:
        "Supplies get their own site on purpose. A peptide listed next to a syringe reads like a product meant for human use, whatever the label says. We separated them because of how that reads.",
    },
    { kind: "h2", text: "What that costs us" },
    {
      kind: "p",
      text:
        "A site that sells nothing has no revenue to point to and no conversion rate to optimize. Every link from here to i2b Health is a reader we stop measuring. That's the trade, and it's worth making, because the alternative is a library nobody has a reason to believe.",
    },
    {
      kind: "callout",
      title: "How this site is paid for",
      text:
        "ReVia LLC publishes ReVia Life. ReVia LLC also supplies the compounds sold by i2b Health and through ReVia Wholesale. We say so on the About page, at the top. A resource that hides its funding isn't a resource.",
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
