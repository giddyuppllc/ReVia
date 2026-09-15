"use client";

import { useState, useEffect } from "react";
import { FlaskConical, ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Batch transparency                                                 */
/*                                                                     */
/*  This component used to render a nine-cell grid of assays — LC-MS,  */
/*  endotoxin (LAL), sterility, residual solvents, amino-acid          */
/*  sequencing, bioburden, peptide-content — every one of them green   */
/*  by default. The certificate runs ONE method and reports FOUR       */
/*  results, so seven of those cells were claims no document supports. */
/*  They never reached a visitor only because the batch table is       */
/*  empty; the first row anyone saved would have published all nine.   */
/*                                                                     */
/*  It now shows the measured purity against its specification, and    */
/*  the four reported results, both supplied by /api/batches from      */
/*  src/lib/coa.ts. Nothing here is written by hand.                   */
/* ------------------------------------------------------------------ */

interface CoaResult {
  key: string;
  label: string;
  detail: string;
}

interface BatchData {
  id: string;
  batchNumber: string;
  manufactureDate: string;
  testDate: string;
  labName: string;
  purityPercent: number;
  active: boolean;
  resultCount: number;
}

interface BatchResponse {
  method?: string;
  lab?: string;
  puritySpec?: string;
  results?: CoaResult[];
  batches?: BatchData[];
}

export default function BatchTimeline({ productSlug }: { productSlug: string }) {
  const [data, setData] = useState<BatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/batches?slug=${productSlug}`)
      .then((r) => r.json())
      .then((d: BatchResponse) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productSlug]);

  const batches = data?.batches ?? [];
  if (loading || batches.length === 0) return null;

  const current = batches.find((b) => b.active) ?? batches[0];
  const results = data?.results ?? [];

  return (
    <div className="mt-6 rounded-2xl border border-sky-200/60 bg-sky-50/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-sky-600" aria-hidden="true" />
        <h3 className="text-sm font-bold text-stone-800">Batch Transparency</h3>
        {data?.lab && (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-stone-500">
            {data.lab}
          </span>
        )}
      </div>

      {/* Current batch — measured value against its specification */}
      <div className="mb-3 rounded-xl border border-sky-100 bg-white p-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Current Batch
            </p>
            <p className="font-mono text-sm font-bold text-stone-800">{current.batchNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Purity
            </p>
            <p className="font-mono text-lg font-bold tabular-nums text-stone-800">
              {current.purityPercent}%
            </p>
            {data?.puritySpec && (
              <p className="font-mono text-[10px] text-sky-700">spec {data.puritySpec}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-stone-500">
          <span>Tested {new Date(current.testDate).toLocaleDateString()}</span>
          <span>Manufactured {new Date(current.manufactureDate).toLocaleDateString()}</span>
          {data?.method && <span>{data.method}</span>}
        </div>
      </div>

      {/* The results the certificate reports */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {results.map((r) => (
            <div
              key={r.key}
              className="rounded-lg bg-white/80 px-2.5 py-2 text-[10px] text-stone-600"
            >
              <span className="flex items-center gap-1.5 font-semibold text-stone-800">
                <ShieldCheck className="h-3 w-3 shrink-0 text-sky-600" aria-hidden="true" />
                {r.label}
              </span>
              <span className="mt-0.5 block text-stone-500">{r.detail}</span>
            </div>
          ))}
        </div>
      )}

      {batches.length > 1 && (
        <div className="mt-3 border-t border-sky-100 pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium text-sky-700 hover:text-sky-600"
          >
            {expanded ? "Hide" : "View"} batch history ({batches.length - 1} previous)
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5">
              {batches
                .filter((b) => !b.active)
                .map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 font-mono text-xs tabular-nums"
                  >
                    <span className="text-stone-600">{b.batchNumber}</span>
                    <span className="text-stone-400">
                      {new Date(b.testDate).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-stone-700">{b.purityPercent}%</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
