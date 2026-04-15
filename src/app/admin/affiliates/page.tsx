"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Check, X, Loader2, DollarSign, Trash2, Search } from "lucide-react";
export const dynamic = "force-dynamic";

interface Affiliate {
  id: string; userId: string; status: string; commissionRate: number; affiliateCode: string;
  instagram: string | null; tiktok: string | null; youtube: string | null; twitter: string | null;
  website: string | null; bio: string | null; audience: string | null;
  totalClicks: number; totalOrders: number; totalRevenue: number;
  totalCommission: number; paidCommission: number;
  user: { name: string; email: string };
  createdAt: string;
}

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [newRate, setNewRate] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/affiliates")
      .then((r) => r.json())
      .then((d) => { setAffiliates(d.affiliates || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateAffiliate = async (affiliateId: string, data: Record<string, unknown>) => {
    setActionLoading(affiliateId);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateId, ...data }),
      });
      if (!res.ok) throw new Error("Failed");
      setAffiliates((prev) => prev.map((a) => a.id === affiliateId ? { ...a, ...data } as Affiliate : a));
      setMessage({ type: "success", text: "Updated!" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to update" });
    } finally { setActionLoading(null); }
  };

  const deleteAffiliate = async (id: string) => {
    if (!confirm("Delete this affiliate? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/admin/affiliates/${id}`, { method: "DELETE" });
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
    } catch {} finally { setActionLoading(null); }
  };

  const markPaid = async (a: Affiliate) => {
    const owed = a.totalCommission - a.paidCommission;
    if (owed <= 0) return;
    if (!confirm(`Mark $${(owed / 100).toFixed(2)} as paid to ${a.user.name}?`)) return;
    await updateAffiliate(a.id, { paidCommission: a.totalCommission });
  };

  const filtered = affiliates.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.user.name.toLowerCase().includes(q) || a.user.email.toLowerCase().includes(q) || a.affiliateCode.toLowerCase().includes(q);
    }
    return true;
  });

  const pending = affiliates.filter((a) => a.status === "pending").length;

  if (loading) return <div className="text-neutral-400 py-12 text-center text-sm">Loading affiliates...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Affiliates</h1>
          <p className="text-sm text-neutral-500 mt-1">{affiliates.length} total, {pending} pending</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{message.text}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or code..." className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${filter === f ? "bg-sky-500 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === "pending" && pending > 0 ? `(${pending})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">No affiliates found.</p>}

        {filtered.map((a) => {
          const owed = a.totalCommission - a.paidCommission;
          return (
            <div key={a.id} className={`rounded-2xl border bg-white p-5 ${a.status === "pending" ? "border-amber-200" : "border-neutral-200"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-neutral-900">{a.user.name}</p>
                    <span className="font-mono text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{a.affiliateCode}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.status === "approved" ? "bg-emerald-100 text-emerald-700" : a.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-neutral-400">{a.user.email}</p>

                  {a.bio && <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 rounded-lg p-2">{a.bio}</p>}

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.instagram && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">IG: {a.instagram}</span>}
                    {a.tiktok && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">TikTok: {a.tiktok}</span>}
                    {a.youtube && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">YT: {a.youtube}</span>}
                    {a.twitter && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">X: {a.twitter}</span>}
                    {a.website && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">{a.website}</span>}
                  </div>

                  {a.status === "approved" && (
                    <div className="flex gap-4 mt-2 text-xs text-neutral-400">
                      <span>{a.totalClicks} clicks</span>
                      <span>{a.totalOrders} orders</span>
                      <span>${(a.totalRevenue / 100).toFixed(2)} revenue</span>
                      <span className="text-emerald-600 font-medium">${(a.totalCommission / 100).toFixed(2)} earned</span>
                      {owed > 0 && <span className="text-amber-600 font-medium">${(owed / 100).toFixed(2)} owed</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => updateAffiliate(a.id, { status: "approved" })} disabled={actionLoading === a.id} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 transition" title="Approve">
                        {actionLoading === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => updateAffiliate(a.id, { status: "rejected" })} disabled={actionLoading === a.id} className="rounded-lg bg-white border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition" title="Reject">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  {a.status === "approved" && (
                    <>
                      {editingRate === a.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.5" min="0" max="50" value={newRate} onChange={(e) => setNewRate(e.target.value)} className="w-16 rounded-lg border border-neutral-200 px-2 py-1 text-xs text-center" />
                          <span className="text-xs text-neutral-400">%</span>
                          <button onClick={() => { updateAffiliate(a.id, { commissionRate: parseFloat(newRate) || 3 }); setEditingRate(null); }} className="rounded-lg bg-sky-500 px-2 py-1 text-xs text-white">Set</button>
                          <button onClick={() => setEditingRate(null)} className="text-xs text-neutral-400">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingRate(a.id); setNewRate(String(a.commissionRate)); }} className="rounded-lg border border-neutral-200 px-2 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50" title="Change rate">
                          {a.commissionRate}%
                        </button>
                      )}
                      {owed > 0 && (
                        <button onClick={() => markPaid(a)} disabled={actionLoading === a.id} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400 disabled:opacity-60 transition" title="Mark as paid">
                          <DollarSign className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </>
                  )}
                  <button onClick={() => deleteAffiliate(a.id)} disabled={actionLoading === a.id} className="rounded-lg p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
