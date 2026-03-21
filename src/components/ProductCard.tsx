"use client";

import Link from "next/link";
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

const catColors: Record<string, string> = {
  Recovery: "from-emerald-600 to-teal-800",
  Metabolic: "from-amber-600 to-orange-800",
  "Growth Hormone": "from-blue-600 to-indigo-800",
  Nootropic: "from-violet-600 to-purple-800",
  Longevity: "from-cyan-600 to-blue-800",
  Cosmetic: "from-pink-600 to-rose-800",
  Immune: "from-green-600 to-emerald-800",
  Mitochondrial: "from-sky-600 to-cyan-800",
  Sleep: "from-indigo-600 to-violet-800",
  Stacks: "from-emerald-500 to-cyan-700",
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const cheapest = product.variants.length
    ? product.variants.reduce((min, v) => (v.price < min.price ? v : min), product.variants[0])
    : null;

  const hasMultiple = product.variants.length > 1;
  const catName = product.category?.name ?? "Peptide";
  const gradient = catColors[catName] ?? "from-emerald-600 to-teal-800";

  const handleAdd = (e: React.MouseEvent) => {
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
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] transition-all duration-300 hover:border-emerald-500/25 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40"
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute right-2.5 top-2.5 z-10">
          <WishlistButton productId={product.id} />
        </div>

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}>
            <span className="text-6xl font-black text-white/20 select-none">
              {catName.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#141414] to-transparent" />

        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
            {catName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="text-sm font-semibold text-gray-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-3">
          {cheapest && (
            <span className="text-base font-bold text-white">
              {hasMultiple && <span className="text-xs font-normal text-gray-500 mr-1">from</span>}
              ${cheapest.price.toFixed(2)}
            </span>
          )}

          {hasMultiple ? (
            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20 transition group-hover:bg-emerald-500/10">
              Options
            </span>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
