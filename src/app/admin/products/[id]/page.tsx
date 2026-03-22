import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductEditForm from "@/components/ProductEditForm";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, category: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm text-emerald-800/50 hover:text-emerald-950/70 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-950">{product.name}</h1>
        <span className="text-sm text-emerald-950/30">ID: {product.id}</span>
      </div>

      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
