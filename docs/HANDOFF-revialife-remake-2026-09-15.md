# HANDOFF — revialife remake WIP (from Edward's other machine, 2026-09-15)

This branch preserves work-in-progress that existed **only uncommitted** on one
machine. It was last edited 2026-09-12 and has **not** been built, tested or
deployed. Treat it as a starting point to review, not a finished change.

- Branched from `a702dbc` ("Stop the city pages announcing that they target
  local search intent"), which is already in `origin/prod-snapshot-20260611`.
- Contains 38 changed/deleted tracked files and 17 new files.
- **Nothing here is on production.** `revialife.com` deploys from
  `prod-snapshot-20260611`, not this branch.

## What the WIP does

- **Removes commerce from revialife**: deletes `api/cart`, `checkout/*`,
  `AddToCart`, `CartDrawer`, `TrustBadges`, `store/cart.ts`. Shop, product and
  stack pages are edited accordingly.
- **Adds**: `/news` + `/news/[slug]` (`src/content/news/`, `src/lib/news.ts`,
  first post `pcac-july-2026`), `/washington` (`src/data/federal-record.ts`),
  `PartnerShopButton`, `ReviaNetwork`, `VariantPicker`, `Stat` (`src/lib/stats.ts`),
  `src/lib/coa.ts`, `src/lib/partner.ts`, `scripts/check-claims.ts`, `faq-data.ts`.
- **Claims**: every `>99%` purity claim changed to `>98%`, and assay claims not
  on any COA removed (see below).

## Rulings and facts behind it (Edward, 2026-09-07 → 09-11)

**Who sells to whom — never collapse these into one link:**

| Site | Sells to |
|---|---|
| i2b (no domain yet) | **D2C** — consumer buy intent goes here |
| reviawholesale.com | **B2B only**, no D2C |
| **revialife.com** | **sells nothing** — showcase a few compounds; portal + education + news |
| reviawell.com | education, no commerce |
| revia-supply / revia-providers | supplies / practitioners (preview domains) |

Both partner destinations live only in `src/lib/partner.ts` (`D2C`, `B2B`,
`REVIA_NETWORK`); no second URL literal anywhere in `src/`. While i2b's origin
(`I2B_ORIGIN_FALLBACK` / `NEXT_PUBLIC_I2B_ORIGIN`) is null, every D2C control
falls back to `/contact` rather than a dead link. reviawholesale.com publishes no
policy pages — never tell visitors its terms are "on their site".

**Testing claims — match the COA.** ReVia's own published COAs (Chromate,
signed Lucas Weber) state one method, *RP-HPLC with UV detection*, and four
results: identity, quantity, purity, metals. Purity spec is **>98%**
(tirzepatide #32920 = 98.622%). Describe testing as "RP-HPLC with UV detection,
reporting identity, quantity, purity and metals (<50 ppb), per batch". Never
claim LC-MS/mass spec, endotoxin/LAL, sterility (USP <71>), residual solvents
(USP <467>), bioburden, amino-acid sequencing or ICP-MS. "ISO 6000/7000" is not
a standard — keep it off the site. Pin whole sentences in `check-claims`, not
keywords (a keyword registry let "503B outsourcing facility registered with
FDA" through before).

**Other standing rulings:** positive framing only; Chromate is the only party
ever named — never the manufacturer or fulfilment; no commercial terms
published; no telephony; numbers derived from data, not typed in ("we are about
data authority").

## Open problems this WIP does not solve

- ⛔ **The COAs are AgeREcode-branded** (company name, `AGE|RECODE` watermark,
  `RECODE…` access codes) and publicly reachable at `revialife.com/coa/*.png`.
  White label does not exist on paperwork until branded COAs arrive (Mike is
  sourcing them).
- ⚠️ Do **not** ship `seo/audit-fixes-2026-06-15` as-is: it emits per-city
  `@type: Store` for cities with no premises.
- Old unrelated local-only work on that machine (not in this branch): commits
  `3614fe6` (feat/geo-seo-engine) and `61573dc` (seo-audit-fixes), plus two
  3–4-month-old stashes.

## Build / deploy notes

- The local clone had no `node_modules`; build on the box or after `npm ci`.
- Production: Hetzner `195.201.140.96`, `/opt/revia`, pm2 `revia` on :3000
  (shares the box with `revia-b2b` on :3001). Deploy is
  `git fetch origin && git reset --hard origin/prod-snapshot-20260611 &&
  npm run build && pm2 reload revia` — curl **both** sites afterwards.
- TLS is a Cloudflare Origin Certificate (Full strict); no certbot.

---

## Picked up 2026-09-15 (second machine)

**Verified, not assumed.** `npm ci` then:

- `tsc --noEmit` — **0 errors**
- `npx next build` — compiles; fails only at prerender of `/shop` with
  `Database "browne" does not exist`, i.e. no `DATABASE_URL`. There is no
  `.env.example` in the repo, so that value is still needed before the branch
  can be built end to end.
- `npm run check:claims` — passes

So the WIP is structurally sound. The remaining blocker to a full build is the
database URL, not the code.

**i2b's origin is now set.** `I2B_ORIGIN_FALLBACK` was null "until i2b has a
domain", which left every consumer buy control on the portal pointing at
`/contact`. i2b still has no BRAND domain, but it has a live public address
serving the full storefront — checked before setting it. It is marked
`preview: true` in `REVIA_NETWORK` exactly as ReVia Supply and ReVia Providers
are, so it reads as temporary rather than final.

That switch feeds `/shop`, `/stacks`, `/faq` and the network cards at once.
Change the one constant, or set `NEXT_PUBLIC_I2B_ORIGIN`, when the brand domain
lands.

**Still open, unchanged:** the AgeREcode-branded COAs, and the `@type: Store`
markup on `seo/audit-fixes-2026-06-15`.

**Note for whoever holds the i2b side.** i2b now has its own `check-claims`
(`scripts/check-claims.mjs`, wired into its build) covering the same ground from
the other direction, and its COAs were read the same way — Chromate, Lucas
Weber, RP-HPLC with UV detection, four rows, >98%. The two sites agree on the
testing facts. i2b DOES now publish cGMP, ISO-7 and FDA registration, sourced to
AgeRECode's own provider-wholesale site (pbd2.net); revialife makes no such
claim and this branch does not add one.
