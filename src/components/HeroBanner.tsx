"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Truck, Package, MapPin, ArrowRight, Atom, ShieldCheck } from "lucide-react";

const HEADLINE = "Premium Peptides. Proven Purity. Real Results.";

// Fine print sits under the headline in the top bar, not in the fact ticker.
const FINE_PRINT =
  "A trusted laboratory supply source for independently tested, research-grade peptides. Every batch verified to >99% purity. For research use only.";

// Bottom bar is facts only now.
const INFO = [
  { icon: FlaskConical, text: ">99% Purity" },
  { icon: Atom, text: "LC-MS Verified" },
  { icon: ShieldCheck, text: "US-Manufactured · cGMP Certified" },
  { icon: Truck, text: "Same-Day Dispatch" },
  { icon: Package, text: "85+ Peptides" },
  { icon: MapPin, text: "US-Based" },
];

/**
 * Seamless horizontal ticker: two identical copies, travelling exactly half the
 * track width, so copy two lands where copy one began.
 *
 * Spacing between copies is the caller's job (trailing padding on the cell).
 * Make that padding wide enough that one copy exceeds the viewport, or both are
 * on screen at once and it reads as stuttering repetition rather than a loop.
 */
function Ticker({
  children,
  duration,
  reverse = false,
  fadeFrom,
}: {
  children: React.ReactNode;
  duration: number;
  reverse?: boolean;
  fadeFrom: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r ${fadeFrom} to-transparent sm:w-20`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l ${fadeFrom} to-transparent sm:w-20`} />
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" } }}
      >
        {/* Two copies in separate boxes — bare sibling `children` would collide keys */}
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroBanner() {
  return (
    <section className="relative h-[58vh] sm:h-[74vh]">
      <h1 className="sr-only">Premium Peptides. Proven Purity. Real Results.</h1>

      {/* ── TOP BAR ── proper glass: low-opacity fill, heavy blur, a bright top
          edge and a soft shadow underneath so it lifts off the photo. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 z-20"
        aria-hidden="true"
      >
        {/* Static — the headline is the one thing that should hold still. */}
        <div className="border-t border-white/60 border-b border-white/25 bg-[#F0EDE5]/35 px-5 py-3 text-center shadow-[0_8px_28px_-10px_rgba(31,42,54,0.28)] backdrop-blur-2xl backdrop-saturate-150 sm:py-4">
          <p className="font-display text-xl leading-tight tracking-tight text-stone-800 sm:text-3xl lg:text-4xl">
            {HEADLINE}
          </p>
          <p className="mx-auto mt-1 max-w-3xl text-[9px] font-medium leading-snug text-stone-600/90 sm:mt-1.5 sm:text-[11px]">
            {FINE_PRINT}
          </p>
        </div>
      </motion.div>

      {/* ── CENTRE ── buttons only */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pointer-events-auto flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Shop Now — solid brand blue */}
          <Link
            href="/shop"
            // NOTE: globals.css remaps the whole sky-*/blue-* scale to warm mocha
            // (--color-sky-500: #A38569), so `bg-sky-500` renders brown. An actual
            // blue has to be an explicit hex — this one matches the logo swoosh
            // and the vial label bands.
            className="group relative flex items-center gap-1 overflow-hidden rounded-full border-[1.5px] border-[#3E97CE] bg-[#3E97CE] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-[#1c4a68]/30 sm:px-9 sm:py-4 sm:text-base cursor-pointer hover:bg-[#3585B8] hover:border-[#3585B8] active:scale-[0.95] transition-colors duration-300"
          >
            <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-white fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
            <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
              Shop Now
            </span>
            <ArrowRight className="absolute w-4 h-4 right-4 stroke-white fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          </Link>

          {/* View Stacks — glass, to match the bars */}
          <Link
            href="/shop?category=stacks"
            className="group relative flex items-center gap-1 overflow-hidden rounded-full border-2 border-white/60 bg-[#F0EDE5]/35 px-5 py-3 text-sm font-bold text-stone-800 shadow-xl shadow-stone-900/15 backdrop-blur-xl sm:px-9 sm:py-4 sm:text-base cursor-pointer hover:bg-[#F0EDE5]/70 active:scale-[0.95] transition-colors duration-300"
          >
            <ArrowRight className="absolute w-4 h-4 left-[-25%] stroke-stone-700 fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
            <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
              View Stacks
            </span>
            <ArrowRight className="absolute w-4 h-4 right-4 stroke-stone-700 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
          </Link>
        </motion.div>
      </div>

      {/* ── BOTTOM BAR ── facts only; anchors the hero into the TrustTicker below */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 z-20"
        aria-hidden="true"
      >
        <div className="border-t border-white/10 bg-stone-900/85 py-3 backdrop-blur-xl sm:py-4">
          <Ticker duration={40} reverse fadeFrom="from-stone-900">
            <>
              {INFO.map((item, i) => (
                <span
                  key={`${item.text}-${i}`}
                  className="flex items-center gap-2.5 whitespace-nowrap pr-10 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-300 sm:gap-3 sm:pr-16 sm:text-[13px]"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-[#5BA9D8]" />
                  {item.text}
                </span>
              ))}
              {/* Six short facts total ~1400px, narrower than a desktop viewport,
                  so both loop copies were on screen at once and US-Based read as
                  duplicated. This spacer pushes each copy past 100vw. */}
              <span aria-hidden="true" className="shrink-0 pr-[42vw]" />
            </>
          </Ticker>
        </div>
      </motion.div>
    </section>
  );
}
