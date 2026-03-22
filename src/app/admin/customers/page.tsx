import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-950">Customers</h1>
        <p className="text-sm text-emerald-800/50">
          {users.length} user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white/50 backdrop-blur border border-emerald-200/40 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <p className="text-emerald-800/50 text-sm py-12 text-center">
            No customers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-emerald-800/50 border-b border-emerald-200/40 bg-white/500">
                  <th className="text-left px-6 py-4 font-medium">Name</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">Role</th>
                  <th className="text-left px-6 py-4 font-medium">
                    Registered
                  </th>
                  <th className="text-left px-6 py-4 font-medium">Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-emerald-100/40 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-emerald-950 font-medium">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-950/50">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-white/10 text-emerald-950/50"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-950/50">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-emerald-950/70">
                      {user._count.orders}
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
