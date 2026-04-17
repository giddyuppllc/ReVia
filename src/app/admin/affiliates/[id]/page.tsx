import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Link2, Users, ShoppingCart, DollarSign, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const affiliate = await prisma.affiliate.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (!affiliate) return notFound();

  const orders = await prisma.order.findMany({
    where: { affiliateId: id },
    include: {
      user: { select: { id: true, email: true, name: true } },
      coupon: { select: { code: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate unique customers
  const customerMap = new Map<string, { email: string; name: string; orders: number; spent: number }>();
  for (const o of orders) {
    const key = o.user?.email || o.email;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orders += 1;
      existing.spent += o.total;
    } else {
      customerMap.set(key, {
        email: key,
        name: o.user?.name || o.name || "—",
        orders: 1,
        spent: o.total,
      });
    }
  }
  const customers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent);

  // Aggregate promo codes used
  const promoMap = new Map<string, number>();
  for (const o of orders) {
    if (o.coupon?.code) {
      promoMap.set(o.coupon.code, (promoMap.get(o.coupon.code) ?? 0) + 1);
    }
  }
  const promoCodes = Array.from(promoMap.entries()).sort((a, b) => b[1] - a[1]);

  const owed = affiliate.totalCommission - affiliate.paidCommission;

  return (
    <div className="space-y-6">
      <Link href="/admin/affiliates" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to affiliates
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-neutral-900">{affiliate.user.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${affiliate.status === "approved" ? "bg-emerald-100 text-emerald-700" : affiliate.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{affiliate.status}</span>
            </div>
            <p className="text-sm text-neutral-500">{affiliate.user.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-sky-500" />
              <span className="font-mono text-sm font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg">{affiliate.affiliateCode}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Commission Rate</p>
            <p className="text-3xl font-bold text-neutral-900">{affiliate.commissionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Clicks" value={affiliate.totalClicks.toLocaleString()} icon={<Link2 className="h-4 w-4 text-sky-500" />} />
          <Stat label="Orders" value={affiliate.totalOrders.toLocaleString()} icon={<ShoppingCart className="h-4 w-4 text-emerald-500" />} />
          <Stat label="Revenue" value={`$${(affiliate.totalRevenue / 100).toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-purple-500" />} />
          <Stat label={owed > 0 ? "Owed" : "Paid"} value={`$${((owed > 0 ? owed : affiliate.paidCommission) / 100).toFixed(2)}`} icon={<DollarSign className={`h-4 w-4 ${owed > 0 ? "text-amber-500" : "text-emerald-500"}`} />} />
        </div>
      </div>

      {/* Customers */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-4">
          <Users className="h-5 w-5 text-neutral-400" /> Customers <span className="text-sm font-normal text-neutral-400">({customers.length})</span>
        </h2>
        {customers.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No orders attributed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-400">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium text-right">Orders</th>
                  <th className="py-2 font-medium text-right">Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2.5 pr-4 text-neutral-800">{c.name}</td>
                    <td className="py-2.5 pr-4 text-neutral-500">{c.email}</td>
                    <td className="py-2.5 pr-4 text-neutral-800 text-right">{c.orders}</td>
                    <td className="py-2.5 text-right text-neutral-800">${(c.spent / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Promo codes */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-4">
          <Ticket className="h-5 w-5 text-neutral-400" /> Promo Codes Used
        </h2>
        {promoCodes.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No promo codes used by referred orders.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {promoCodes.map(([code, count]) => (
              <span key={code} className="inline-flex items-center gap-2 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1.5 text-sm">
                <span className="font-mono font-semibold text-sky-700">{code}</span>
                <span className="text-xs text-neutral-500">{count} use{count !== 1 ? "s" : ""}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Orders */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-4">
          <ShoppingCart className="h-5 w-5 text-neutral-400" /> Attributed Orders <span className="text-sm font-normal text-neutral-400">({orders.length})</span>
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-400">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Invoice</th>
                  <th className="py-2 pr-4 font-medium">Customer</th>
                  <th className="py-2 pr-4 font-medium">Promo</th>
                  <th className="py-2 pr-4 font-medium">Payment</th>
                  <th className="py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const commission = Math.round(o.total * (affiliate.commissionRate / 100));
                  return (
                    <tr key={o.id} className="border-b border-neutral-100 last:border-0">
                      <td className="py-2.5 pr-4 text-neutral-500">{o.createdAt.toLocaleDateString()}</td>
                      <td className="py-2.5 pr-4">
                        <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs text-sky-600 hover:text-sky-500">{o.invoiceNumber}</Link>
                      </td>
                      <td className="py-2.5 pr-4 text-neutral-700">{o.user?.name || o.name}<br /><span className="text-xs text-neutral-400">{o.user?.email || o.email}</span></td>
                      <td className="py-2.5 pr-4">{o.coupon?.code ? <span className="font-mono text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded">{o.coupon.code}</span> : <span className="text-neutral-300">—</span>}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs rounded-full px-2 py-0.5 ${o.paymentStatus === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{o.paymentStatus}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="text-neutral-800 font-medium">${(o.total / 100).toFixed(2)}</div>
                        <div className="text-xs text-emerald-600">+${(commission / 100).toFixed(2)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
      <div className="flex items-center justify-between mb-1">
        {icon}
      </div>
      <p className="text-lg font-bold text-neutral-900">{value}</p>
      <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
