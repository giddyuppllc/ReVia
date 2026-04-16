"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, XCircle, FlaskConical, Microscope, Atom, Beaker, Fingerprint, Dna, ScanLine, BadgeCheck, Sparkles } from "lucide-react";

interface BatchData {
  id: string; batchNumber: string; manufactureDate: string; testDate: string;
  labName: string; purityPercent: number; active: boolean;
  tests: Record<string, boolean>; testsPassedCount: number; totalTests: number;
}

const TEST_LABELS: Record<string, { label: string; icon: typeof ShieldCheck }> = {
  hplc: { label: "HPLC Analysis", icon: Microscope },
  lcms: { label: "LC-MS Confirmation", icon: Atom },
  endotoxin: { label: "Endotoxin (LAL)", icon: ShieldCheck },
  sterility: { label: "Sterility Screen", icon: Beaker },
  heavyMetals: { label: "Heavy Metals (ICP-MS)", icon: Fingerprint },
  residualSolvent: { label: "Residual Solvents", icon: ScanLine },
  aminoAcid: { label: "Amino Acid Sequencing", icon: Dna },
  bioburden: { label: "Bioburden Testing", icon: BadgeCheck },
  peptideContent: { label: "Peptide Content Assay", icon: Sparkles },
};

export default function BatchTimeline({ productSlug }: { productSlug: string }) {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/batches?slug=${productSlug}`)
      .then((r) => r.json())
      .then((d) => { setBatches(d.batches || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productSlug]);

  if (loading || batches.length === 0) return null;

  const current = batches.find((b) => b.active) || batches[0];

  return (
    <div className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50/80 to-white p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="h-5 w-5 text-sky-500" />
        <h3 className="text-sm font-bold text-stone-800">Batch Transparency</h3>
        <span className="text-[10px] bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-semibold">
          {current.testsPassedCount}/{current.totalTests} Tests Passed
        </span>
      </div>

      {/* Current batch summary */}
      <div className="rounded-xl bg-white border border-sky-100 p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-stone-500">Current Batch</p>
            <p className="font-mono text-sm font-bold text-stone-800">{current.batchNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">Purity</p>
            <p className="text-lg font-bold text-emerald-600">{current.purityPercent}%</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-stone-400">
          <span>Lab: <strong className="text-stone-600">{current.labName}</strong></span>
          <span>Tested: <strong className="text-stone-600">{new Date(current.testDate).toLocaleDateString()}</strong></span>
          <span>Manufactured: <strong className="text-stone-600">{new Date(current.manufactureDate).toLocaleDateString()}</strong></span>
        </div>
      </div>

      {/* Test results grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {Object.entries(current.tests).map(([key, passed]) => {
          const info = TEST_LABELS[key];
          if (!info) return null;
          const Icon = info.icon;
          return (
            <div key={key} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] ${passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {passed ? <ShieldCheck className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
              <span className="truncate">{info.label}</span>
            </div>
          );
        })}
      </div>

      {/* History */}
      {batches.length > 1 && (
        <div className="mt-3 pt-3 border-t border-sky-100">
          <button onClick={() => setExpanded(expanded ? null : "history")} className="text-xs text-sky-600 hover:text-sky-500 font-medium">
            {expanded ? "Hide" : "View"} batch history ({batches.length - 1} previous)
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {batches.filter(b => !b.active).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-xs">
                  <span className="font-mono text-stone-600">{b.batchNumber}</span>
                  <span className="text-stone-400">{new Date(b.testDate).toLocaleDateString()}</span>
                  <span className="font-semibold text-stone-600">{b.purityPercent}%</span>
                  <span className="text-emerald-600">{b.testsPassedCount}/{b.totalTests}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
