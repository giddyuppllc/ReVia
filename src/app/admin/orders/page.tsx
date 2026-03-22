import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { status } = await searchParams;

  const statusFilter = typeof status === "string" ? status : undefined;

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-950">Orders</h1>
        <p className="text-sm text-emerald-800/50">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !statusFilter
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/50 text-emerald-950/50 border border-emerald-200/40 hover:text-emerald-950 hover:bg-emerald-50"
          }`}
        >
          All
        </Link>
        {allStatuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/50 text-emerald-950/50 border border-emerald-200/40 hover:text-emerald-950 hover:bg-emerald-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white/50 backdrop-blur border border-emerald-200/40 rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-emerald-800/50 text-sm py-12 text-center">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-emerald-800/50 border-b border-emerald-200/40 bg-white/500">
                  <th className="text-left px-6 py-4 font-medium">Order ID</th>
                  <th className="text-left px-6 py-4 font-medium">Customer</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Items</th>
                  <th className="text-left px-6 py-4 font-medium">Total</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                  <th className="text-left px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-emerald-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-emerald-400 hover:underline font-mono text-xs"
                      >
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-emerald-950/80">{order.name}</td>
                    <td className="px-6 py-4 text-emerald-950/50">{order.email}</td>
                    <td className="px-6 py-4 text-emerald-950/50">
                      {order.items.length}
                    </td>
                    <td className="px-6 py-4 text-emerald-950 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-500/20 text-emerald-800/50"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-950/50">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
