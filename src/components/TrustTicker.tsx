"use client";

import { motion } from "framer-motion";
import { StatRow } from "@/components/Stat";
import type { PublicStat } from "@/lib/stats";
import {
  FlaskConical,
  ShieldCheck,
  Microscope,
  Atom,
  Beaker,
  Fingerprint,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

// Every line here is something the batch Certificate of Analysis actually
// reports. The COAs state a single method — "Qualitative and quantitative
// chemical analysis by RP-HPLC with UV detection" — and four results:
// Identity, Quantity, Purity and Metals.
//
// Removed because no certificate carries them: LC-MS / mass spectrometry,
// endotoxin (LAL), sterility (USP <71>), residual solvents (USP <467>),
// bioburden, amino-acid sequencing, and ICP-MS as the metals method.
const trustItems = [
  { icon: Microscope, text: "RP-HPLC with UV", detail: "The method on every batch COA" },
  { icon: FlaskConical, text: "Purity Verified", detail: "Reported per batch" },
  { icon: Fingerprint, text: "Identity Confirmed", detail: "Against specification" },
  { icon: Beaker, text: "Peptide Quantity", detail: "Net peptide per vial" },
  { icon: ShieldCheck, text: "Metals < 50 ppb", detail: "Conforms, every batch" },
  { icon: Sparkles, text: "Certificate of Analysis", detail: "Batch-specific, independent lab" },
  { icon: BadgeCheck, text: "cGMP Manufactured", detail: "FDA-registered facilities" },
  { icon: Atom, text: "US Processed & Tested", detail: "Start to finish" },
];

// Double the items for seamless loop
const items = [...trustItems, ...trustItems];

export default function TrustTicker({ stats = [] }: { stats?: PublicStat[] }) {
  return (
    <section className="relative overflow-hidden bg-stone-900 py-5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-900 to-transparent z-10" />

      <div className="mb-3 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
          Quality Assurance Protocol
        </p>
      </div>

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          },
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 px-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 border border-stone-700">
              <item.icon className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-200">{item.text}</p>
              <p className="text-[10px] text-stone-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Derived stats. Every figure here is computed in src/lib/stats.ts and
          carries its own source line. The four that used to sit here —
          "99.4% Avg Purity", "12 QC Tests Per Batch", "42 COAs Published",
          "0 Failed Batches" — were typed by hand, and three of them were
          false: the certificate count was 39, the COA reports four results
          rather than twelve, and the batch table has never held a row, so
          neither the average nor the failure rate existed to be quoted. */}
      <StatRow stats={stats} tone="dark" className="mx-auto mt-8 max-w-4xl px-6" />
    </section>
  );
}
