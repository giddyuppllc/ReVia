"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import WishlistButton from "@/components/WishlistButton";

interface Variant {
  id: string;
  label: string;
  price: number;
  [key: string]: unknown;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  category?: { name: string } | null;
  variants: Variant[];
  [key: string]: unknown;
}

const categoryGradients: Record<string, string> = {
  Recovery: "from-emerald-700/50 via-teal-800/40 to-emerald-900/60",
  Metabolic: "from-amber-700/50 via-orange-800/40 to-amber-900/60",
  "Growth Hormone": "from-blue-700/50 via-indigo-800/40 to-blue-900/60",
  Nootropic: "from-violet-700/50 via-purple-800/40 to-violet-900/60",
  Longevity: "from-cyan-700/50 via-blue-800/40 to-cyan-900/60",
  Cosmetic: "from-pink-700/50 via-rose-800/40 to-pink-900/60",
  Immune: "from-green-700/50 via-emerald-800/40 to-green-900/60",
  Mitochondrial: "from-sky-700/50 via-cyan-800/40 to-sky-900/60",
  Sleep: "from-indigo-700/50 via-violet-800/40 to-indigo-900/60",
  Stacks: "from-emerald-600/50 via-cyan-800/40 to-emerald-900/60",
  "Anti-Inflammatory": "from-teal-700/50 via-emerald-800/40 to-teal-900/60",
  Reproductive: "from-rose-700/50 via-pink-800/40 to-rose-900/60",
  Supplies: "from-zinc-600/50 via-gray-800/40 to-zinc-900/60",
};

function MolecularPattern({ category }: { category: string }) {
  const cat = category.toLowerCase();
  if (cat.includes("growth") || cat.includes("recovery")) {
    // DNA Helix pattern
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 200">
        <path d="M60 20 Q100 50 140 20 Q100 50 60 80 Q100 110 140 80 Q100 110 60 140 Q100 170 140 140 Q100 170 60 200" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40" />
        <path d="M60 20 L140 20 M60 80 L140 80 M60 140 L140 140" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20" strokeDasharray="4 4" />
        <circle cx="60" cy="20" r="4" className="fill-white/30" />
        <circle cx="140" cy="20" r="4" className="fill-white/30" />
        <circle cx="60" cy="80" r="4" className="fill-white/30" />
        <circle cx="140" cy="80" r="4" className="fill-white/30" />
        <circle cx="60" cy="140" r="4" className="fill-white/30" />
        <circle cx="140" cy="140" r="4" className="fill-white/30" />
      </svg>
    );
  }
  if (cat.includes("nootropic") || cat.includes("sleep")) {
    // Brain/neural pattern
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20" strokeDasharray="6 4" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/15" strokeDasharray="3 6" />
        <line x1="100" y1="30" x2="100" y2="70" stroke="currentColor" strokeWidth="1" className="text-white/25" />
        <line x1="130" y1="100" x2="170" y2="100" stroke="currentColor" strokeWidth="1" className="text-white/25" />
        <line x1="70" y1="100" x2="30" y2="100" stroke="currentColor" strokeWidth="1" className="text-white/25" />
        <line x1="100" y1="130" x2="100" y2="170" stroke="currentColor" strokeWidth="1" className="text-white/25" />
        <circle cx="100" cy="30" r="5" className="fill-white/25" />
        <circle cx="170" cy="100" r="5" className="fill-white/25" />
        <circle cx="30" cy="100" r="5" className="fill-white/25" />
        <circle cx="100" cy="170" r="5" className="fill-white/25" />
      </svg>
    );
  }
  // Default molecular structure
  return (
    <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 200 200">
      <circle cx="100" cy="80" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30" />
      <circle cx="60" cy="140" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30" />
      <circle cx="140" cy="140" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30" />
      <circle cx="160" cy="60" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30" />
      <line x1="100" y1="96" x2="60" y2="128" stroke="currentColor" strokeWidth="1.5" className="text-white/25" />
      <line x1="100" y1="96" x2="140" y2="128" stroke="currentColor" strokeWidth="1.5" className="text-white/25" />
      <line x1="116" y1="74" x2="152" y2="62" stroke="currentColor" strokeWidth="1.5" className="text-white/25" />
      <circle cx="100" cy="80" r="5" className="fill-white/20" />
      <circle cx="60" cy="140" r="4" className="fill-white/20" />
      <circle cx="140" cy="140" r="4" className="fill-white/20" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const cheapest = product.variants.length
    ? product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0])
    : null;

  const hasMultipleVariants = product.variants.length > 1;
  const categoryName = product.category?.name ?? "Peptide";
  const initial = categoryName.charAt(0).toUpperCase();
  const gradient = categoryGradients[categoryName] ?? "from-emerald-700/50 via-teal-800/40 to-emerald-900/60";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cheapest) return;
    addItem({
      variantId: cheapest.id,
      productName: product.name,
      variantLabel: cheapest.label,
      price: cheapest.price,
      slug: product.slug,
      image: product.image ?? undefined,
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition-colors hover:border-emerald-500/30"
      >
        {/* Image / Placeholder */}
        <div className="relative aspect-square w-full overflow-hidden">
          <div className="absolute right-2 top-2 z-10">
            <WishlistButton productId={product.id} />
          </div>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
              <MolecularPattern category={categoryName} />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />
              <span className="relative z-10 text-5xl font-bold text-white/50 drop-shadow-lg">{initial}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
            {categoryName}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-gray-100 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            {cheapest && (
              <span className="text-sm font-medium text-gray-300">
                {hasMultipleVariants ? "From " : ""}${cheapest.price.toFixed(2)}
              </span>
            )}

            {hasMultipleVariants ? (
              <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors group-hover:bg-emerald-500/10">
                View Options
              </span>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
