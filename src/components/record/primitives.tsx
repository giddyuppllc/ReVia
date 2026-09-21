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

/** Rises into place once, on entry. The only motion primitive on the site. */
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
  if (still) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
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
      initial={still ? undefined : { scaleX: 0 }}
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
