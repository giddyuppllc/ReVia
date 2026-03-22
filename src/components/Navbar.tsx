"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=stacks", label: "Stacks" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-emerald-700 tracking-tight">
          ReVia
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Auth links */}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:block"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:inline">Account</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:block"
            >
              Login
            </Link>
          )}

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    Account
                  </Link>
                </li>
                {user.role === "admin" && (
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      Admin
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-neutral-50"
                >
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
