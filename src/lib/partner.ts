/* ------------------------------------------------------------------ */
/*  The ReVia network                                                  */
/*                                                                     */
/*  revialife.com sells nothing. It showcases a few compounds, carries */
/*  the education and the news, and acts as the portal to every other  */
/*  site in the ecosystem. This module is the one place those          */
/*  destinations are defined — there is deliberately no second URL     */
/*  literal anywhere in src/, because a URL typed twice is the one     */
/*  that drifts when a domain moves.                                   */
/*                                                                     */
/*  The two commerce destinations serve different buyers and must      */
/*  never be swapped:                                                  */
/*                                                                     */
/*    D2C — i2b, the exclusive research partner. Sells direct to       */
/*          consumers. Where an individual researcher goes.            */
/*                                                                     */
/*    B2B — ReVia Wholesale. Trade supply ONLY, no D2C at all, so      */
/*          sending an individual there is a dead end for them.        */
/* ------------------------------------------------------------------ */

/* ---------------------------- D2C: i2b ---------------------------- */

/**
 * i2b's public origin, e.g. "https://i2bhealth.com" — no trailing slash.
 *
 * NOT YET SET. i2b has no live domain at time of writing (no candidate
 * spelling resolves), so this is null and every D2C control falls back to
 * /contact rather than rendering a link that goes nowhere.
 *
 * To switch the whole site over, set this one constant — or the
 * NEXT_PUBLIC_I2B_ORIGIN environment variable, which wins if present.
 */
const I2B_ORIGIN_FALLBACK: string | null = null;

const i2bOrigin: string | null =
  process.env.NEXT_PUBLIC_I2B_ORIGIN?.replace(/\/+$/, "") || I2B_ORIGIN_FALLBACK;

export const D2C = {
  name: "i2b",
  origin: i2bOrigin,
  isLive: i2bOrigin !== null,
} as const;

/** Where a consumer "Shop" control goes. Falls back to /contact until i2b has a domain. */
export function d2cUrl(): string {
  return D2C.origin ?? "/contact";
}

/* ----------------------- B2B: ReVia Wholesale ---------------------- */

export const B2B = {
  name: "ReVia Wholesale",
  origin: "https://reviawholesale.com",
} as const;

/** Paths verified live on the wholesale site. It publishes no policy pages. */
export const B2B_PATHS = {
  home: "/",
  about: "/about",
  wholesale: "/partners/wholesale",
  privateLabel: "/partners/private-label",
  signIn: "/signin",
} as const;

export type B2BPath = keyof typeof B2B_PATHS;

export function b2bUrl(path: B2BPath = "home"): string {
  return `${B2B.origin}${B2B_PATHS[path]}`;
}

/* --------------------------- The network --------------------------- */

export interface NetworkSite {
  id: string;
  name: string;
  /** What this site is for, in one line. */
  tagline: string;
  /** Who it serves — used as the card's eyebrow. */
  audience: string;
  /** Null when the site has no public address yet; the card renders unlinked. */
  url: string | null;
  /** True while the address is a preview/staging domain rather than a brand one. */
  preview?: boolean;
}

/**
 * Every sibling site, in the order they should be presented.
 *
 * Addresses were taken from each project rather than guessed: reviawell.com
 * and reviawholesale.com resolve and serve; ReVia Supply and ReVia Providers
 * are still on their Vercel preview domains, which is why they carry
 * `preview: true`. i2b has no address at all yet.
 */
export const REVIA_NETWORK: NetworkSite[] = [
  {
    id: "i2b",
    name: "i2b",
    audience: "For researchers",
    tagline: "Our exclusive research partner. Order compounds direct.",
    url: D2C.origin,
  },
  {
    id: "wholesale",
    name: "ReVia Wholesale",
    audience: "For business & brands",
    tagline: "Trade supply, bulk pricing and private label for clinics, brands and distributors.",
    url: B2B.origin,
  },
  {
    id: "well",
    name: "ReViaWell",
    audience: "For everyone",
    tagline: "Independent education — compound guides, sourcing standards and supplier evaluation.",
    url: "https://reviawell.com",
  },
  {
    id: "supply",
    name: "ReVia Supply",
    audience: "For the bench",
    tagline: "Reconstitution and application supplies — bacteriostatic water, syringes and kit.",
    url: "https://revia-supply.vercel.app",
    preview: true,
  },
  {
    id: "providers",
    name: "ReVia Providers",
    audience: "For practitioners",
    tagline: "The practitioner portal, for clinics running a peptide programme.",
    url: "https://revia-providers.vercel.app",
    preview: true,
  },
];

/* ----------------------------- Shared ------------------------------ */

/** Attributes every outbound link carries. */
export const PARTNER_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
