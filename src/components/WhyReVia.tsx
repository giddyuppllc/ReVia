"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COA_SPEC } from "@/lib/coa";
import {
  Factory,
  BadgeCheck,
  Microscope,
  FileCheck,
  FlaskConical,
  Atom,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function WhyReVia() {
  const shouldReduceMotion = useReducedMotion();

  const anim = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-6">

        {/* ── Section 1: Hero Statement ── */}
        <div className="text-center mb-20">
          <motion.p {...anim(0)} className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
            The ReVia Difference
          </motion.p>
          <motion.h1 {...anim(0.1)} className="text-3xl font-bold text-stone-800 sm:text-4xl lg:text-5xl leading-tight">
            Not All Peptides Are<br />Created Equal
          </motion.h1>
          <motion.p {...anim(0.2)} className="mt-6 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            {/* The sentence that was here characterised every other vendor as
                reselling "unverified powder from overseas factories". We have no
                basis for that about anyone, and it is the same class of claim
                the competitor table was removed for. What we can say is what we
                do, and it is stronger for naming nobody. */}
            Third-party tested, batch by batch, with the certificate published for the lot
            that ships — the laboratory, the method and the result, on the document.
          </motion.p>
        </div>

        {/* ── Section 2: Key Differentiators (6 pillars) ── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-24">
          {[
            {
              icon: Factory,
              title: "US Manufactured",
              description: "Active pharmaceutical ingredient is sourced from Germany and Ukraine, then finished and tested in Florida. That is what we mean by US manufactured, and we would rather define it than let you assume it.",
            },
            {
              icon: BadgeCheck,
              title: "cGMP Certified",
              // "ISO certified" without a number certifies nothing — ISO is a
              // body, not a standard — and "the highest bar in the industry" is
              // a superlative no document supports. i2b's own checker bans both.
              description: "Finished in an FDA-registered facility under cGMP manufacturing standards. Registration of a facility is not approval of a product.",
            },
            {
              icon: Microscope,
              title: "FDA-Registered Labs",
              description: "All testing performed in labs registered with the FDA, meeting federal administrative compliance requirements.",
            },
            {
              icon: FileCheck,
              title: "Per-Batch COAs",
              description: "Every batch gets its own Certificate of Analysis from an independent US lab. Never shared, reused, or fabricated.",
            },
            {
              icon: FlaskConical,
              title: `${COA_SPEC.puritySpec} Purity`,
              description: "Research-grade, verified against a greater-than-98-percent specification by RP-HPLC with UV detection, with the measured figure printed on each batch certificate.",
            },
            {
              icon: Atom,
              title: "Metals Screened",
              description: "Every batch is screened for heavy metals and reported on its Certificate of Analysis at less than 50 parts per billion.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...anim(0.1 + i * 0.08)}
                className="group rounded-2xl border border-sky-200/40 bg-white/80 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-sky-200/20 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50 mb-4 transition-colors group-hover:bg-sky-500 group-hover:border-sky-500">
                  <Icon className="h-5 w-5 text-sky-600 transition-colors group-hover:text-white" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Section 3: Testing Pipeline ── */}
        <motion.div {...anim(0.2)} className="mb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">
              Our Testing Process
            </p>
            <h2 className="text-2xl font-bold text-stone-800 sm:text-3xl">
              5-Stage Quality Verification
            </h2>
            <p className="mt-3 text-stone-500 max-w-xl mx-auto">
              Every batch is analysed before it ships, and the certificate reports exactly
              what was measured.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: "01", title: "RP-HPLC with UV", desc: "The single analytical method behind every result on the certificate" },
              { step: "02", title: "Identity", desc: "The compound is confirmed against its specification" },
              { step: "03", title: "Quantity & Purity", desc: "Net peptide per vial, and purity, both reported as measured" },
              { step: "04", title: "Heavy Metals", desc: "Screened and reported at less than 50 parts per billion" },
              { step: "05", title: "COA Issued", desc: "Independent lab issues a batch-specific Certificate of Analysis" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...anim(0.3 + i * 0.1)}
                className="relative rounded-2xl border border-sky-200/40 bg-white/80 p-5 text-center"
              >
                <span className="text-3xl font-black text-sky-100">{item.step}</span>
                <h4 className="text-sm font-semibold text-stone-800 mt-2">{item.title}</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{item.desc}</p>
                {i < 4 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-300 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The "ReVia vs. Gray Market Vendors" table that sat here compared us
            against unnamed third parties using figures nobody sourced
            ("70-85% typical" purity, COAs described as "Fake or reused"),
            and it credited ReVia with sterility testing and LC-MS
            verification that appear on no certificate. Describe what we do;
            the certificate is the argument. */}

        {/* ── CTA ── */}
        <motion.div {...anim(0.3)} className="text-center">
          <p className="text-lg font-semibold text-stone-700 italic mb-6">
            When purity and safety matter, the supply chain isn&apos;t a detail — it&apos;s the product.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-8 py-4 text-base font-bold text-white transition hover:bg-sky-500"
          >
            Explore the Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
