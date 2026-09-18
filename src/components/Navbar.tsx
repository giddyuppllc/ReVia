"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { motion } from "framer-motion";
import PartnerShopButton from "@/components/PartnerShopButton";

/*
 * The nav a brand-and-record site should have.
 *
 * It led with "Shop" on a site that sells nothing, and it did not carry
 * /washington or /research at all — so Mike Stone's five statements to the FDA
 * advisory committee, 3,300 words of verbatim public record with webcast
 * timecodes, and the 38-compound library were reachable only from a footer link
 * and a guess. Those are the two strongest things here and they were the two
 * hardest to find.
 *
 * Ordered as an argument rather than as a menu: what we stand on (Washington),
 * what we publish (Research, News), what we are (About).
 */
const navLinks = [
  { href: "/washington", label: "Washington" },
  { href: "/research", label: "Research" },
  { href: "/news", label: "News" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200/60 bg-stone-50/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full items-center px-3 py-3 sm:px-4 lg:px-6">
        {/* Left — Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Image src="/images/logo.png" alt="ReVia logo" width={36} height={36} className="h-8 w-8" />
            <Image src="/images/revia-text.png" alt="ReVia" width={90} height={28} className="h-7 w-auto" />
          </Link>
        </div>

        {/* Center — Nav links */}
        <ul className="hidden md:flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <motion.li key={link.href} className="relative" whileHover="hover" initial="rest" animate="rest">
              <Link href={link.href} className="relative block pb-1">
                <motion.span
                  className="text-sm font-semibold uppercase tracking-wide inline-block"
                  variants={{
                    rest: { color: "#78716c" },
                    hover: { color: "#A38569", y: -1 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
                {/* Resting underline */}
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-300/50 rounded-full" />
                {/* Animated fill underline */}
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] bg-sky-500 rounded-full"
                  variants={{
                    rest: { width: 0 },
                    hover: { width: "100%" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Right — Actions */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* US Manufactured badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-sky-200/60 bg-sky-50/80 px-3 py-1.5 sm:flex">
            <Image src="/images/us-flag.png" alt="US Flag" width={20} height={14} className="h-3.5 w-5 object-contain" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-600">US Made</span>
          </div>

          {/* Accounts, admin and login went with the store. Nothing here needs
              a session any more. */}
          <PartnerShopButton audience="d2c" size="sm" variant="outline" className="hidden sm:inline-flex">
            Where to buy
          </PartnerShopButton>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 text-stone-600 hover:bg-sky-50 md:hidden" aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-sky-100 bg-white/90 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-600 hover:bg-sky-50">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <PartnerShopButton audience="d2c" size="md" variant="outline" className="w-full justify-center">
                Where to buy
              </PartnerShopButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
