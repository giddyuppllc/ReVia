"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Save, FlaskConical, ShieldCheck, X } from "lucide-react";
export const dynamic = "force-dynamic";

interface Product { id: string; name: string; slug: string; }
interface Batch {
  id: string; productId: string; batchNumber: string; manufactureDate: string;
  testDate: string; labName: string; purityPercent: number; active: boolean;
  hplcPass: boolean; lcmsPass: boolean; endotoxinPass: boolean; sterilityPass: boolean;
  heavyMetalsPass: boolean; residualSolventPass: boolean; aminoAcidPass: boolean;
  bioburdenPass: boolean; peptideContentPass: boolean; notes: string | null;
}

const TESTS = [
  { key: "hplcPass", label: "HPLC" },
  { key: "lcmsPass", label: "LC-MS" },
  { key: "endotoxinPass", label: "Endotoxin" },
  { key: "sterilityPass", label: "Sterility" },
  { key: "heavyMetalsPass", label: "Heavy Metals" },
  { key: "residualSolventPass", label: "Residual Solvents" },
  { key: "aminoAcidPass", label: "Amino Acid Seq." },
  { key: "bioburdenPass", label: "Bioburden" },
  { key: "peptideContentPass", label: "Peptide Content" },
];

export default function BatchesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    productId: "", batchNumber: "", manufactureDate: "", testDate: "",
    labName: "Chromate", purityPercent: "99.5", notes: "",
    hplcPass: true, lcmsPass: true, endotoxinPass: true, sterilityPass: true,
    heavyMetalsPass: true, residualSolventPass: true, aminoAcidPass: true,
    bioburdenPass: true, peptideContentPass: true,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/batches").then(r => r.json()),
      fetch("/api/admin/inventory/list").then(r => r.json()),
    ]).then(([batchData, variants]) => {
      setBatches(batchData.batches || []);
      // Extract unique products from variants
      const productMap = new Map<string, Product>();
      (variants || []).forEach((v: { product: { name: string; active: boolean }; productId?: string; id: string }) => {
        if (v.product?.active) {
          // We need product IDs — use a fetch to products
        }
      });
      // Fetch products directly
      fetch("/api/admin/settings").then(() => {
        // Get products from a simpler source
      });
      setLoading(false);
    }).catch(() => setLoading(false));

    // Fetch products list
    fetch("/api/admin/products-list").then(r => r.ok ? r.json() : { products: [] }).then(d => {
      setProducts(d.products || []);
    }).catch(() => {});
  }, []);

  // Fallback: get products from batches page load
  useEffect(() => {
    if (products.length === 0) {
      fetch("/api/admin/batches").then(r => r.json()).then(() => {
        // Products loaded from admin inventory
      });
    }
  }, [products.length]);

  const handleSave = async () => {
    if (!form.productId || !form.batchNumber || !form.manufactureDate || !form.testDate) {
      setMessage({ type: "error", text: "Product, batch number, and dates are required" }); return;
    }
    setSaving(true); setMessage(null);
    try {
      const res = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, purityPercent: parseFloat(form.purityPercent) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBatches(prev => [{ ...data.batch, manufactureDate: data.batch.manufactureDate, testDate: data.batch.testDate, createdAt: new Date().toISOString() }, ...prev]);
      setShowForm(false);
      setForm({ productId: "", batchNumber: "", manufactureDate: "", testDate: "", labName: "Chromate", purityPercent: "99.5", notes: "", hplcPass: true, lcmsPass: true, endotoxinPass: true, sterilityPass: true, heavyMetalsPass: true, residualSolventPass: true, aminoAcidPass: true, bioburdenPass: true, peptideContentPass: true });
      setMessage({ type: "success", text: "Batch record added! Previous batch deactivated." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this batch record?")) return;
    try {
      await fetch("/api/admin/batches", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setBatches(prev => prev.filter(b => b.id !== id));
    } catch {}
  };

  const inputClass = "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-sky-400";

  if (loading) return <div className="text-neutral-400 py-12 text-center text-sm">Loading...</div>;

  const filtered = selectedProduct ? batches.filter(b => b.productId === selectedProduct) : batches;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Batch Records</h1>
          <p className="text-sm text-neutral-500 mt-1">{batches.length} batch{batches.length !== 1 ? "es" : ""} across all products</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition">
            <Plus className="h-4 w-4" /> Add Batch Record
          </button>
        )}
      </div>

      {message && <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{message.text}</div>}

      {showForm && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2"><FlaskConical className="h-5 w-5 text-sky-500" /> New Batch Record</h2>
            <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Product</label>
              <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} className={inputClass}>
                <option value="">Select product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Batch Number</label>
              <input value={form.batchNumber} onChange={e => setForm(f => ({ ...f, batchNumber: e.target.value }))} placeholder="2026-04-A" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Manufacture Date</label>
              <input type="date" value={form.manufactureDate} onChange={e => setForm(f => ({ ...f, manufactureDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Test Date</label>
              <input type="date" value={form.testDate} onChange={e => setForm(f => ({ ...f, testDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Lab Name</label>
              <input value={form.labName} onChange={e => setForm(f => ({ ...f, labName: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Purity %</label>
              <input type="number" step="0.1" value={form.purityPercent} onChange={e => setForm(f => ({ ...f, purityPercent: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-500 mb-2 block">Test Results</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TESTS.map(t => (
                <label key={t.key} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition ${(form as Record<string, unknown>)[t.key] ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                  <input type="checkbox" checked={(form as Record<string, unknown>)[t.key] as boolean} onChange={e => setForm(f => ({ ...f, [t.key]: e.target.checked }))} className="accent-emerald-500" />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-500 mb-1 block">Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={`${inputClass} min-h-[60px]`} placeholder="Any additional notes..." />
          </div>

          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60 transition">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Batch Record
          </button>
        </div>
      )}

      {/* Batch list */}
      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-neutral-400 text-sm py-8 text-center bg-white rounded-2xl border border-neutral-200">No batch records yet.</p>}

        {filtered.map(b => {
          const passed = TESTS.filter(t => (b as unknown as Record<string, unknown>)[t.key]).length;
          return (
            <div key={b.id} className={`rounded-xl border bg-white p-4 ${b.active ? "border-emerald-200" : "border-neutral-200 opacity-60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {b.active && <span className="text-[9px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-bold">CURRENT</span>}
                  <span className="font-mono text-sm font-semibold text-neutral-800">{b.batchNumber}</span>
                  <span className="text-xs text-neutral-400">{b.labName}</span>
                  <span className="text-sm font-bold text-emerald-600">{b.purityPercent}%</span>
                  <span className="text-xs text-emerald-600">{passed}/{TESTS.length} tests</span>
                  <span className="text-xs text-neutral-400">{new Date(b.testDate).toLocaleDateString()}</span>
                </div>
                <button onClick={() => handleDelete(b.id)} className="text-neutral-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
