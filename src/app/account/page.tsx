import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
  Package,
  ShoppingBag,
  Mail,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account | ReVia",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── Welcome header with avatar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-stone-500 text-sm">
            Manage your profile and orders.
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* ── Quick action cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/shop"
          className="group flex items-center gap-4 rounded-2xl border border-sky-200/40 bg-white/80 p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50">
            <ShoppingBag className="h-5 w-5 text-sky-500" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-800">Shop</p>
            <p className="text-xs text-stone-400">Browse catalog</p>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
        </Link>

        <Link
          href="/contact"
          className="group flex items-center gap-4 rounded-2xl border border-sky-200/40 bg-white/80 p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100/80 border border-sky-200/50">
            <Mail className="h-5 w-5 text-sky-500" strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-800">Support</p>
            <p className="text-xs text-stone-400">Get in touch</p>
          </div>
          <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
        </Link>
      </div>

      {/* ── Profile card ── */}
      <div className="mb-8 rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-stone-900">Profile</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-stone-400">Name</p>
            <p className="text-sm font-medium text-stone-800">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Email</p>
            <p className="text-sm font-medium text-stone-800">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Member Since</p>
            <p className="text-sm font-medium text-stone-800">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {user.role === "admin" && (
            <div>
              <p className="text-xs text-stone-400">Role</p>
              <p className="text-sm font-medium text-stone-800 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Order History ── */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-stone-900">Order History</h2>
          {orders.length > 0 && (
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span>
                <span className="font-semibold text-stone-700">{orders.length}</span> order{orders.length !== 1 ? "s" : ""}
              </span>
              <span>
                <span className="font-semibold text-stone-700">${totalSpent.toFixed(2)}</span> total
              </span>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-10 w-10 text-stone-300 mb-3" />
            <p className="text-stone-500 mb-4">No orders yet</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-sky-100 bg-sky-50/30 p-4 transition-colors hover:bg-sky-50/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-stone-800">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide capitalize text-sky-600">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-xs text-stone-500">
                      {item.productName} — {item.variantLabel} &times; {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
