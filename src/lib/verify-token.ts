/**
 * Recovery for verification links mangled in transit.
 *
 * Our verification emails are sent as quoted-printable HTML. Some receivers
 * (Microsoft/Outlook.com in particular) decode the `=` that separates
 * `?token` from its value as the start of a QP escape, swallowing it along
 * with the first two hex characters of the token:
 *
 *   ?token=0329407d...   ->   ?token<0x03>29407d...
 *
 * The damage is reversible: the surviving character IS the decoded value of
 * the two hex digits that were eaten, so re-encoding its char code as two
 * hex digits reconstructs the original token exactly.
 *
 * A token is 32 random bytes as lowercase hex, so we never have to guess:
 * candidates are checked against the database and only an exact row match is
 * accepted. A wrong candidate simply finds nothing.
 */

/** A verification token is crypto.randomBytes(32).toString("hex"). */
export const VERIFY_TOKEN_LENGTH = 64;

const FULL_TOKEN = /^[0-9a-f]{64}$/;

/**
 * Bytes 0x80-0x9f are not control characters in Windows-1252 (the charset
 * Outlook labels these messages with) — they map to printable glyphs. Undo
 * that mapping so the original byte is recoverable.
 */
const CP1252_HIGH: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

/**
 * Build the list of tokens a given request could plausibly be carrying,
 * most-likely first. Callers look these up and take the row that matches.
 */
export function verifyTokenCandidates(search: string): string[] {
  const candidates: string[] = [];
  const add = (t: string | null | undefined) => {
    if (t && FULL_TOKEN.test(t) && !candidates.includes(t)) candidates.push(t);
  };

  const raw = search.startsWith("?") ? search.slice(1) : search;

  // Percent-decode so a control byte the browser sent as %03 is comparable to
  // one that arrived raw. Malformed escapes are not fatal — fall back to raw.
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }

  // 1. The uncorrupted case: a normal ?token=<64 hex> pair.
  const intact = /(?:^|&)token=([0-9a-f]+)/i.exec(decoded);
  if (intact) {
    const value = intact[1].toLowerCase();
    add(value);

    // The eaten pair can itself decode to "=" (QP "=3D"), which leaves the
    // URL looking perfectly normal but two characters short.
    if (value.length === VERIFY_TOKEN_LENGTH - 2) add(`3d${value}`);
  }

  // 2. The corrupted case: "token" followed by anything other than "=", then
  //    the remaining 62 hex characters.
  const mangled = /(?:^|&)token([^=])([0-9a-f]+)/i.exec(decoded);
  if (mangled) {
    const char = mangled[1].charCodeAt(0);
    const rest = mangled[2].toLowerCase();
    const eaten = CP1252_HIGH[char] ?? char;
    if (eaten <= 0xff) {
      add(eaten.toString(16).padStart(2, "0") + rest);
    }
  }

  return candidates;
}
