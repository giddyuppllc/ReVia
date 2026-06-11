const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const coupons = await p.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('All coupons:');
  for (const c of coupons) {
    console.log(' -', c.code, '| type:', c.type, '| value:', c.value, '| active:', c.active, '| used:', c.usedCount + '/' + c.maxUses, '| minOrder:', c.minOrder);
  }
  await p.$disconnect();
})().catch(e => { console.error(e.message); process.exit(1); });
