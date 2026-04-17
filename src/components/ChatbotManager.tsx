"use client";

import { useState } from "react";
import { Save, RotateCcw, Loader2, MessageSquare, Shield, Hash, Sparkles, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface ChatbotConfig {
  id: string;
  enabled: boolean;
  systemPrompt: string;
  topicKeywords: string;
  clientDeflect: string;
  offTopicResponse: string;
  welcomeTitle: string;
  welcomeBody: string;
  quickQuestions: string;
  updatedAt: string;
  updatedBy: string | null;
}

export default function ChatbotManager({ initial }: { initial: ChatbotConfig }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [systemPrompt, setSystemPrompt] = useState(initial.systemPrompt);
  const [topicKeywords, setTopicKeywords] = useState(initial.topicKeywords);
  const [clientDeflect, setClientDeflect] = useState(initial.clientDeflect);
  const [offTopicResponse, setOffTopicResponse] = useState(initial.offTopicResponse);
  const [welcomeTitle, setWelcomeTitle] = useState(initial.welcomeTitle);
  const [welcomeBody, setWelcomeBody] = useState(initial.welcomeBody);
  const [quickQuestions, setQuickQuestions] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(initial.quickQuestions || "[]");
      return Array.isArray(parsed) ? parsed.filter((q: unknown): q is string => typeof q === "string") : [];
    } catch {
      return [];
    }
  });
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  const [updatedBy, setUpdatedBy] = useState<string | null>(initial.updatedBy);

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const applyConfig = (c: ChatbotConfig) => {
    setEnabled(c.enabled);
    setSystemPrompt(c.systemPrompt);
    setTopicKeywords(c.topicKeywords);
    setClientDeflect(c.clientDeflect);
    setOffTopicResponse(c.offTopicResponse);
    setWelcomeTitle(c.welcomeTitle);
    setWelcomeBody(c.welcomeBody);
    try {
      const parsed = JSON.parse(c.quickQuestions || "[]");
      setQuickQuestions(Array.isArray(parsed) ? parsed.filter((q: unknown): q is string => typeof q === "string") : []);
    } catch {
      setQuickQuestions([]);
    }
    setUpdatedAt(c.updatedAt);
    setUpdatedBy(c.updatedBy);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          systemPrompt,
          topicKeywords,
          clientDeflect,
          offTopicResponse,
          welcomeTitle,
          welcomeBody,
          quickQuestions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      applyConfig(data);
      setMessage({ type: "success", text: "Saved. Live on the site within 60 seconds." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset everything to ReVia defaults? Your current configuration will be lost.")) return;
    setResetting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      applyConfig(data);
      setMessage({ type: "success", text: "Reset to defaults." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reset failed" });
    } finally {
      setResetting(false);
    }
  };

  const toggleEnabled = async () => {
    const next = !enabled;
    setEnabled(next);
    try {
      await fetch("/api/admin/chatbot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
    } catch { /* revert on error */ setEnabled(!next); }
  };

  const addQuickQ = () => setQuickQuestions((prev) => (prev.length >= 8 ? prev : [...prev, ""]));
  const updateQuickQ = (i: number, val: string) => setQuickQuestions((prev) => prev.map((q, idx) => (idx === i ? val : q)));
  const removeQuickQ = (i: number) => setQuickQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const inputClass = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition";
  const textareaClass = `${inputClass} font-mono leading-relaxed`;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Enable toggle + sticky save */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <button onClick={toggleEnabled} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            {enabled ? <ToggleRight className="h-6 w-6 text-emerald-500" /> : <ToggleLeft className="h-6 w-6 text-neutral-300" />}
            {enabled ? "Chatbot is ON" : "Chatbot is OFF"}
          </button>
          <p className="text-xs text-neutral-400 mt-1">
            {updatedBy ? `Last edited by ${updatedBy} · ${new Date(updatedAt).toLocaleString()}` : `Last updated ${new Date(updatedAt).toLocaleString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} disabled={resetting || saving} className="flex items-center gap-1.5 rounded-xl border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition">
            {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Reset defaults
          </button>
          <button onClick={save} disabled={saving || resetting} className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 transition">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save all
          </button>
        </div>
      </div>

      {/* System prompt + guardrails */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900">System Prompt &amp; Guardrails</h2>
        </div>
        <p className="text-xs text-neutral-500">
          The instructions the AI follows on every message. Edit with care — this controls tone, scope, compliance language, and what the bot will/won&apos;t say.
        </p>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className={`${textareaClass} min-h-[400px]`}
        />
        <p className="text-xs text-neutral-400">{systemPrompt.length.toLocaleString()} characters</p>
      </section>

      {/* Welcome screen */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900">Welcome Screen</h2>
        </div>
        <p className="text-xs text-neutral-500">What visitors see when they first open the chat.</p>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Title</label>
          <input value={welcomeTitle} onChange={(e) => setWelcomeTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Body</label>
          <textarea value={welcomeBody} onChange={(e) => setWelcomeBody(e.target.value)} className={`${inputClass} min-h-[70px]`} />
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-neutral-500">Quick Questions (max 8)</label>
            <button onClick={addQuickQ} disabled={quickQuestions.length >= 8} className="flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs text-sky-700 hover:bg-sky-100 disabled:opacity-40 transition">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {quickQuestions.length === 0 && <p className="text-xs text-neutral-400 italic">No quick questions. Add up to 8 suggested openers visitors can click.</p>}
            {quickQuestions.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={q} onChange={(e) => updateQuickQ(i, e.target.value)} placeholder="e.g. Tell me about BPC-157" className={inputClass} />
                <button onClick={() => removeQuickQ(i)} className="rounded-lg p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 transition" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deflection messages */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900">Deflection Messages</h2>
        </div>
        <p className="text-xs text-neutral-500">Canned replies used when a question is off-topic or blocked.</p>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Client-side deflect <span className="text-neutral-300 font-normal">(shown instantly when the message fails the keyword gate)</span>
          </label>
          <textarea value={clientDeflect} onChange={(e) => setClientDeflect(e.target.value)} className={`${inputClass} min-h-[80px]`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Server-side off-topic <span className="text-neutral-300 font-normal">(shown when the server pattern filter blocks)</span>
          </label>
          <textarea value={offTopicResponse} onChange={(e) => setOffTopicResponse(e.target.value)} className={`${inputClass} min-h-[80px]`} />
        </div>
      </section>

      {/* Topic keywords */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900">Topic Keywords</h2>
        </div>
        <p className="text-xs text-neutral-500">
          One keyword per line (or comma-separated). Messages longer than 20 characters that contain <em>none</em> of these get the client-side deflect without hitting the API. Leave empty to disable the keyword gate entirely.
        </p>
        <textarea value={topicKeywords} onChange={(e) => setTopicKeywords(e.target.value)} className={`${textareaClass} min-h-[240px]`} />
        <p className="text-xs text-neutral-400">{topicKeywords.split(/[\n,]/).filter((k) => k.trim()).length} keywords</p>
      </section>

      {/* Sticky save at bottom too */}
      <div className="flex items-center justify-end gap-2 sticky bottom-2">
        <button onClick={save} disabled={saving || resetting} className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 transition shadow-lg shadow-sky-500/20">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save all
        </button>
      </div>
    </div>
  );
}
