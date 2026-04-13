import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const rates = [
    { label: "Standard Shipping", price: 795, estimate: "5-7 business days", minOrder: 0 },
    { label: "Priority Shipping", price: 1295, estimate: "3-5 business days", minOrder: 20000 },
  ];

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { shippingRates: JSON.stringify(rates) },
    create: { id: "singleton", shippingRates: JSON.stringify(rates) },
  });

  console.log("✅ Shipping rates set: Standard $7.95, Priority $12.95 ($200+)");
}

main().finally(() => prisma.$disconnect());
