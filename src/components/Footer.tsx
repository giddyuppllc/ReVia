"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import type { ComponentProps, ReactNode, SVGProps } from "react";

function Facebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.7c0-.85.24-1.43 1.46-1.43h1.55V4.64a20.9 20.9 0 0 0-2.27-.11c-2.25 0-3.79 1.37-3.79 3.88v2.16H7.9v2.94h2.55V21h3.05Z" />
    </svg>
  );
}

function Instagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.5h3.52V21H3.2V8.5Zm5.72 0h3.37v1.71h.05c.47-.9 1.62-1.85 3.33-1.85 3.56 0 4.22 2.34 4.22 5.39V21h-3.52v-6.28c0-1.5-.03-3.43-2.09-3.43-2.09 0-2.41 1.64-2.41 3.33V21H8.92V8.5Z" />
    </svg>
  );
}

function TikTok(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1.84-.39Z" />
    </svg>
  );
}

const footerSections = [
  {
    label: "Shop",
    links: [
      { title: "All Products", href: "/shop" },
      { title: "Peptides", href: "/shop?category=peptides" },
      { title: "Stacks", href: "/shop?category=stacks" },
      { title: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  {
    label: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Why Us", href: "/why-us" },
      { title: "Articles", href: "/learn?tab=articles" },
      { title: "Research", href: "/learn?tab=research" },
      { title: "Contact", href: "/contact" },
      { title: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Legal",
    links: [
      { title: "Terms", href: "/policies/terms" },
      { title: "Privacy", href: "/policies/privacy" },
      { title: "Shipping", href: "/policies/shipping" },
      { title: "Refund Policy", href: "/policies/refunds" },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "Facebook", href: "https://facebook.com/revialife", icon: Facebook, external: true },
      { title: "Instagram", href: "https://instagram.com/revia.life", icon: Instagram, external: true },
      { title: "TikTok", href: "https://tiktok.com/@revia.life", icon: TikTok, external: true },
      { title: "LinkedIn", href: "https://linkedin.com/company/revialife", icon: LinkedIn, external: true },
    ],
  },
];

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  className?: ComponentProps<typeof motion.div>["className"];
  delay?: number;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="font-legal relative w-full border-t border-sky-200/40 bg-sky-50/60">
      <div className="bg-sky-400/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="mx-auto max-w-7xl px-6 py-5 lg:py-6">
        <div className="grid w-full gap-6 xl:grid-cols-3 xl:gap-8">
          {/* Brand column */}
          <AnimatedContainer className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="ReVia logo" width={32} height={32} className="h-8 w-8" />
              <Image src="/images/revia-text.png" alt="ReVia" width={100} height={30} className="h-6 w-auto" />
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Premium peptides, independently verified to &gt;99% purity.
              Your trusted source since 2024.
            </p>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Mail className="h-4 w-4 text-sky-500" />
              <a href="mailto:contact@revialife.com" className="hover:text-sky-600 transition-colors">
                contact@revialife.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Phone className="h-4 w-4 text-sky-500" />
              <a href="tel:+13052901462" className="hover:text-sky-600 transition-colors">
                (305) 290-1462
              </a>
            </div>
          </AnimatedContainer>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8 xl:col-span-2">
            {footerSections.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
                <div className="mb-6 md:mb-0">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {section.label}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {section.links.map((link) => {
                      const isExternal = "external" in link && link.external;
                      return (
                        <li key={link.title}>
                          <Link
                            href={link.href}
                            {...(isExternal && { target: "_blank", rel: "noreferrer" })}
                            className="inline-flex items-center text-sm text-stone-500 transition-all duration-300 hover:text-sky-600"
                          >
                            {"icon" in link && link.icon && (
                              <link.icon className="mr-1.5 h-4 w-4" />
                            )}
                            {link.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <AnimatedContainer delay={0.6} className="mt-4 border-t border-sky-200/30 pt-3 text-center space-y-1.5">
          <p className="text-[10px] text-stone-400 leading-relaxed max-w-6xl mx-auto">
            All products sold by ReVia carry a Research Use Only (RUO) designation as required by current US regulations and are intended for laboratory research use only. They are not intended for human or animal consumption, or for use in the diagnosis, treatment, cure, or prevention of any disease. This designation is standard practice for compounds awaiting formal FDA classification and does not reflect the quality, purity, or manufacturing standard. Our formulations meet research-grade specifications and are manufactured to physician-use (PUD) standards throughout.
          </p>
          <p className="text-[10px] text-stone-400">
            &copy; 2024&ndash;{new Date().getFullYear()} ReVia LLC. All rights reserved.
          </p>
        </AnimatedContainer>
      </div>
    </footer>
  );
}
