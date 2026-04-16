"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Plus, Trash2, Loader2, Sparkles, Eye, X, Mail, Users, Clock } from "lucide-react";
export const dynamic = "force-dynamic";

interface Campaign {
  id: string; name: string; subject: string; body: string;
  template: string; audience: string; status: string;
  sentCount: number; sentAt: string | null; createdAt: string;
}

const TEMPLATES = [
  { value: "newsletter", label: "Newsletter" },
  { value: "discount", label: "Discount / Promo" },
  { value: "new_product", label: "New Product" },
  { value: "restock", label: "Restock Alert" },
  { value: "educational", label: "Educational / Research" },
  { value: "custom", label: "Custom" },
];

const AUDIENCES = [
  { value: "all", label: "Everyone (customers + newsletter)" },
  { value: "customers_only", label: "Registered Customers Only" },
  { value: "affiliates", label: "Affiliates Only" },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "", subject: "", body: "", template: "newsletter", audience: "all", aiPrompt: "",
  });

  useEffect(() => {
    fetch("/api/admin/campaigns").then(r => r.json()).then(d => {
      setCampaigns(d.campaigns || []); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAiDraft = async () => {
    if (!form.aiPrompt.trim()) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ai-draft", prompt: form.aiPrompt }),
      });
      const data = await res.json();
      if (data.draft) {
        setForm(f => ({ ...f, body: data.draft }));
        setMessage({ type: "success", text: "AI draft generated! Review and edit before saving." });
      }
    } catch {
      setMessage({ type: "error", text: "AI draft failed" });
    } finally { setDrafting(false); }
  };

  const handleCreate = async () => {
    if (!form.name || !form.subject || !form.body) {
      setMessage({ type: "error", text: "Name, subject, and body are required" }); return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCampaigns(prev => [{ ...data.campaign, sentAt: null, createdAt: new Date().toISOString() }, ...prev]);
      setForm({ name: "", subject: "", body: "", template: "newsletter", audience: "all", aiPrompt: "" });
      setShowCreate(false);
      setMessage({ type: "success", text: "Campaign saved as draft!" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setCreating(false); }
  };

  const handleSend = async (id: string) => {
    if (!confirm("Send this campaign to all recipients? This cannot be undone.")) return;
    setSending(id);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", campaignId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "sent", sentCount: data.sent, sentAt: new Date().toISOString() } : c));
      setMessage({ type: "success", text: `Sent to ${data.sent} recipients!` });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally { setSending(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await fetch("/api/admin/campaigns", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch {}
  };

  const inputClass = "w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30";

  if (loading) return <div className="text-neutral-400 py-12 text-center text-sm">Loading campaigns...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Email Campaigns</h1>
          <p className="text-sm text-neutral-500 mt-1">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</p>
        </div>
        {!showCreate && (
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition">
            <Plus className="h-4 w-4" /> New Campaign
          </button>
        )}
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{message.text}</div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Create Campaign</h2>
            <button onClick={() => setShowCreate(false)} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Campaign Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="April Newsletter" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Email Subject</label>
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="New Research Compounds Available" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Template</label>
              <select value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))} className={inputClass}>
                {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Audience</label>
              <select value={form.audience} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))} className={inputClass}>
                {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>

          {/* AI Draft */}
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <label className="text-xs font-semibold text-purple-700 mb-2 block flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Draft Assistant
            </label>
            <div className="flex gap-2">
              <input value={form.aiPrompt} onChange={e => setForm(f => ({ ...f, aiPrompt: e.target.value }))} placeholder="e.g. Write a newsletter about our new Tirzepatide batch with 99.7% purity" className={`${inputClass} flex-1 border-purple-200`} />
              <button onClick={handleAiDraft} disabled={drafting || !form.aiPrompt.trim()} className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition">
                {drafting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Draft
              </button>
            </div>
          </div>

          {/* Body editor */}
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Email Body (HTML)</label>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="<h2>New at ReVia</h2><p>We're excited to announce...</p>" className={`${inputClass} min-h-[200px] font-mono text-xs`} />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setPreview(form.body)} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition">
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button onClick={handleCreate} disabled={creating} className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 disabled:opacity-60 transition">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Save Draft
            </button>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-w-lg w-full max-h-[80vh] overflow-auto rounded-2xl bg-[#0f0f0f] p-8" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6" dangerouslySetInnerHTML={{ __html: preview }} />
            <button onClick={() => setPreview(null)} className="mt-4 w-full rounded-lg bg-white/10 py-2 text-sm text-white hover:bg-white/20">Close Preview</button>
          </div>
        </div>
      )}

      {/* Campaign list */}
      <div className="space-y-3">
        {campaigns.length === 0 && !showCreate && (
          <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">No campaigns yet. Create one to get started.</p>
        )}

        {campaigns.map(c => (
          <div key={c.id} className={`rounded-2xl border bg-white p-5 ${c.status === "draft" ? "border-amber-200" : "border-neutral-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-neutral-900">{c.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span>
                  <span className="text-[10px] bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.5">{c.template}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{c.subject}</p>
                <div className="flex gap-4 mt-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.audience}</span>
                  {c.sentCount > 0 && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.sentCount} sent</span>}
                  {c.sentAt && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(c.sentAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setPreview(c.body)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition"><Eye className="h-4 w-4" /></button>
                {c.status === "draft" && (
                  <button onClick={() => handleSend(c.id)} disabled={sending === c.id} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60 transition">
                    {sending === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Send
                  </button>
                )}
                <button onClick={() => handleDelete(c.id)} className="rounded-lg p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
