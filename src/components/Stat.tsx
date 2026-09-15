import type { PublicStat } from "@/lib/stats";

/* ------------------------------------------------------------------ */
/*  Derived statistics, and only derived statistics                    */
/*                                                                     */
/*  These components accept `PublicStat[]` and nothing else. There is  */
/*  deliberately no `value: string` prop anywhere in this file, so a   */
/*  number cannot reach the screen without going through               */
/*  src/lib/stats.ts and carrying a `sourceNote` that says where it    */
/*  came from.                                                         */
/*                                                                     */
/*  That is the point. Hardcoding a figure here would mean changing a  */
/*  type signature, which is visible in review — rather than quietly   */
/*  typing "99.4%" into a row of JSX, which is how the home page came  */
/*  to advertise an average purity nobody had measured.                */
/*                                                                     */
/*  The figure is set in mono with tabular numerals: on this site, a   */
/*  measurement looks different from a claim.                          */
/* ------------------------------------------------------------------ */

export function Stat({ stat, tone = "light" }: { stat: PublicStat; tone?: "light" | "dark" }) {
  const value = tone === "dark" ? "text-sky-300" : "text-stone-800";
  const label = tone === "dark" ? "text-stone-400" : "text-stone-500";
  const source = tone === "dark" ? "text-stone-500" : "text-stone-400";
  const rule = tone === "dark" ? "border-stone-700" : "border-sky-200/60";

  return (
    <div className="text-center">
      <p className={`font-mono text-2xl font-semibold tabular-nums sm:text-3xl ${value}`}>
        {stat.value}
      </p>
      <p
        className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${label}`}
      >
        {stat.label}
      </p>
      {/* Provenance is not optional — it is the whole argument. */}
      <p className={`mx-auto mt-2 max-w-[22ch] border-t pt-2 text-[10px] leading-snug ${rule} ${source}`}>
        {stat.sourceNote}
      </p>
    </div>
  );
}

/**
 * Renders nothing below two stats: a lone surviving figure reads as an
 * orphan rather than a row, and it is better to show no band than a band
 * that lost three quarters of itself to a failed query.
 */
export function StatRow({
  stats,
  tone = "light",
  className = "",
}: {
  stats: PublicStat[];
  tone?: "light" | "dark";
  className?: string;
}) {
  if (stats.length < 2) return null;

  return (
    <div
      className={`grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-10 ${className}`}
    >
      {stats.map((s) => (
        <Stat key={s.id} stat={s} tone={tone} />
      ))}
    </div>
  );
}
