import Link from "next/link";

const gradients: Record<string, string> = {
  peptides: "from-emerald-900/60 to-emerald-700/30",
  stacks: "from-cyan-900/60 to-cyan-700/30",
  accessories: "from-violet-900/60 to-violet-700/30",
  sarms: "from-amber-900/60 to-amber-700/30",
  nootropics: "from-rose-900/60 to-rose-700/30",
};

const fallbackGradient = "from-emerald-900/60 to-emerald-700/30";

interface CategoryCardProps {
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, productCount }: CategoryCardProps) {
  const gradient = gradients[slug] ?? fallbackGradient;

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-emerald-500/30"
    >
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradient} px-6 py-10`}
      >
        <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-emerald-400">
          {name}
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>
    </Link>
  );
}
