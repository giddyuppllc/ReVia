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
 * i2b's public origin — no trailing slash.
 *
 * Set 2026-09-15. It was null because no candidate spelling of a brand domain
 * resolved, which was true then and is still true: i2b has no BRAND domain. It
 * does now have a live public address, and it serves the full storefront —
 * checked, not assumed, before this was set.
 *
 * A preview address rather than a brand one, so i2b is marked `preview: true`
 * in REVIA_NETWORK below exactly as ReVia Supply and ReVia Providers are. The
 * alternative was leaving every consumer buy control pointing at /contact on a
 * site whose entire job is to be the portal, which is a worse answer than a
 * working Vercel URL flagged as temporary.
 *
 * To switch the whole site over when the brand domain lands, change this one
 * constant — or set NEXT_PUBLIC_I2B_ORIGIN, which wins if present.
 */
// i2b moved to its own domain on Hetzner, 21 Sep (it sells; revialife does not).
const I2B_ORIGIN_FALLBACK: string | null = "https://i2bhealth.com";

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

/* ------------------------ Guides: ReViaWell ----------------------- */

/**
 * ReViaWell, the guides property — and the third destination the home page
 * router offers.
 *
 * It was already in REVIA_NETWORK below as a bare string. Lifting it into a
 * constant is not tidying: the practitioner route is now linked from the top of
 * the home page as well as from the directory, and this module's whole premise
 * is that a URL typed twice is the one that drifts when a domain moves.
 */
export const WELL = {
  name: "ReViaWell",
  origin: "https://reviawell.com",
} as const;

/** Paths checked live rather than assumed — both answered 200 on 2026-09-22. */
export const WELL_PATHS = {
  home: "/",
  practitioner: "/practitioner",
} as const;

export type WellPath = keyof typeof WELL_PATHS;

export function wellUrl(path: WellPath = "home"): string {
  return `${WELL.origin}${WELL_PATHS[path]}`;
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
 * and reviawholesale.com resolve and serve; i2b, ReVia Supply and ReVia
 * Providers are on Vercel preview domains, which is why they carry
 * `preview: true`.
 */
export const REVIA_NETWORK: NetworkSite[] = [
  {
    id: "i2b",
    name: "i2b Health",
    audience: "Individual researchers",
    tagline:
      "The only ReVia property that sells single vials. Every product page links to its certificate, and the banner reads Professional Use Only.",
    url: D2C.origin,
    preview: true,
  },
  {
    id: "wholesale",
    name: "ReVia Wholesale",
    audience: "Businesses and brands",
    tagline:
      "Bulk, private label, and a partner API with webhooks. Every order is reviewed and approved before it goes to fulfillment.",
    url: B2B.origin,
  },
  {
    id: "providers",
    name: "ReVia Providers",
    audience: "Clinics and prescribers",
    tagline:
      "Professional pricing for qualified accounts, behind a login. A referral code from a practitioner unlocks the price list.",
    url: "https://revia-providers.vercel.app",
    preview: true,
  },
  {
    id: "cosmetics",
    name: "ReVia Cosmetics",
    audience: "Consumers",
    tagline:
      "ReVia-branded skincare, sold direct to consumers. The only line in the group without a research designation.",
    url: null,
  },
  {
    id: "supply",
    name: "ReVia Supply",
    audience: "Anyone reconstituting",
    tagline:
      "Syringes, bacteriostatic water, and acetic acid, on their own site on purpose. A peptide listed next to a syringe reads like it's meant for human use.",
    url: "https://revia-supply.vercel.app",
    preview: true,
  },
  {
    id: "well",
    name: WELL.name,
    audience: "Buyers doing their homework",
    tagline:
      "Buyer's guides: how to vet a supplier, how to read a certificate, and where the FDA process stands.",
    url: WELL.origin,
  },
];

/* ----------------------------- Shared ------------------------------ */

/** Attributes every outbound link carries. */
export const PARTNER_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
