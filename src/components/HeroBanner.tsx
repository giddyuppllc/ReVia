"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Truck, Package, MapPin } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Warm animated gradient orbs */}
      <motion.div
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-amber-500/8 blur-[100px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-rose-500/5 blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-1/4 top-1/4 h-[250px] w-[250px] rounded-full bg-teal-400/6 blur-[90px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        {/* Floating stock images */}
        <motion.div
          className="absolute left-4 top-16 hidden lg:block"
          animate={{ y: [0, -12, 0], rotate: [-3, -1, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-emerald-900/30 border border-white/10" style={{ transform: "rotate(-6deg)" }}>
            <img
              src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop"
              alt="Laboratory research"
              className="h-36 w-48 object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          className="absolute right-4 bottom-24 hidden lg:block"
          animate={{ y: [0, 10, 0], rotate: [3, 5, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-cyan-900/30 border border-white/10" style={{ transform: "rotate(4deg)" }}>
            <img
              src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop"
              alt="Microscope research"
              className="h-36 w-48 object-cover"
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 px-4 py-1.5 text-xs font-medium tracking-wider text-emerald-400 uppercase">
            Trusted by Researchers Worldwide
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Fuel Your Research.{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
            Unlock Potential.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed"
        >
          Trusted by researchers worldwide. Premium peptides, fast shipping, and
          a community that believes in the science of tomorrow.
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
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30"
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

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
        >
          {[
            { icon: FlaskConical, label: "Lab Tested" },
            { icon: Truck, label: "Fast Shipping" },
            { icon: Package, label: "74+ Products" },
            { icon: MapPin, label: "US-Based" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <badge.icon className="h-4 w-4 text-emerald-400/70" />
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
