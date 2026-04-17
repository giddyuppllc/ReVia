"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, Loader2, Link2, BarChart3, DollarSign, MousePointer, ShoppingCart, Pencil, Save, Hash } from "lucide-react";

interface AffiliateData {
  id: string; status: string; commissionRate: number; affiliateCode: string;
  instagram: string | null; tiktok: string | null; youtube: string | null;
  twitter: string | null; website: string | null; bio: string | null; audience: string | null;
  totalClicks: number; totalOrders: number; totalRevenue: number;
  totalCommission: number; paidCommission: number; createdAt: string;
}

interface Conversion {
  id: string; orderTotal: number; commission: number; status: string; createdAt: string;
}

export default function AffiliateTab() {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Application form
  const [form, setForm] = useState({
    instagram: "", tiktok: "", youtube: "", twitter: "", website: "", bio: "", audience: "",
  });

  // Social edit form
  const [socials, setSocials] = useState({
    instagram: "", tiktok: "", youtube: "", twitter: "", website: "", bio: "",
  });

  useEffect(() => {
    fetch("/api/affiliate/stats")
      .then((r) => r.json())
      .then((d) => {
        setAffiliate(d.affiliate);
        setConversions(d.conversions || []);
        if (d.affiliate) {
          setSocials({
            instagram: d.affiliate.instagram || "",
            tiktok: d.affiliate.tiktok || "",
            youtube: d.affiliate.youtube || "",
            twitter: d.affiliate.twitter || "",
            website: d.affiliate.website || "",
            bio: d.affiliate.bio || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    if (!form.bio.trim() || form.bio.trim().length < 10) {
      setMessage({ type: "error", text: "Please describe why you want to be an affiliate" });
      return;
    }
    setApplying(true); setMessage(null);
    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAffiliate({ ...data.affiliate, commissionRate: 3, affiliateCode: "", totalClicks: 0, totalOrders: 0, totalRevenue: 0, totalCommission: 0, paidCommission: 0, createdAt: new Date().toISOString(), instagram: form.instagram, tiktok: form.tiktok, youtube: form.youtube, twitter: form.twitter, website: form.website, bio: form.bio, audience: form.audience });
      setMessage({ type: "success", text: "Application submitted! We'll review it shortly." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setApplying(false); }
  };

  const copyLink = () => {
    if (!affiliate?.affiliateCode) return;
    navigator.clipboard.writeText(`https://revialife.com/?ref=${affiliate.affiliateCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    if (!affiliate?.affiliateCode) return;
    navigator.clipboard.writeText(affiliate.affiliateCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const regenerateCode = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/affiliate/regenerate", { method: "POST" });
      const data = await res.json();
      if (data.affiliateCode && affiliate) {
        setAffiliate({ ...affiliate, affiliateCode: data.affiliateCode });
      }
    } catch {} finally { setRegenerating(false); }
  };

  const saveSocials = async () => {
    setSavingSocials(true);
    try {
      await fetch("/api/affiliate/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socials),
      });
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated!" });
    } catch {} finally { setSavingSocials(false); }
  };

  const inputClass = "w-full rounded-xl border border-sky-200/60 bg-sky-50/30 px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20";

  if (loading) return <div className="text-center py-12 text-stone-400 text-sm">Loading...</div>;

  /* ── NOT APPLIED YET ── */
  if (!affiliate) {
    return (
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Earn a Commission</h2>
          <p className="text-sm text-stone-500 mt-1">Become a ReVia affiliate and earn commission on every sale you refer. Share your unique link and get paid. Your rate is set when your application is approved.</p>
        </div>
        {message && <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{message.text}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-xs text-stone-500 mb-1 block">Instagram</label><input value={form.instagram} onChange={(e) => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@handle" className={inputClass} /></div>
          <div><label className="text-xs text-stone-500 mb-1 block">TikTok</label><input value={form.tiktok} onChange={(e) => setForm(f => ({ ...f, tiktok: e.target.value }))} placeholder="@handle" className={inputClass} /></div>
          <div><label className="text-xs text-stone-500 mb-1 block">YouTube</label><input value={form.youtube} onChange={(e) => setForm(f => ({ ...f, youtube: e.target.value }))} placeholder="Channel URL" className={inputClass} /></div>
          <div><label className="text-xs text-stone-500 mb-1 block">Twitter / X</label><input value={form.twitter} onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))} placeholder="@handle" className={inputClass} /></div>
          <div className="sm:col-span-2"><label className="text-xs text-stone-500 mb-1 block">Website</label><input value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yoursite.com" className={inputClass} /></div>
        </div>
        <div><label className="text-xs text-stone-500 mb-1 block">Why do you want to be a ReVia affiliate?</label><textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself, your audience, and how you'd promote ReVia..." className={`${inputClass} min-h-[80px]`} /></div>
        <div><label className="text-xs text-stone-500 mb-1 block">Describe your audience</label><textarea value={form.audience} onChange={(e) => setForm(f => ({ ...f, audience: e.target.value }))} placeholder="Size, demographics, interests..." className={`${inputClass} min-h-[60px]`} /></div>
        <button onClick={handleApply} disabled={applying} className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60 transition">
          {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />} Apply to Become an Affiliate
        </button>
      </div>
    );
  }

  /* ── PENDING ── */
  if (affiliate.status === "pending") {
    return (
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 text-center">
        <Loader2 className="h-8 w-8 text-amber-500 mx-auto mb-3 animate-spin" />
        <h2 className="text-lg font-semibold text-stone-900">Application Under Review</h2>
        <p className="text-sm text-stone-500 mt-1">We're reviewing your affiliate application. You'll receive an email once it's approved.</p>
      </div>
    );
  }

  /* ── REJECTED ── */
  if (affiliate.status === "rejected") {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 text-center">
        <h2 className="text-lg font-semibold text-stone-900">Application Not Approved</h2>
        <p className="text-sm text-stone-500 mt-1">Unfortunately your affiliate application wasn't approved at this time. Contact us at contact@revialife.com for more information.</p>
      </div>
    );
  }

  /* ── APPROVED — FULL DASHBOARD ── */
  const owed = affiliate.totalCommission - affiliate.paidCommission;
  const convRate = affiliate.totalClicks > 0 ? ((affiliate.totalOrders / affiliate.totalClicks) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-5">
      {message && <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{message.text}</div>}

      {/* Commission headline */}
      <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-sky-50 p-5">
        <p className="text-xs text-emerald-700 uppercase tracking-wider font-medium mb-1">Your Commission Rate</p>
        <p className="text-3xl font-bold text-stone-900">{affiliate.commissionRate}<span className="text-lg text-stone-500">%</span></p>
        <p className="text-xs text-stone-500 mt-1">Earned on every sale attributed to your code or link.</p>
      </div>

      {/* Link */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-5">
        <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> Your Affiliate Link</p>
        <div className="flex items-center gap-2">
          <input readOnly value={`https://revialife.com/?ref=${affiliate.affiliateCode}`} className="flex-1 rounded-xl bg-sky-50 border border-sky-200 px-4 py-2.5 text-sm font-mono text-sky-700 outline-none" />
          <button onClick={copyLink} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition">
            {copied ? <><Check className="h-4 w-4 inline mr-1" />Copied</> : <><Copy className="h-4 w-4 inline mr-1" />Copy</>}
          </button>
          <button onClick={regenerateCode} disabled={regenerating} className="rounded-xl border border-sky-200 px-3 py-2.5 text-stone-500 hover:bg-sky-50 transition" title="Regenerate link & code">
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          </button>
        </div>
        <p className="text-[11px] text-stone-400 mt-2">Anyone who visits this link gets your code attached for 30 days.</p>
      </div>

      {/* Code (standalone, for verbal/offline sharing) */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-5">
        <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Your Affiliate Code</p>
        <div className="flex items-center gap-2">
          <input readOnly value={affiliate.affiliateCode} className="flex-1 rounded-xl bg-sky-50 border border-sky-200 px-4 py-2.5 text-base font-mono font-bold tracking-wider text-sky-700 outline-none" />
          <button onClick={copyCode} className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition">
            {copiedCode ? <><Check className="h-4 w-4 inline mr-1" />Copied</> : <><Copy className="h-4 w-4 inline mr-1" />Copy</>}
          </button>
        </div>
        <p className="text-[11px] text-stone-400 mt-2">Customers can enter this code at checkout or when creating an account to attribute their purchase to you.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Clicks", value: affiliate.totalClicks.toLocaleString(), icon: MousePointer, color: "text-sky-500" },
          { label: "Orders", value: affiliate.totalOrders.toLocaleString(), icon: ShoppingCart, color: "text-emerald-500" },
          { label: "Revenue", value: `$${(affiliate.totalRevenue / 100).toFixed(2)}`, icon: BarChart3, color: "text-purple-500" },
          { label: "Commission Owed", value: `$${(owed / 100).toFixed(2)}`, icon: DollarSign, color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-sky-100 bg-white/80 p-4">
            <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
            <p className="text-lg font-bold text-stone-900">{s.value}</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-stone-400">
        <span>Conversion: <strong className="text-stone-700">{convRate}%</strong></span>
        <span>Paid Out: <strong className="text-stone-700">${(affiliate.paidCommission / 100).toFixed(2)}</strong></span>
      </div>

      {/* Social links edit */}
      <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">Social Profiles</p>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-500"><Pencil className="h-3 w-3" /> Edit</button>
          ) : (
            <button onClick={saveSocials} disabled={savingSocials} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500">
              {savingSocials ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
            </button>
          )}
        </div>
        {editing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["instagram", "tiktok", "youtube", "twitter", "website"] as const).map((k) => (
              <div key={k}><label className="text-[10px] text-stone-400 capitalize">{k}</label><input value={socials[k]} onChange={(e) => setSocials(s => ({ ...s, [k]: e.target.value }))} className={inputClass} /></div>
            ))}
            <div className="sm:col-span-2"><label className="text-[10px] text-stone-400">Bio</label><textarea value={socials.bio} onChange={(e) => setSocials(s => ({ ...s, bio: e.target.value }))} className={`${inputClass} min-h-[60px]`} /></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
            {affiliate.instagram && <span className="bg-sky-50 px-2 py-1 rounded">IG: {affiliate.instagram}</span>}
            {affiliate.tiktok && <span className="bg-sky-50 px-2 py-1 rounded">TikTok: {affiliate.tiktok}</span>}
            {affiliate.youtube && <span className="bg-sky-50 px-2 py-1 rounded">YT: {affiliate.youtube}</span>}
            {affiliate.twitter && <span className="bg-sky-50 px-2 py-1 rounded">X: {affiliate.twitter}</span>}
            {affiliate.website && <span className="bg-sky-50 px-2 py-1 rounded">{affiliate.website}</span>}
            {!affiliate.instagram && !affiliate.tiktok && !affiliate.youtube && !affiliate.twitter && !affiliate.website && <span className="text-stone-300">No social links added</span>}
          </div>
        )}
      </div>

      {/* Conversions */}
      {conversions.length > 0 && (
        <div className="rounded-2xl border border-sky-200/40 bg-white/80 p-5">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-3">Recent Conversions</p>
          <div className="space-y-2">
            {conversions.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-sky-50/50 border border-sky-100 px-3 py-2">
                <div>
                  <p className="text-xs text-stone-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-stone-700">Order: ${(c.orderTotal / 100).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-600">+${(c.commission / 100).toFixed(2)}</p>
                  <span className={`text-[10px] font-medium ${c.status === "paid" ? "text-emerald-500" : c.status === "confirmed" ? "text-sky-500" : "text-amber-500"}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
