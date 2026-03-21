"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const removeItem = useCartStore((s) => s.removeItem);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", { ...form, items, total: totalPrice() });
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/20">
          <ShoppingBag className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-gray-400">
          Your order has been received. We will send a confirmation to your email.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-600" />
        <h1 className="mt-4 text-xl font-bold text-white">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-400">
          Browse our catalog and add products to get started.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </section>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">Checkout</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-5">
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <h2 className="text-lg font-semibold text-white">Shipping Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={update("name")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                Email
              </label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={update("email")}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Address
            </label>
            <input
              required
              type="text"
              placeholder="123 Research Blvd"
              value={form.address}
              onChange={update("address")}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                City
              </label>
              <input
                required
                type="text"
                placeholder="San Diego"
                value={form.city}
                onChange={update("city")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                State
              </label>
              <input
                required
                type="text"
                placeholder="CA"
                value={form.state}
                onChange={update("state")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">
                ZIP Code
              </label>
              <input
                required
                type="text"
                placeholder="92101"
                value={form.zip}
                onChange={update("zip")}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Place Order &mdash; ${(totalPrice() / 100).toFixed(2)}
          </button>
        </form>

        {/* ── Cart Summary ── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6">
            <h2 className="text-lg font-semibold text-white">Order Summary</h2>

            <ul className="mt-4 divide-y divide-white/5">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.variantLabel} &times; {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-600 transition hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">Total</span>
                <span className="text-lg font-bold text-white">
                  ${(totalPrice() / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
