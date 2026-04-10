"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Shield,
  BadgeCheck,
  Heart,
  Sparkles,
  Users,
  ArrowRight,
  FlaskConical,
  Microscope,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

function Section({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <>
      {/* ── Hero + Story ── */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/60 via-sky-50/30 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <Section>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-3">About ReVia</p>
                <h1 className="text-3xl font-bold text-stone-900 leading-tight sm:text-4xl lg:text-5xl">
                  Built for People Who Expect More
                </h1>
              </Section>
              <Section delay={0.1}>
                <p className="mt-4 text-stone-500 leading-relaxed">
                  ReVia is built for people who expect more from the wellness brands they choose.
                  Our focus is simple: quality, transparency, and a thoughtful standard of care
                  in a category that often feels crowded with noise.
                </p>
              </Section>
            </div>
            <Section delay={0.15}>
              <div className="overflow-hidden rounded-2xl">
                <img src="/images/about-lab.png" alt="ReVia laboratory" className="w-full object-cover" />
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <Section>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2 text-center">Our Story</p>
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-6">Born From Personal Experience</h2>
        </Section>
        <Section delay={0.1}>
          <p className="text-stone-500 leading-relaxed text-center">
            ReVia began with a personal experience and years of disciplined research. After being
            introduced to peptides by world-class physicians during a serious health challenge, our
            founder developed a deep respect for the category and an even deeper commitment to
            understanding it. That experience led to extensive study, careful evaluation of suppliers,
            and a clear belief that this market deserved a more refined, more responsible approach.
          </p>
        </Section>
      </section>

      {/* ── Our Point of View ── */}
      <section className="bg-sky-50/60 border-y border-sky-200/30 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <Section>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2 text-center">Our Point of View</p>
            <p className="text-lg font-medium text-stone-700 text-center italic leading-relaxed">
              &ldquo;We believe premium brands are defined by restraint, clarity, and consistency.
              That means communicating carefully, avoiding hype, and focusing on what informed
              customers actually value.&rdquo;
            </p>
          </Section>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <Section>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2 text-center">Our Philosophy</p>
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">What Guides Us</h2>
        </Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Shield, title: "Quality Without Compromise", desc: "Every product meets the highest manufacturing and testing standards. No shortcuts, no exceptions." },
            { icon: BadgeCheck, title: "Honest Communication", desc: "Honest, precise communication. We avoid hype and focus on what informed customers actually value." },
            { icon: Heart, title: "Respect for Our Customers", desc: "We respect the intelligence of the people we serve. Our brand is built on substance, not noise." },
            { icon: Sparkles, title: "Modern & Inclusive", desc: "A brand experience that feels elevated, not clinical; personal, not promotional; and inclusive, not narrow." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Section key={item.title} delay={i * 0.08}>
                <div className="rounded-xl border border-sky-200/40 bg-white/80 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <Icon className="h-5 w-5 text-sky-500 mb-3" strokeWidth={1.75} />
                  <h3 className="text-sm font-semibold text-stone-800 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </Section>
            );
          })}
        </div>
      </section>

      {/* ── Why ReVia + Leadership ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <Section>
            <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2">Our Purpose</p>
              <h2 className="text-xl font-bold text-stone-900 mb-3">Why ReVia Exists</h2>
              <p className="text-sm text-stone-500 leading-relaxed">
                ReVia was founded to raise the standard in this space. We want to make it easier
                for adults to explore peptides and wellness products with confidence, supported
                by a brand that values discretion, education, and integrity.
              </p>
              <p className="mt-3 text-sm text-stone-500 leading-relaxed">
                We are equally committed to building a brand that feels welcoming across audiences.
                The result should be elevated, not clinical; personal, not promotional; and inclusive, not narrow.
              </p>
            </div>
          </Section>
          <Section delay={0.1}>
            <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-sky-500" strokeWidth={1.75} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">Our Team</p>
                  <h2 className="text-xl font-bold text-stone-900">Leadership</h2>
                </div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                ReVia is led by a family team with experience across entrepreneurship, strategy,
                finance, and business development. We bring an execution-focused mindset to the
                company, along with a genuine respect for the responsibility that comes with
                serving customers in this category.
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* ── Testing Process ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <Section>
          <div className="overflow-hidden rounded-2xl mb-8">
            <img src="/images/about-quality.png" alt="Quality testing" className="w-full h-48 object-cover" />
          </div>
        </Section>
        <Section>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2 text-center">Quality Assurance</p>
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-6">Our Testing Process</h2>
        </Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FlaskConical, title: "HPLC Purity", desc: "Every batch confirmed >99% pure via chromatography" },
            { icon: Microscope, title: "LC-MS Verified", desc: "Molecular identity confirmed after reconstitution" },
            { icon: ShieldCheck, title: "Full Screening", desc: "Heavy metals, sterility, and endotoxin tested" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Section key={item.title} delay={i * 0.1}>
                <div className="rounded-xl border border-sky-200/40 bg-white/90 p-5 text-center">
                  <Icon className="h-6 w-6 text-sky-500 mx-auto mb-3" strokeWidth={1.75} />
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </Section>
            );
          })}
        </div>
      </section>

      {/* ── What We Stand For + CTA ── */}
      <section className="bg-sky-50/60 border-y border-sky-200/30 py-12">
        <Section>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 mb-2">Our Promise</p>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">What We Stand For</h2>
            <p className="text-stone-600 leading-relaxed">
              ReVia is being built for the long term. That means careful sourcing, thoughtful
              presentation, and a customer experience grounded in trust.
            </p>
            <p className="mt-3 text-stone-700 font-medium italic">
              We believe the strongest brands earn confidence quietly, through consistency
              and substance. That is the standard we are setting for ReVia.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-400 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-sky-500"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-6 text-[10px] text-stone-400 leading-relaxed">
              <strong className="text-stone-500">Research Use Only:</strong> All ReVia products are sold
              strictly for laboratory and scientific research purposes. They are not intended for human
              or animal consumption. By purchasing from ReVia, customers confirm they are qualified
              researchers operating within applicable regulations.
            </p>
          </div>
        </Section>
      </section>
    </>
  );
}
