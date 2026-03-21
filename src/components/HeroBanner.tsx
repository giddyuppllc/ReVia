"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-[100px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-600/5 blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium tracking-wider text-emerald-400 uppercase">
            Research-Grade Compounds
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Research-Grade{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Peptides
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed"
        >
          Premium quality compounds for scientific research. Rigorous testing. Fast shipping.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
          >
            Shop Now
          </Link>
          <Link
            href="/shop?category=stacks"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            View Stacks
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
