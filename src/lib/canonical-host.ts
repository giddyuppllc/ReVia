/**
 * Whether this deployment is the real revialife.com or a preview of it.
 *
 * ## Why this exists
 *
 * The Vercel deployment answers on revialife.vercel.app and is being sent
 * around for review before the domain is pointed at it. Nothing stopped Google
 * indexing it: robots.txt said `Allow: /`, every page said `index: true`, and
 * the sitemap it served listed revialife.com URLs — so a crawler was invited in
 * and then handed a map to a second copy of the same content.
 *
 * The cost lands later and is hard to unpick. Once the domain is live, the
 * preview competes with it for the same queries, and the canonical URLs pointing
 * at revialife.com from a host that is not revialife.com is exactly the
 * ambiguity that gets both filtered.
 *
 * ## How it decides
 *
 * `NEXT_PUBLIC_URL` is the site's own address, and it is the variable already
 * used to build unsubscribe links. Unset — which is the state of the Vercel
 * project today — means nobody has told this deployment it is the real site, so
 * it assumes it is not. Fail closed: a preview wrongly marked noindex costs
 * nothing, and a preview wrongly indexed costs the launch.
 *
 * Set NEXT_PUBLIC_URL=https://revialife.com on the production environment when
 * the domain is pointed, and indexing turns on with no code change.
 */

export const CANONICAL_HOST = "revialife.com";

export function isCanonicalDeployment(): boolean {
  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) return false;
  try {
    return new URL(url).hostname.replace(/^www\./, "") === CANONICAL_HOST;
  } catch {
    return false;
  }
}
