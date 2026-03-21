import Link from "next/link";

const categoryMeta: Record<string, { gradient: string; emoji: string }> = {
  recovery: { gradient: "from-emerald-500/90 to-teal-700/90", emoji: "🔬" },
  metabolic: { gradient: "from-amber-500/90 to-orange-700/90", emoji: "⚡" },
  "growth-hormone": { gradient: "from-blue-500/90 to-indigo-700/90", emoji: "📈" },
  nootropic: { gradient: "from-violet-500/90 to-purple-700/90", emoji: "🧠" },
  longevity: { gradient: "from-cyan-500/90 to-blue-700/90", emoji: "♾️" },
  cosmetic: { gradient: "from-pink-500/90 to-rose-700/90", emoji: "✨" },
  "copper-peptide---cosmetic": { gradient: "from-amber-600/90 to-yellow-800/90", emoji: "🟤" },
  immune: { gradient: "from-green-500/90 to-emerald-700/90", emoji: "🛡️" },
  mitochondrial: { gradient: "from-sky-500/90 to-cyan-700/90", emoji: "🔋" },
  sleep: { gradient: "from-indigo-500/90 to-violet-700/90", emoji: "🌙" },
  stacks: { gradient: "from-emerald-400/90 to-cyan-600/90", emoji: "🧬" },
  "anti-inflammatory": { gradient: "from-teal-500/90 to-emerald-700/90", emoji: "💚" },
  reproductive: { gradient: "from-rose-500/90 to-pink-700/90", emoji: "🔄" },
  supplies: { gradient: "from-zinc-500/90 to-gray-700/90", emoji: "🧪" },
  antimicrobial: { gradient: "from-lime-500/90 to-green-700/90", emoji: "🦠" },
  antioxidant: { gradient: "from-yellow-500/90 to-amber-700/90", emoji: "🌿" },
  hormone: { gradient: "from-fuchsia-500/90 to-pink-700/90", emoji: "⚖️" },
  neuropeptide: { gradient: "from-purple-500/90 to-indigo-700/90", emoji: "🧬" },
  neuroprotective: { gradient: "from-blue-400/90 to-indigo-600/90", emoji: "🛡️" },
  "sexual-health": { gradient: "from-red-500/90 to-rose-700/90", emoji: "❤️" },
  tanning: { gradient: "from-orange-500/90 to-amber-700/90", emoji: "☀️" },
};

const fallback = { gradient: "from-emerald-600/90 to-teal-800/90", emoji: "💊" };

interface CategoryCardProps {
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, productCount }: CategoryCardProps) {
  const meta = categoryMeta[slug] ?? fallback;

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
    >
      <div className={`flex flex-col items-start justify-end bg-gradient-to-br ${meta.gradient} p-5 h-32 sm:h-36`}>
        <span className="text-2xl mb-2">{meta.emoji}</span>
        <h3 className="text-base font-bold text-white leading-tight">{name}</h3>
        <p className="text-xs text-white/70 mt-0.5">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/25 transition-colors" />
    </Link>
  );
}
