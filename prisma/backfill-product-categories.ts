import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config();

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, categoryId: true, tags: true },
  });
  const categories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const categoryBySlug = new Map(categories.map((c) => [c.slug.toLowerCase(), c]));
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));

  let linked = 0;
  let skipped = 0;

  for (const p of products) {
    const targetCategoryIds = new Set<string>();
    // Primary category
    targetCategoryIds.add(p.categoryId);

    // Parse tags (legacy secondary category hack)
    let tagList: string[] = [];
    try {
      const parsed = JSON.parse(p.tags || "[]");
      if (Array.isArray(parsed)) tagList = parsed.filter((t): t is string => typeof t === "string");
    } catch { /* tags isn't JSON, treat as comma-separated */
      tagList = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    for (const tag of tagList) {
      const lower = tag.toLowerCase();
      const match = categoryBySlug.get(lower) || categoryByName.get(lower);
      if (match) targetCategoryIds.add(match.id);
    }

    for (const categoryId of targetCategoryIds) {
      try {
        await prisma.productCategory.upsert({
          where: { productId_categoryId: { productId: p.id, categoryId } },
          update: {},
          create: { productId: p.id, categoryId },
        });
        linked += 1;
      } catch {
        skipped += 1;
      }
    }
  }

  console.log(`Backfill complete: ${linked} links created/ensured, ${skipped} skipped (errors).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
