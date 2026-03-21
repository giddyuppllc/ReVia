import Link from "next/link";

const categoryImages: Record<string, { image: string; gradient: string }> = {
  recovery: {
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    gradient: "from-emerald-600/80 to-teal-900/90",
  },
  metabolic: {
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
    gradient: "from-amber-600/80 to-orange-900/90",
  },
  "growth-hormone": {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    gradient: "from-blue-600/80 to-indigo-900/90",
  },
  nootropic: {
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    gradient: "from-violet-600/80 to-purple-900/90",
  },
  longevity: {
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    gradient: "from-cyan-600/80 to-blue-900/90",
  },
  cosmetic: {
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop",
    gradient: "from-pink-600/80 to-rose-900/90",
  },
  immune: {
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    gradient: "from-green-600/80 to-emerald-900/90",
  },
  mitochondrial: {
    image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop",
    gradient: "from-sky-600/80 to-cyan-900/90",
  },
  sleep: {
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop",
    gradient: "from-indigo-600/80 to-violet-900/90",
  },
  stacks: {
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    gradient: "from-emerald-500/80 to-cyan-900/90",
  },
  "anti-inflammatory": {
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop",
    gradient: "from-teal-600/80 to-emerald-900/90",
  },
  reproductive: {
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop",
    gradient: "from-rose-600/80 to-pink-900/90",
  },
  supplies: {
    image: "https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=400&h=300&fit=crop",
    gradient: "from-zinc-600/80 to-gray-900/90",
  },
};

const fallback = {
  image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
  gradient: "from-emerald-600/80 to-emerald-900/90",
};

interface CategoryCardProps {
  name: string;
  slug: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, productCount }: CategoryCardProps) {
  const config = categoryImages[slug] ?? fallback;

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/20"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={config.image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center px-6 py-16">
        <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-white drop-shadow-md">
          {name}
        </h3>
        <p className="mt-1 text-sm text-gray-300/80 drop-shadow-sm">
          {productCount} {productCount === 1 ? "product" : "products"}
        </p>
      </div>
    </Link>
  );
}
