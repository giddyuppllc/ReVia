"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Truck, Package, MapPin, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-700 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Now Serving 74+ Compounds
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 text-5xl font-extrabold tracking-tight text-emerald-950 sm:text-6xl lg:text-7xl leading-[1.1]"
            >
              Premium Peptides for{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Modern Research
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg text-emerald-900/60 leading-relaxed sm:text-xl max-w-lg"
            >
              Trusted by researchers worldwide. 98%+ purity, same-day shipping, and a catalog built for the science of tomorrow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
              >
                Explore the Catalog
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?category=stacks"
                className="inline-flex items-center justify-center rounded-full border border-emerald-300/60 bg-white/50 backdrop-blur-sm px-8 py-4 text-base font-bold text-emerald-800 transition-all hover:bg-white/80"
              >
                View Stacks
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-14 flex flex-wrap gap-x-8 gap-y-3"
            >
              {[
                { icon: FlaskConical, text: "98%+ Purity" },
                { icon: Truck, text: "Same-Day Shipping" },
                { icon: Package, text: "74+ Compounds" },
                { icon: MapPin, text: "US-Based" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2.5 text-sm text-emerald-800/50">
                  <b.icon className="h-4 w-4 text-emerald-600/70" />
                  {b.text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border border-emerald-200/40 bg-white/30 backdrop-blur-sm p-2">
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=500&fit=crop"
                alt="Premium research peptides"
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
