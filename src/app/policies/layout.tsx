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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="mb-10 lg:mb-0">
            <nav className="sticky top-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Legal &amp; Policies
              </h2>
              <ul className="space-y-1">
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0">
            <article className="prose prose-gray max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-semibold prose-h3:text-lg prose-h3:font-medium prose-p:leading-7 prose-li:leading-7">
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
