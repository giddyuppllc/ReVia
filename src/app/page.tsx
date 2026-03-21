import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { FlaskConical, Truck, HeadphonesIcon, Atom } from "lucide-react";

const whyRevia = [
  {
    icon: FlaskConical,
    title: "Lab-Verified Purity",
    description:
      "Every batch is independently tested with HPLC and mass spectrometry. We publish full certificates of analysis so you never have to guess.",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16f461?w=400&h=250&fit=crop",
  },
  {
    icon: Truck,
    title: "Lightning-Fast Shipping",
    description:
      "Orders placed before 2 PM ship same day. Track your package in real time and get it at your bench when you need it.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=250&fit=crop",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Research Support",
    description:
      "Our team of scientists and peptide specialists is here to help with technical questions, dosing guidance, and protocol support.",
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400&h=250&fit=crop",
  },
  {
    icon: Atom,
    title: "74+ Premium Compounds",
    description:
      "From classic peptides to cutting-edge research compounds, our ever-growing catalog has what your lab needs to push boundaries.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
  },
];

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { variants: true, category: true },
    take: 8,
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <HeroBanner />

      {/* Why ReVia */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">
            Why Researchers Choose{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ReVia
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            We are not just another supplier. We are your research partner,
            obsessed with quality, speed, and your success.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyRevia.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-white/[0.06]"
            >
              <div className="h-36 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 h-36 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
              </div>
              <div className="relative p-5 pt-2">
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
          <Link
            href="/shop"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  price: v.price,
                })),
                category: { name: product.category.name },
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              productCount={cat._count.products}
            />
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-emerald-900/10 backdrop-blur p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Updated
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Get the latest research peptide news, new product alerts, and
            exclusive offers.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* RUO Banner */}
      <section className="bg-emerald-900/20 border-y border-emerald-900/30 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-emerald-400 mb-3">
            For Research Use Only
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            All products sold by ReVia are intended for laboratory research use
            only. They are not intended for human or animal consumption, or for
            use in the diagnosis, treatment, cure, or prevention of any disease.
          </p>
        </div>
      </section>
    </>
  );
}
