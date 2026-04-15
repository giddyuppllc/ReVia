import { prisma } from "@/lib/prisma";
import AdminProductTable from "@/components/AdminProductTable";
import AddProductForm from "@/components/AddProductForm";
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variants: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Products</h1>
        <p className="text-sm text-stone-500">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      <AddProductForm categories={categories.map(c => ({ id: c.id, name: c.name }))} />

      <AdminProductTable
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          active: p.active,
          featured: p.featured,
          category: { name: p.category.name },
          variants: p.variants.map((v) => ({ price: v.price, label: v.label })),
        }))}
      />
    </div>
  );
}
