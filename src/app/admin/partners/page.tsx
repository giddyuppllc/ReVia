"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Globe, Check, X, Trash2, Loader2, Search, Building2 } from "lucide-react";
export const dynamic = "force-dynamic";

interface Partner {
  id: string; businessName: string; contactName: string; email: string; phone: string;
  businessType: string; website: string | null; clientCount: string | null;
  instagram: string | null; facebook: string | null; tiktok: string | null; linkedin: string | null;
  message: string | null; status: string; notes: string | null; createdAt: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "approved" | "declined">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/brand-partners").then(r => r.json()).then(d => { setPartners(d.partners || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = async (id: string, data: Record<string, string>) => {
    setActionLoading(id);
    try {
      await fetch("/api/admin/brand-partners", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) });
      setPartners(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    } catch {} finally { setActionLoading(null); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    await fetch("/api/admin/brand-partners", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  const filtered = partners.filter(p => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.businessName.toLowerCase().includes(q) || p.contactName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    }
    return true;
  });

  const pending = partners.filter(p => p.status === "pending").length;

  if (loading) return <div className="text-neutral-400 py-12 text-center text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Brand Partners</h1>
        <p className="text-sm text-neutral-500 mt-1">{partners.length} applications, {pending} pending</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "pending", "contacted", "approved", "declined"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${filter === f ? "bg-sky-500 text-white" : "bg-white border border-neutral-200 text-neutral-600"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === "pending" && pending > 0 ? `(${pending})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">No applications found.</p>}

        {filtered.map(p => (
          <div key={p.id} className={`rounded-2xl border bg-white p-5 ${p.status === "pending" ? "border-amber-200" : "border-neutral-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Building2 className="h-4 w-4 text-sky-500" />
                  <p className="font-semibold text-neutral-900">{p.businessName}</p>
                  <span className="text-xs bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.5">{p.businessType}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.status === "approved" ? "bg-emerald-100 text-emerald-700" : p.status === "pending" ? "bg-amber-100 text-amber-700" : p.status === "contacted" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600"}`}>{p.status}</span>
                </div>
                <p className="text-sm text-neutral-700 mt-0.5">{p.contactName}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-neutral-400">
                  <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:text-sky-600"><Mail className="h-3 w-3" />{p.email}</a>
                  <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:text-sky-600"><Phone className="h-3 w-3" />{p.phone}</a>
                  {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-600"><Globe className="h-3 w-3" />{p.website}</a>}
                  {p.clientCount && <span>Clients: {p.clientCount}</span>}
                </div>
                {p.message && <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 rounded-lg p-2">{p.message}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.instagram && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">IG: {p.instagram}</span>}
                  {p.facebook && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">FB: {p.facebook}</span>}
                  {p.tiktok && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">TT: {p.tiktok}</span>}
                  {p.linkedin && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">LI: {p.linkedin}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {p.status === "pending" && (
                  <>
                    <button onClick={() => update(p.id, { status: "contacted" })} disabled={actionLoading === p.id} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60">Contacted</button>
                    <button onClick={() => update(p.id, { status: "approved" })} disabled={actionLoading === p.id} className="rounded-lg bg-emerald-600 px-2 py-1.5 text-xs text-white hover:bg-emerald-500 disabled:opacity-60"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => update(p.id, { status: "declined" })} disabled={actionLoading === p.id} className="rounded-lg border border-red-200 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"><X className="h-3.5 w-3.5" /></button>
                  </>
                )}
                <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
