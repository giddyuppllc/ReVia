"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The house furniture for a publication.
 *
 * ReVia Life is a record, not a shop, and the design has to carry that on its
 * own — the old home page opened with four vials and a "Shop Compounds" button
 * and read as a storefront no matter what the copy said.
 *
 * The authority here comes from typography and paper, not from imagery. Three
 * rules hold it together:
 *
 *   1. Display serif at large sizes with tight tracking; sans in small caps with
 *      wide tracking for every label. The contrast between those two IS the look
 *      — there is no third voice.
 *   2. Hairlines, never boxes. A rule separates; a card decorates. Cards are
 *      used only where something genuinely is a discrete object.
 *   3. Motion reveals, it does not perform. Everything rises a few pixels and
 *      settles. Nothing parallaxes, nothing counts up, nothing floats forever.
 *      Reduced motion removes it entirely rather than shortening it.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Rises into place once, on entry. The only motion primitive on the site.
 *
 * ## Why the reduced-motion branch is still a motion.div
 *
 * It used to be `if (still) return <div className={className}>…</div>`, which
 * reads as the correct thing to do and rendered nothing at all.
 *
 * `useReducedMotion()` cannot know the preference on the server, so it comes
 * back falsy there and the animated branch is what gets prerendered — a div
 * carrying framer's own inline `style="opacity:0;transform:translateY(14px)"`.
 * On the client the hook resolves to true and the component returns a plain
 * div. React sees the same `div` tag in the same slot, keeps the existing DOM
 * node, and has nothing to say about `style` because the plain branch never
 * set it — that attribute was written imperatively by framer, not by React. So
 * the node keeps `opacity: 0`, `whileInView` is no longer there to clear it,
 * and every section wrapped in a Rise stays invisible for exactly the readers
 * who asked for less movement.
 *
 * Staying on motion.div in both branches keeps framer the owner of that inline
 * style, so it writes `opacity: 1` on the reduced path instead of abandoning a
 * zero. Nothing animates: `initial` already is the resting state, and there is
 * no `whileInView` to animate towards.
 *
 * Measured at 390px with Playwright's `reducedMotion: "reduce"`, before and
 * after. `ScrollReveal` and the footer's `AnimatedContainer` carry the same
 * shape of bug and are not touched here — they belong to the pages outside the
 * record design system.
 */
export function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={still ? undefined : { once: true, margin: "-80px" }}
      transition={still ? undefined : { duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A hairline that draws itself left to right.
 *
 * The one flourish in the system, and it earns its place: a rule that arrives
 * reads as something being set, which is the feeling the whole page is after.
 */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={`h-px w-full origin-left bg-[#3D3229]/18 ${className}`}
      // `undefined` here left the prerendered scaleX(0) in place on the client
      // for the same reason described on Rise above, so every hairline on the
      // page was drawn at zero width. Stating the resting state explicitly is
      // what clears it.
      initial={still ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={still ? undefined : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    />
  );
}

/** Small caps, wide tracking. Every section is announced the same way. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-[#A38569] ${className}`}
    >
      {children}
    </span>
  );
}

/** A section heading in the display face. Tight, because it is set, not typed. */
export function Heading({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`font-display font-light leading-[1.06] tracking-[-0.015em] text-[#3D3229] ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * A figure and what it means, in the shape a reference table uses.
 *
 * Deliberately not a "stat card" — no border, no background, no icon. The value
 * sits in the display face, the meaning beneath it in small caps, and a hairline
 * divides one from the next. It reads as a specification, which is what it is.
 */
export function Figure({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <span className="font-display text-3xl font-light leading-none text-[#3D3229] sm:text-4xl">
        {value}
      </span>
      <Label>{label}</Label>
      {note && <span className="font-sans text-[0.6875rem] leading-snug text-[#3D3229]/45">{note}</span>}
    </div>
  );
}

/**
 * Paper. A panel a shade lighter than the ground, with a hairline and the
 * faintest lift — enough to read as a separate sheet without becoming a card.
 */
export function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[3px] border border-[#3D3229]/10 bg-[#FAF8F4] shadow-[0_1px_2px_rgba(61,50,41,0.04),0_8px_24px_-16px_rgba(61,50,41,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}
