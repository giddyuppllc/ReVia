import { prisma } from "@/lib/prisma";
import { Filter, Mail, Globe, Link2 } from "lucide-react";
export const dynamic = "force-dynamic";

const PATH_LABELS: Record<string, string> = {
  email_capture: "Email opt-in",
  pdf_download: "PDF download",
  quiz: "Quiz",
  direct_click: "Direct click",
  referral: "Referral",
};

export default async function FunnelLeadsPage() {
  const leads = await prisma.funnelLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const withEmail = leads.filter((l) => l.email);
  const withReferral = leads.filter((l) => l.referralCode);

  const bySource = new Map<string, number>();
  for (const l of leads) bySource.set(l.sourceDomain, (bySource.get(l.sourceDomain) ?? 0) + 1);
  const sortedSources = Array.from(bySource.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Funnel Leads</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Captures from the ReVia funnel network (email opt-ins, quizzes, PDF downloads, referrals)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Filter className="h-5 w-5 text-sky-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{leads.length}</p>
          <p className="text-xs text-neutral-500">Total Leads</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Mail className="h-5 w-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{withEmail.length}</p>
          <p className="text-xs text-neutral-500">Emails Captured</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Globe className="h-5 w-5 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{bySource.size}</p>
          <p className="text-xs text-neutral-500">Source Sites</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <Link2 className="h-5 w-5 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{withReferral.length}</p>
          <p className="text-xs text-neutral-500">With Referral Code</p>
        </div>
      </div>

      {/* By source */}
      {sortedSources.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-3">Leads by Source Site</h2>
          <div className="flex flex-wrap gap-2">
            {sortedSources.map(([src, count]) => (
              <span key={src} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/50 px-3 py-1 text-xs font-medium text-sky-700">
                {src}
                <span className="rounded-full bg-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Leads */}
      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-neutral-400 text-sm py-12 text-center bg-white rounded-2xl border border-neutral-200">
            No funnel leads yet. They&apos;ll appear here as the funnel sites capture them.
          </p>
        ) : (
          leads.map((lead) => {
            let products: string[] = [];
            try { products = JSON.parse(lead.productInterest || "[]"); } catch { /* noop */ }
            return (
              <div key={lead.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-800">{lead.sourceDomain}</span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                        {PATH_LABELS[lead.path] ?? lead.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                      <span>{new Date(lead.createdAt).toLocaleString()}</span>
                      {lead.utmMedium && <span>{lead.utmMedium}</span>}
                      {lead.utmCampaign && lead.utmCampaign !== "direct" && <span>{lead.utmCampaign}</span>}
                      {lead.referralCode && <span className="font-mono text-purple-500">{lead.referralCode}</span>}
                    </div>
                  </div>
                  {lead.email && (
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {lead.email}
                    </span>
                  )}
                </div>
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {products.map((p) => (
                      <span key={p} className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
