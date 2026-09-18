/**
 * Where a compound is called something different on i2b.
 *
 * ## A naming table, not a stock table
 *
 * This is the only static part of the i2b handoff, and the distinction is the
 * whole reason it is allowed to be static. It records that two names refer to
 * one compound — a fact that changes when somebody renames a product, which is
 * rarely and deliberately. It records nothing about whether i2b stocks it, which
 * changes whenever the owner flips a switch in his admin. That question is
 * answered live, in `src/lib/i2b-catalogue.ts`.
 *
 * The map this replaced conflated the two, and rotted exactly as you would
 * expect: it had `acetic-acid-water` pointing at a product i2b had since
 * deactivated, so the link rendered, looked correct, and led to a 404.
 *
 * ## Only where it is the same product
 *
 * Both entries below were verified against i2b's live catalogue by name, not
 * guessed from the slug: "GLOW Stack" is i2b's "GLOW", "KLOW Stack" is its
 * "KLOW".
 *
 * Deliberately absent, though the slugs are close enough to tempt:
 *
 *   bpc-157        ✗ i2b's `bpc-157-tb-500` is a BLEND of two compounds. A
 *                    reader on the BPC-157 monograph is reading about BPC-157.
 *   tb-500         ✗ same blend, same reason.
 *   cjc-1295-dac   ✗ i2b carries `cjc-1295-no-dac` (which matches exactly) and
 *                    a `cjc-1295-ipamorelin` blend. The DAC and no-DAC forms are
 *                    different molecules with different half-lives; sending one
 *                    to the other would be wrong in the way that matters.
 *   ipamorelin     ✗ matches i2b exactly already. The blend is a third product.
 *
 * Sending a reader to a product that merely contains what they were reading
 * about is worse than sending them nowhere: nowhere is honest, and the
 * catalogue link at the foot of the page still works.
 */

/** ReViaLife research slug → the slug i2b publishes it under. */
export const I2B_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  "glow-stack": "glow",
  "klow-stack": "klow",
});

/**
 * The slug to look for in i2b's catalogue. Identity for everything unaliased —
 * most compounds carry the same slug on both sites.
 */
export function i2bSlugFor(researchSlug: string): string {
  return I2B_ALIASES[researchSlug] ?? researchSlug;
}
