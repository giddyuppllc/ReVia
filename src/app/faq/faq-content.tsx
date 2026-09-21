"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Package,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  ScrollText,
  FlaskConical,
  Layers,
} from "lucide-react";
import { FAQ_SECTIONS, type FaqCta } from "./faq-data";
import PartnerShopButton from "@/components/PartnerShopButton";
import { D2C, PARTNER_LINK_PROPS } from "@/lib/partner";

// Icons live here rather than in the data, so the data stays a plain module
// that page.tsx can import for the JSON-LD without pulling in JSX.
const SECTION_ICONS: Record<string, React.ReactNode> = {
  "Getting Started": <HelpCircle className="h-5 w-5" />,
  "Products & Quality": <FlaskConical className="h-5 w-5" />,
  "Stacks & Blends": <Layers className="h-5 w-5" />,
  "Ordering & Supply": <CreditCard className="h-5 w-5" />,
  "Research & Safety": <Package className="h-5 w-5" />,
  Policies: <ScrollText className="h-5 w-5" />,
};

function AnswerCta({ cta }: { cta: FaqCta }) {
  const className =
    "mt-4 inline-flex items-center gap-1.5 rounded-xl border border-[#3E97CE] bg-[#3E97CE] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3585B8] hover:border-[#3585B8]";

  if (cta.external) {
    return (
      <a href={cta.href} {...PARTNER_LINK_PROPS} className={className}>
        {cta.label}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link
      href={cta.href}
      className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-sky-300/60 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
    >
      {cta.label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQ_SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter(
      (i) =>
        !search ||
        i.q.toLowerCase().includes(search.toLowerCase()) ||
        i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Frequently Asked <span className="text-sky-600">Questions</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500">
          What the compounds are, how they&rsquo;re tested and stored, and where to order them.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-12 pr-4 text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
        />
      </div>

      <div className="mt-12 space-y-10">
        {filtered.map((section) => (
          <div key={section.title}>
            <div className="mb-4 flex items-center gap-3 text-sky-600">
              {SECTION_ICONS[section.title] ?? <HelpCircle className="h-5 w-5" />}
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.title}-${item.q}`;
                const isOpen = openIndex === key;
                return (
                  <div
                    key={key}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-neutral-900 transition hover:bg-neutral-50"
                    >
                      <span className="pr-4 font-medium">{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="border-t border-neutral-100 px-5 py-4">
                            <p className="leading-relaxed text-neutral-500">{item.a}</p>
                            {item.cta && <AnswerCta cta={item.cta} />}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-neutral-500">No questions match your search.</p>
      )}

      {/* Two ways out of the page: order, or ask. */}
      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-sky-200/60 bg-sky-50/60 p-8 text-center">
          <h3 className="text-xl font-semibold text-neutral-900">Ready to order?</h3>
          <p className="mt-2 flex-1 text-neutral-500">
            Our exclusive research partner, i2b Health, carries the catalog.
          </p>
          <PartnerShopButton
            audience="d2c"
            size="lg"
            variant="solid"
            className="mt-6 justify-center"
          >
            Shop at {D2C.name}
          </PartnerShopButton>
        </div>

        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">Still have questions?</h3>
          <p className="mt-2 flex-1 text-neutral-500">
            Send them over. We reply within 24 hours on business days.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-sky-300/60 bg-white px-8 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
