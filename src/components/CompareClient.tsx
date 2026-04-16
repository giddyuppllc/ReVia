"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical, ShieldCheck, X, Plus } from "lucide-react";
import { researchCompounds } from "@/data/research-compounds";

interface Product {
  id: string; name: string; slug: string; description: string | null;
  categoryName: string; coaUrl: string | null;
  variants: Array<{ label: string; price: number; stockStatus: string }>;
}

export default function CompareClient({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const addProduct = (slug: string) => {
    if (selected.length >= 3 || selected.includes(slug)) return;
    setSelected((prev) => [...prev, slug]);
  };

  const removeProduct = (slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug));
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName.toLowerCase().includes(search.toLowerCase());
  });

  const selectedProducts = selected.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean) as Product[];

  // Match research compound data
  const getResearchData = (slug: string) => {
    return researchCompounds.find((c) => c.slug === slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-2">Research Tool</p>
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Compare Compounds</h1>
        <p className="text-sm text-stone-500 mt-2">Select up to 3 compounds to compare mechanisms, pricing, and availability side by side.</p>
      </div>

      {/* Product selector */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search compounds..."
          className="w-full max-w-md rounded-xl border border-sky-200/50 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-sky-400 mb-4"
        />
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
          {filtered.slice(0, 40).map((p) => (
            <button
              key={p.slug}
              onClick={() => selected.includes(p.slug) ? removeProduct(p.slug) : addProduct(p.slug)}
              disabled={selected.length >= 3 && !selected.includes(p.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selected.includes(p.slug)
                  ? "bg-sky-500 text-white"
                  : "bg-white border border-sky-200/50 text-stone-600 hover:bg-sky-50 disabled:opacity-30"
              }`}
            >
              {selected.includes(p.slug) ? <X className="h-3 w-3 inline mr-1" /> : <Plus className="h-3 w-3 inline mr-1" />}
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {selectedProducts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-12 text-center">
          <FlaskConical className="h-10 w-10 text-sky-300 mx-auto mb-3" />
          <p className="text-stone-500">Select 2-3 compounds above to compare them</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sky-200">
                <th className="text-left py-3 px-4 text-xs text-stone-500 uppercase tracking-wider w-40">Attribute</th>
                {selectedProducts.map((p) => (
                  <th key={p.slug} className="text-left py-3 px-4 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <Link href={`/shop/${p.slug}`} className="font-semibold text-sky-600 hover:underline">{p.name}</Link>
                      <button onClick={() => removeProduct(p.slug)} className="text-stone-300 hover:text-red-500"><X className="h-4 w-4" /></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-sky-100">
                <td className="py-3 px-4 text-stone-500 font-medium">Category</td>
                {selectedProducts.map((p) => <td key={p.slug} className="py-3 px-4 text-stone-800">{p.categoryName}</td>)}
              </tr>
              <tr className="border-b border-sky-100 bg-sky-50/30">
                <td className="py-3 px-4 text-stone-500 font-medium">Description</td>
                {selectedProducts.map((p) => <td key={p.slug} className="py-3 px-4 text-stone-600 text-xs leading-relaxed">{p.description || "—"}</td>)}
              </tr>
              <tr className="border-b border-sky-100">
                <td className="py-3 px-4 text-stone-500 font-medium">Mechanism</td>
                {selectedProducts.map((p) => {
                  const rd = getResearchData(p.slug);
                  return <td key={p.slug} className="py-3 px-4 text-stone-600 text-xs leading-relaxed">{rd?.mechanism || "—"}</td>;
                })}
              </tr>
              <tr className="border-b border-sky-100 bg-sky-50/30">
                <td className="py-3 px-4 text-stone-500 font-medium">Research Applications</td>
                {selectedProducts.map((p) => {
                  const rd = getResearchData(p.slug);
                  return (
                    <td key={p.slug} className="py-3 px-4">
                      {rd?.researchApplications?.length ? (
                        <ul className="text-xs text-stone-600 space-y-0.5">
                          {rd.researchApplications.slice(0, 4).map((a, i) => (
                            <li key={i} className="flex items-start gap-1"><ArrowRight className="h-3 w-3 text-sky-400 shrink-0 mt-0.5" />{a}</li>
                          ))}
                        </ul>
                      ) : "—"}
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-sky-100">
                <td className="py-3 px-4 text-stone-500 font-medium">Available Sizes</td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.variants.map((v) => (
                        <span key={v.label} className={`rounded px-2 py-0.5 text-xs ${v.stockStatus === "in_stock" ? "bg-emerald-50 text-emerald-700" : v.stockStatus === "pre_order" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                          {v.label}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-sky-100 bg-sky-50/30">
                <td className="py-3 px-4 text-stone-500 font-medium">Starting Price</td>
                {selectedProducts.map((p) => {
                  const min = Math.min(...p.variants.map((v) => v.price));
                  return <td key={p.slug} className="py-3 px-4 text-lg font-bold text-stone-900">${(min / 100).toFixed(2)}</td>;
                })}
              </tr>
              <tr className="border-b border-sky-100">
                <td className="py-3 px-4 text-stone-500 font-medium">COA</td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="py-3 px-4">
                    {p.coaUrl ? (
                      <a href={p.coaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-600 hover:underline">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </a>
                    ) : (
                      <span className="text-xs text-stone-400">Not available</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-sky-100 bg-sky-50/30">
                <td className="py-3 px-4 text-stone-500 font-medium">Key Studies</td>
                {selectedProducts.map((p) => {
                  const rd = getResearchData(p.slug);
                  return (
                    <td key={p.slug} className="py-3 px-4">
                      {rd?.keyStudies?.length ? (
                        <div className="space-y-1">
                          {rd.keyStudies.slice(0, 2).map((s, i) => (
                            <p key={i} className="text-[10px] text-stone-500 leading-relaxed">{s.finding}</p>
                          ))}
                        </div>
                      ) : <span className="text-xs text-stone-400">—</span>}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4"></td>
                {selectedProducts.map((p) => (
                  <td key={p.slug} className="py-3 px-4">
                    <Link href={`/shop/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition">
                      View Product <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-stone-400 text-center mt-8">
        All products are for Research Use Only. Not intended for human or animal consumption. Research applications referenced from published literature.
      </p>
    </section>
  );
}
