import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RENAMES: Record<string, { name: string; description: string }> = {
  "growth-hormone": { name: "Performance & GH Research", description: "Growth hormone secretagogues and performance research peptides." },
  "sexual-health": { name: "Specialty Research", description: "Specialty research peptides." },
  "hormone": { name: "Endocrine Research", description: "Endocrine system research peptides." },
  "anti-inflammatory": { name: "Inflammatory Response Research", description: "Peptides studied for inflammatory response pathways." },
  "tanning": { name: "Melanogenesis Research", description: "Peptides studied for melanogenesis and pigmentation pathways." },
  "immune": { name: "Immune Modulation Research", description: "Immune-modulating research peptides." },
  "neuroprotective": { name: "Neuroprotection Research", description: "Neuroprotective research peptides." },
  "sleep": { name: "Circadian Research", description: "Peptides studied for circadian rhythm and sleep architecture." },
  "reproductive": { name: "Reproductive Biology Research", description: "Reproductive biology research peptides." },
};

async function main() {
  console.log("🏷️  Renaming categories for CC compliance...\n");

  for (const [slug, update] of Object.entries(RENAMES)) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { name: update.name, description: update.description },
      });
      console.log(`✅ ${cat.name} → ${update.name}`);
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }

  console.log("\n✅ Done");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
