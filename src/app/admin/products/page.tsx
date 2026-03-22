import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;

  const searchQuery = typeof q === "string" ? q : undefined;

  const products = await prisma.product.findMany({
    where: searchQuery
      ? { name: { contains: searchQuery } }
      : undefined,
    include: {
      category: true,
      variants: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-950">Products</h1>
        <p className="text-sm text-emerald-800/50">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={searchQuery ?? ""}
          placeholder="Search products by name..."
          className="flex-1 max-w-md bg-white/50 border border-emerald-200/40 rounded-xl px-4 py-2.5 text-emerald-950 text-sm placeholder:text-emerald-950/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 text-sm font-medium rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white/50 backdrop-blur border border-emerald-200/40 rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <p className="text-emerald-800/50 text-sm py-12 text-center">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-emerald-800/50 border-b border-emerald-200/40 bg-white/500">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Category</th>
                  <th className="text-left px-6 py-4 font-medium">Variants</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Lowest Price
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Featured</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const lowestPrice =
                    product.variants.length > 0
                      ? Math.min(...product.variants.map((v) => v.price))
                      : null;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-emerald-100/40 hover:bg-white/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-emerald-400 hover:underline font-medium"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-emerald-950/50">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 text-emerald-950/50">
                        {product.variants.length}
                      </td>
                      <td className="px-6 py-4 text-emerald-950 font-medium">
                        {lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <Star
                            size={16}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ) : (
                          <Star size={16} className="text-emerald-950/20" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
