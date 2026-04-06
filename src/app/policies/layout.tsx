import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | ReVia Research Supply",
    default: "Policies | ReVia Research Supply",
  },
  description:
    "Legal policies and terms for ReVia Research Supply LLC, a provider of research-use-only peptides.",
};

const policyLinks = [
  { href: "/policies/terms", label: "Terms of Service" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/refunds", label: "Refund & Return Policy" },
  { href: "/policies/payments", label: "Payment Policy" },
  { href: "/policies/aup", label: "Acceptable Use Policy" },
  { href: "/policies/disclaimer", label: "Disclaimer" },
  { href: "/policies/cookies", label: "Cookie Policy" },
  { href: "/policies/ccpa", label: "CCPA Notice" },
];

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-legal min-h-screen text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-14">
          {/* Sidebar */}
          <aside className="mb-10 lg:mb-0">
            <nav className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-sky-200/40 bg-sky-50/60 backdrop-blur-sm p-4">
                <h2 className="mb-4 px-2 text-sm font-bold uppercase tracking-widest text-stone-700">
                  Legal &amp; Policies
                </h2>
                <ul className="space-y-1.5">
                  {policyLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl bg-white/70 border border-sky-200/40 px-4 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-white hover:shadow-sm hover:text-stone-800"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0">
            <article className="policy-content rounded-2xl border border-sky-200/40 bg-white/80 backdrop-blur-sm p-8 sm:p-10 shadow-sm">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
