"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, Loader2, X, ToggleLeft, ToggleRight, Pencil, Save, Ban, UserCheck, ChevronRight, Copy, Layers, Tag, Calendar } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  perUserLimit: number;
  active: boolean;
  allowedEmails: string;
  blockedEmails: string;
  campaign: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  percentage: "Percentage (%)",
  fixed: "Fixed amount ($)",
  shipping: "Free shipping",
};

function describeType(c: Coupon): string {
  if (c.type === "shipping") return "Free shipping";
  if (c.type === "percentage") return `${c.value}% off`;
  return `$${(c.value / 100).toFixed(2)} off`;
}

export default function CouponManager({
  initialCoupons,
}: {
  initialCoupons: Coupon[];
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [creating, setCreating] = useState(false);
  const [bulking, setBulking] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Coupon>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [campaignFilter, setCampaignFilter] = useState<string>("");

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "",
    perUserLimit: "",
    startsAt: "",
    expiresAt: "",
    allowedEmails: "",
    blockedEmails: "",
    campaign: "",
  });

  const [bulkData, setBulkData] = useState({
    count: "10",
    prefix: "PROMO-",
    suffixLength: "8",
    type: "percentage",
    value: "",
    minOrder: "",
    maxUses: "1",
    perUserLimit: "1",
    startsAt: "",
    expiresAt: "",
    campaign: "",
  });

  const inputClass =
    "w-full rounded-lg border border-sky-200/40 bg-white/50 px-4 py-2.5 text-sm text-stone-800 placeholder-gray-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30";
  const smallInput =
    "w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm mt-0.5";

  const campaigns = useMemo(() => {
    const set = new Set<string>();
    for (const c of coupons) if (c.campaign) set.add(c.campaign);
    return Array.from(set).sort();
  }, [coupons]);

  const visibleCoupons = useMemo(() => {
    if (!campaignFilter) return coupons;
    if (campaignFilter === "__none__") return coupons.filter((c) => !c.campaign);
    return coupons.filter((c) => c.campaign === campaignFilter);
  }, [coupons, campaignFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          type: formData.type,
          value: formData.type === "shipping" ? 0 : Number(formData.value),
          minOrder: formData.minOrder ? Number(formData.minOrder) : 0,
          maxUses: formData.maxUses ? Number(formData.maxUses) : 0,
          perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 0,
          startsAt: formData.startsAt || null,
          expiresAt: formData.expiresAt || null,
          allowedEmails: formData.allowedEmails || "",
          blockedEmails: formData.blockedEmails || "",
          campaign: formData.campaign || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon");
      setCoupons((prev) => [data.coupon, ...prev]);
      setFormData({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", perUserLimit: "", startsAt: "", expiresAt: "", allowedEmails: "", blockedEmails: "", campaign: "" });
      setShowForm(false);
      setMessage({ type: "success", text: "Promo code created!" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create" });
    } finally {
      setCreating(false);
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulking(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/coupons/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: Number(bulkData.count),
          prefix: bulkData.prefix,
          suffixLength: Number(bulkData.suffixLength),
          type: bulkData.type,
          value: bulkData.type === "shipping" ? 0 : Number(bulkData.value),
          minOrder: bulkData.minOrder ? Number(bulkData.minOrder) : 0,
          maxUses: bulkData.maxUses ? Number(bulkData.maxUses) : 0,
          perUserLimit: bulkData.perUserLimit ? Number(bulkData.perUserLimit) : 0,
          startsAt: bulkData.startsAt || null,
          expiresAt: bulkData.expiresAt || null,
          campaign: bulkData.campaign || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk create failed");
      // Add new coupons to top of list (refetch via router.refresh would also work)
      const newCoupons: Coupon[] = (data.created as { id: string; code: string }[]).map((c) => ({
        id: c.id, code: c.code,
        type: bulkData.type, value: bulkData.type === "shipping" ? 0 : Number(bulkData.value),
        minOrder: bulkData.minOrder ? Number(bulkData.minOrder) : 0,
        maxUses: bulkData.maxUses ? Number(bulkData.maxUses) : 0,
        usedCount: 0,
        perUserLimit: bulkData.perUserLimit ? Number(bulkData.perUserLimit) : 0,
        active: true,
        allowedEmails: "", blockedEmails: "",
        campaign: bulkData.campaign || null,
        startsAt: bulkData.startsAt || null,
        expiresAt: bulkData.expiresAt || null,
        createdAt: new Date().toISOString(),
      }));
      setCoupons((prev) => [...newCoupons, ...prev]);
      setShowBulk(false);
      setMessage({ type: "success", text: `Created ${data.total} promo codes` });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Bulk create failed" });
    } finally {
      setBulking(false);
    }
  };

  const handleDuplicate = async (coupon: Coupon) => {
    setDuplicatingId(coupon.id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate");
      setCoupons((prev) => [data.coupon, ...prev]);
      setMessage({ type: "success", text: `Duplicated as ${data.coupon.code}` });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Duplicate failed" });
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (res.ok) {
        setCoupons((prev) => prev.map((c) => c.id === coupon.id ? { ...c, active: !c.active } : c));
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const startEditing = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setEditData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      maxUses: coupon.maxUses,
      perUserLimit: coupon.perUserLimit,
      campaign: coupon.campaign ?? "",
      startsAt: coupon.startsAt ?? "",
      expiresAt: coupon.expiresAt ?? "",
      allowedEmails: coupon.allowedEmails || "",
      blockedEmails: coupon.blockedEmails || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, ...data.coupon } : c));
        setEditingId(null);
        setEditData({});
        setMessage({ type: "success", text: "Promo code updated!" });
      }
    } catch (err) {
      console.error("Failed to save coupon:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setMessage({ type: "success", text: "Promo code deleted." });
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {/* Top action row */}
      <div className="flex flex-wrap items-center gap-3">
        {!showForm && !showBulk && (
          <>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500">
              <Plus size={16} /> New Promo Code
            </button>
            <button onClick={() => setShowBulk(true)} className="flex items-center gap-2 rounded-xl bg-white border border-sky-200 px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50">
              <Layers size={16} /> Bulk-create
            </button>
          </>
        )}

        {/* Campaign filter */}
        {(campaigns.length > 0 || coupons.some(c => !c.campaign)) && !showForm && !showBulk && (
          <div className="ml-auto flex items-center gap-2">
            <Tag size={14} className="text-neutral-400" />
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm"
            >
              <option value="">All campaigns</option>
              <option value="__none__">— Uncategorized —</option>
              {campaigns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Create Promo Code</h2>
            <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600 transition"><X size={18} /></button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Code</label>
                <input type="text" required value={formData.code} onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))} placeholder="SAVE20" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
                <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} className={inputClass}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount ($)</option>
                  <option value="shipping">Free shipping</option>
                </select>
              </div>
              {formData.type !== "shipping" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Value {formData.type === "percentage" ? "(%)" : "(cents)"}</label>
                  <input type="number" required value={formData.value} onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))} placeholder={formData.type === "percentage" ? "20" : "500"} className={inputClass} />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Min Order (cents, 0 = none)</label>
                <input type="number" value={formData.minOrder} onChange={(e) => setFormData((p) => ({ ...p, minOrder: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Max Uses (0 = unlimited)</label>
                <input type="number" value={formData.maxUses} onChange={(e) => setFormData((p) => ({ ...p, maxUses: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Per-User Limit (0 = unlimited)</label>
                <input type="number" value={formData.perUserLimit} onChange={(e) => setFormData((p) => ({ ...p, perUserLimit: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Activates At (optional)</label>
                <input type="datetime-local" value={formData.startsAt} onChange={(e) => setFormData((p) => ({ ...p, startsAt: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Expires At (optional)</label>
                <input type="datetime-local" value={formData.expiresAt} onChange={(e) => setFormData((p) => ({ ...p, expiresAt: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Campaign (optional grouping)</label>
                <input type="text" value={formData.campaign} onChange={(e) => setFormData((p) => ({ ...p, campaign: e.target.value }))} placeholder="blackfriday2026" className={inputClass} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <UserCheck size={12} /> Allowed Emails (comma-separated, empty = anyone)
                </label>
                <input type="text" value={formData.allowedEmails} onChange={(e) => setFormData((p) => ({ ...p, allowedEmails: e.target.value }))} placeholder="vip@example.com, friend@example.com" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <Ban size={12} /> Blocked Emails (comma-separated)
                </label>
                <input type="text" value={formData.blockedEmails} onChange={(e) => setFormData((p) => ({ ...p, blockedEmails: e.target.value }))} placeholder="banned@example.com" className={inputClass} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60">
                {creating && <Loader2 size={14} className="animate-spin" />} Create Promo Code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk-create form */}
      {showBulk && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2"><Layers size={18} /> Bulk-create promo codes</h2>
            <button onClick={() => setShowBulk(false)} className="text-neutral-400 hover:text-neutral-600 transition"><X size={18} /></button>
          </div>
          <p className="text-xs text-neutral-500 mb-4">Generates N unique codes that share these settings. Useful for mailing-list giveaways or one-time-use coupons.</p>

          <form onSubmit={handleBulkCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">How many?</label>
                <input type="number" required min={1} max={500} value={bulkData.count} onChange={(e) => setBulkData((p) => ({ ...p, count: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Code prefix</label>
                <input type="text" value={bulkData.prefix} onChange={(e) => setBulkData((p) => ({ ...p, prefix: e.target.value }))} placeholder="VIP-" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Suffix length (4–16)</label>
                <input type="number" min={4} max={16} value={bulkData.suffixLength} onChange={(e) => setBulkData((p) => ({ ...p, suffixLength: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Type</label>
                <select value={bulkData.type} onChange={(e) => setBulkData((p) => ({ ...p, type: e.target.value }))} className={inputClass}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount ($)</option>
                  <option value="shipping">Free shipping</option>
                </select>
              </div>
              {bulkData.type !== "shipping" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Value {bulkData.type === "percentage" ? "(%)" : "(cents)"}</label>
                  <input type="number" required value={bulkData.value} onChange={(e) => setBulkData((p) => ({ ...p, value: e.target.value }))} className={inputClass} />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Min order (cents)</label>
                <input type="number" value={bulkData.minOrder} onChange={(e) => setBulkData((p) => ({ ...p, minOrder: e.target.value }))} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Max uses per code</label>
                <input type="number" value={bulkData.maxUses} onChange={(e) => setBulkData((p) => ({ ...p, maxUses: e.target.value }))} placeholder="1" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Per-user limit</label>
                <input type="number" value={bulkData.perUserLimit} onChange={(e) => setBulkData((p) => ({ ...p, perUserLimit: e.target.value }))} placeholder="1" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Activates at</label>
                <input type="datetime-local" value={bulkData.startsAt} onChange={(e) => setBulkData((p) => ({ ...p, startsAt: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Expires at</label>
                <input type="datetime-local" value={bulkData.expiresAt} onChange={(e) => setBulkData((p) => ({ ...p, expiresAt: e.target.value }))} className={inputClass} />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-500">Campaign label</label>
                <input type="text" value={bulkData.campaign} onChange={(e) => setBulkData((p) => ({ ...p, campaign: e.target.value }))} placeholder="newsletter-q2-giveaway" className={inputClass} />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={bulking} className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60">
                {bulking && <Loader2 size={14} className="animate-spin" />} Generate codes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-3">
        {visibleCoupons.length === 0 ? (
          <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">
            {coupons.length === 0 ? "No promo codes yet." : "No promo codes match this filter."}
          </p>
        ) : (
          visibleCoupons.map((coupon) => {
            const isEditing = editingId === coupon.id;
            const startsInFuture = coupon.startsAt && new Date(coupon.startsAt) > new Date();

            return (
              <div key={coupon.id} className={`rounded-2xl border bg-white p-5 transition ${coupon.active ? "border-neutral-200" : "border-neutral-100 opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Code + Badges row */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {isEditing ? (
                        <input type="text" value={editData.code ?? ""} onChange={(e) => setEditData(p => ({ ...p, code: e.target.value }))} className="font-mono text-lg font-bold text-sky-600 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1 w-48 outline-none focus:border-sky-400" />
                      ) : (
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
                          className="group inline-flex items-center gap-1 font-mono text-lg font-bold text-sky-600 hover:text-sky-500 transition"
                          title="View usage"
                        >
                          {coupon.code}
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                        </Link>
                      )}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${coupon.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>
                        {coupon.active ? "Active" : "Disabled"}
                      </span>
                      {startsInFuture && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700">
                          <Calendar size={11} /> Starts {new Date(coupon.startsAt!).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">{describeType(coupon)}</span>
                      {coupon.campaign && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">
                          <Tag size={11} /> {coupon.campaign}
                        </span>
                      )}
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-500">
                      <span>Used: {coupon.usedCount}{coupon.maxUses > 0 ? `/${coupon.maxUses}` : " (unlimited)"}</span>
                      {coupon.perUserLimit > 0 && (
                        <span>Per user: max {coupon.perUserLimit}</span>
                      )}
                      <span>Min order: {coupon.minOrder > 0 ? `$${(coupon.minOrder / 100).toFixed(2)}` : "None"}</span>
                      <span>Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</span>
                    </div>

                    {/* Email restrictions badges */}
                    {(coupon.allowedEmails || coupon.blockedEmails) && !isEditing && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {coupon.allowedEmails && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                            <UserCheck size={11} /> Allowed: {coupon.allowedEmails.split(",").length} email{coupon.allowedEmails.split(",").length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {coupon.blockedEmails && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">
                            <Ban size={11} /> Blocked: {coupon.blockedEmails.split(",").length} email{coupon.blockedEmails.split(",").length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Edit form */}
                    {isEditing && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <label className="text-xs text-neutral-500">Type</label>
                          <select value={editData.type ?? coupon.type} onChange={(e) => setEditData(p => ({ ...p, type: e.target.value }))} className={smallInput}>
                            {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </div>
                        {(editData.type ?? coupon.type) !== "shipping" && (
                          <div>
                            <label className="text-xs text-neutral-500">Value</label>
                            <input type="number" value={editData.value ?? coupon.value} onChange={(e) => setEditData(p => ({ ...p, value: Number(e.target.value) }))} className={smallInput} />
                          </div>
                        )}
                        <div>
                          <label className="text-xs text-neutral-500">Max uses (0=∞)</label>
                          <input type="number" value={editData.maxUses ?? coupon.maxUses} onChange={(e) => setEditData(p => ({ ...p, maxUses: Number(e.target.value) }))} className={smallInput} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Per-user limit (0=∞)</label>
                          <input type="number" value={editData.perUserLimit ?? coupon.perUserLimit} onChange={(e) => setEditData(p => ({ ...p, perUserLimit: Number(e.target.value) }))} className={smallInput} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Min order (cents)</label>
                          <input type="number" value={editData.minOrder ?? coupon.minOrder} onChange={(e) => setEditData(p => ({ ...p, minOrder: Number(e.target.value) }))} className={smallInput} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Activates at</label>
                          <input type="datetime-local" value={editData.startsAt ? String(editData.startsAt).slice(0, 16) : (coupon.startsAt ? coupon.startsAt.slice(0, 16) : "")} onChange={(e) => setEditData(p => ({ ...p, startsAt: e.target.value || null }))} className={smallInput} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Expires at</label>
                          <input type="datetime-local" value={editData.expiresAt ? String(editData.expiresAt).slice(0, 16) : (coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "")} onChange={(e) => setEditData(p => ({ ...p, expiresAt: e.target.value || null }))} className={smallInput} />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500">Campaign</label>
                          <input type="text" value={editData.campaign ?? coupon.campaign ?? ""} onChange={(e) => setEditData(p => ({ ...p, campaign: e.target.value }))} placeholder="campaign-tag" className={smallInput} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-neutral-500 flex items-center gap-1"><UserCheck size={11} /> Allowed emails (comma-separated)</label>
                          <input type="text" value={editData.allowedEmails ?? coupon.allowedEmails ?? ""} onChange={(e) => setEditData(p => ({ ...p, allowedEmails: e.target.value }))} placeholder="Leave empty = anyone" className={smallInput} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-neutral-500 flex items-center gap-1"><Ban size={11} /> Blocked emails (comma-separated)</label>
                          <input type="text" value={editData.blockedEmails ?? coupon.blockedEmails ?? ""} onChange={(e) => setEditData(p => ({ ...p, blockedEmails: e.target.value }))} placeholder="user@example.com" className={smallInput} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSaveEdit(coupon.id)} disabled={savingId === coupon.id} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60">
                          {savingId === coupon.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                        </button>
                        <button onClick={() => { setEditingId(null); setEditData({}); }} className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleToggleActive(coupon)} title={coupon.active ? "Disable" : "Enable"} className="transition">
                          {coupon.active ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} className="text-neutral-300" />}
                        </button>
                        <button onClick={() => handleDuplicate(coupon)} disabled={duplicatingId === coupon.id} title="Duplicate" className="rounded-lg bg-neutral-100 p-1.5 text-neutral-400 hover:text-sky-600 hover:bg-sky-50 transition disabled:opacity-50">
                          {duplicatingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
                        </button>
                        <button onClick={() => startEditing(coupon)} className="rounded-lg bg-neutral-100 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(coupon.id)} disabled={deletingId === coupon.id} className="rounded-lg bg-neutral-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                          {deletingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
