"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=stacks", label: "Stacks" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems)();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-200/60 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-emerald-700 tracking-tight">
          ReVia
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-emerald-900/70 transition-colors hover:text-emerald-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="hidden text-sm font-medium text-emerald-900/70 hover:text-emerald-700 sm:block">
                  Admin
                </Link>
              )}
              <Link href="/account" className="flex items-center gap-1.5 rounded-xl p-2 text-emerald-800/70 transition hover:bg-emerald-50" aria-label="Account">
                <User className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:inline">Account</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="hidden text-sm font-medium text-emerald-900/70 hover:text-emerald-700 sm:block">
              Login
            </Link>
          )}

          <button onClick={toggleCart} className="relative rounded-xl p-2 text-emerald-800/70 transition hover:bg-emerald-50" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-emerald-800/70 hover:bg-emerald-50 md:hidden" aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-emerald-100 bg-white/90 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-emerald-900/70 hover:bg-emerald-50">
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-emerald-900/70 hover:bg-emerald-50">
                  Account
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
