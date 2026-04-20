"use client";

import { useState } from "react";
import { Link2, Pencil, Check, X, Loader2 } from "lucide-react";

export default function AffiliateCodeEditor({
  affiliateId,
  initialCode,
}: {
  affiliateId: string;
  initialCode: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialCode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const next = draft.trim().toUpperCase();
    if (!next || next === code) { setEditing(false); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateId, affiliateCode: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Failed to update");
        return;
      }
      setCode(next);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-sky-500" />
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setEditing(false); setError(null); } }}
            maxLength={20}
            placeholder="MIKE2026"
            className="w-48 rounded-lg border border-sky-300 bg-white px-3 py-1 font-mono text-sm uppercase outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400/40"
            disabled={saving}
          />
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1 text-xs font-medium text-white hover:bg-sky-400 disabled:opacity-60 transition"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save
          </button>
          <button
            onClick={() => { setEditing(false); setDraft(code); setError(null); }}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-50 transition"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
        <p className="text-[11px] text-neutral-400 pl-6">
          3–20 characters. Letters, numbers, hyphens, underscores. Must be unique.
        </p>
        {error && <p className="text-xs text-red-500 pl-6">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Link2 className="h-4 w-4 text-sky-500" />
      <button
        onClick={() => { setDraft(code); setEditing(true); }}
        className="group inline-flex items-center gap-2 font-mono text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-lg transition"
        title="Edit affiliate code"
      >
        {code}
        <Pencil className="h-3 w-3 opacity-50 group-hover:opacity-100 transition" />
      </button>
    </div>
  );
}
