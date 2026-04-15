"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Save, Trash2 } from "lucide-react";

interface VariantInput {
  label: string;
  price: string;
  sku: string;
}

export default function AddProductForm({
  categories,
}: {
  categories: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [variants, setVariants] = useState<VariantInput[]>([
    { label: "5mg", price: "", sku: "" },
  ]);

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30";

  const addVariant = () => {
    setVariants((prev) => [...prev, { label: "", price: "", sku: "" }]);
  };

  const removeVariant = (i: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i: number, field: keyof VariantInput, value: string) => {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Product name is required" });
      return;
    }
    if (!categoryId) {
      setMessage({ type: "error", text: "Select a category" });
      return;
    }

    const validVariants = variants.filter((v) => v.label && v.sku && v.price);
    if (validVariants.length === 0) {
      setMessage({ type: "error", text: "Add at least one variant with label, price, and SKU" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryId,
          variants: validVariants.map((v) => ({
            label: v.label,
            price: parseInt(v.price) || 0,
            sku: v.sku,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");

      setMessage({ type: "success", text: `${name} created!` });
      setName("");
      setDescription("");
      setVariants([{ label: "5mg", price: "", sku: "" }]);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <div>
        {message && (
          <div className={`mb-3 rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
            {message.text}
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">New Product</h2>
        <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. BPC-157" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Research compound description..."
          className={`${inputClass} min-h-[80px] resize-y`}
        />
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-neutral-500">Variants</label>
          <button onClick={addVariant} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-500">
            <Plus className="h-3 w-3" /> Add Variant
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={v.label} onChange={(e) => updateVariant(i, "label", e.target.value)} placeholder="Label (e.g. 5mg)" className={`${inputClass} flex-1`} />
              <input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} placeholder="Price (cents)" className={`${inputClass} w-28`} />
              <input type="text" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} placeholder="SKU" className={`${inputClass} w-40`} />
              {variants.length > 1 && (
                <button onClick={() => removeVariant(i)} className="text-neutral-300 hover:text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => setOpen(false)} className="rounded-xl border border-neutral-200 px-5 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60 transition">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Create Product
        </button>
      </div>
    </div>
  );
}
