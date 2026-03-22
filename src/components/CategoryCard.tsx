import Link from "next/link";

const categoryMeta: Record<string, { gradient: string; emoji: string }> = {
  recovery: { gradient: "from-emerald-50 to-teal-100", emoji: "🔬" },
  metabolic: { gradient: "from-amber-50 to-orange-100", emoji: "⚡" },
  "growth-hormone": { gradient: "from-blue-50 to-indigo-100", emoji: "📈" },
  nootropic: { gradient: "from-violet-50 to-purple-100", emoji: "🧠" },
  longevity: { gradient: "from-cyan-50 to-blue-100", emoji: "♾️" },
  cosmetic: { gradient: "from-pink-50 to-rose-100", emoji: "✨" },
  "copper-peptide---cosmetic": { gradient: "from-amber-50 to-yellow-100", emoji: "🟤" },
  immune: { gradient: "from-green-50 to-emerald-100", emoji: "🛡️" },
  mitochondrial: { gradient: "from-sky-50 to-cyan-100", emoji: "🔋" },
  sleep: { gradient: "from-indigo-50 to-violet-100", emoji: "🌙" },
  stacks: { gradient: "from-emerald-50 to-cyan-100", emoji: "🧬" },
  "anti-inflammatory": { gradient: "from-teal-50 to-emerald-100", emoji: "💚" },
  reproductive: { gradient: "from-rose-50 to-pink-100", emoji: "🔄" },
  supplies: { gradient: "from-zinc-50 to-gray-100", emoji: "🧪" },
  antimicrobial: { gradient: "from-lime-50 to-green-100", emoji: "🦠" },
  antioxidant: { gradient: "from-yellow-50 to-amber-100", emoji: "🌿" },
  hormone: { gradient: "from-fuchsia-50 to-pink-100", emoji: "⚖️" },
  neuropeptide: { gradient: "from-purple-50 to-indigo-100", emoji: "🧬" },
  neuroprotective: { gradient: "from-blue-50 to-indigo-100", emoji: "🛡️" },
  "sexual-health": { gradient: "from-red-50 to-rose-100", emoji: "❤️" },
  tanning: { gradient: "from-orange-50 to-amber-100", emoji: "☀️" },
};

const fallback = { gradient: "from-emerald-50 to-teal-100", emoji: "💊" };

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
      className="group relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-200/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5 hover:bg-white/70"
    >
      <div className={`flex flex-col items-start justify-end bg-gradient-to-br ${meta.gradient} p-5 h-32 sm:h-36`}>
        <span className="text-2xl mb-2">{meta.emoji}</span>
        <h3 className="text-base font-bold text-emerald-900 leading-tight">{name}</h3>
        <p className="text-xs text-emerald-800/50 mt-0.5">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>
    </Link>
  );
}
