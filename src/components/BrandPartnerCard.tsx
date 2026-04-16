"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

const BUSINESS_TYPES = [
  { value: "medspa", label: "Medical Spa" },
  { value: "clinic", label: "Clinic / Practice" },
  { value: "gym", label: "Gym / Fitness" },
  { value: "wellness", label: "Wellness Center" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "other", label: "Other" },
];

const CLIENT_COUNTS = [
  { value: "1-50", label: "1–50" },
  { value: "51-200", label: "51–200" },
  { value: "201-500", label: "201–500" },
  { value: "500+", label: "500+" },
];

export default function BrandPartnerCard() {
  const [flipped, setFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    businessName: "", contactName: "", email: "", phone: "",
    businessType: "", website: "", clientCount: "",
    instagram: "", facebook: "", tiktok: "", linkedin: "", message: "",
  });

  const inputClass = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30";

  const handleSubmit = async () => {
    if (!form.businessName || !form.contactName || !form.email || !form.phone || !form.businessType) {
      setError("Please fill in all required fields"); return;
    }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/brand-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full transition-transform duration-700"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}
      >
        {/* Front — Logo + CTA */}
        <div
          className="rounded-2xl border border-sky-200/60 bg-gradient-to-br from-white to-sky-50/80 p-8 text-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          style={{ backfaceVisibility: "hidden" }}
          onClick={() => !flipped && setFlipped(true)}
        >
          <Image src="/images/logo.png" alt="ReVia" width={80} height={80} className="mx-auto mb-4 h-20 w-20" />
          <h3 className="text-xl font-bold text-stone-800 mb-2">Brand Partner Inquiries</h3>
          <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
            Interested in partnering with ReVia? We work with clinics, medspas, gyms, and wellness centers.
          </p>
          <button className="inline-flex items-center gap-2 rounded-xl bg-stone-800 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition">
            Apply Now <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Back — Application Form */}
        <div
          className="absolute inset-0 rounded-2xl border border-sky-200/60 bg-white p-6 shadow-sm overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-lg font-bold text-stone-800">Application Submitted!</h3>
              <p className="text-sm text-stone-500 mt-1">We'll review your application and be in touch.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-stone-800">Partner Application</h3>
                <button onClick={() => setFlipped(false)} className="text-xs text-stone-400 hover:text-stone-600">← Back</button>
              </div>

              {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Business Name *</label>
                    <input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Contact Name *</label>
                    <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Business Type *</label>
                    <select value={form.businessType} onChange={e => setForm(f => ({ ...f, businessType: e.target.value }))} className={inputClass}>
                      <option value="">Select...</option>
                      {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Number of Clients/Patients</label>
                    <select value={form.clientCount} onChange={e => setForm(f => ({ ...f, clientCount: e.target.value }))} className={inputClass}>
                      <option value="">Select...</option>
                      {CLIENT_COUNTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-500 mb-0.5 block">Website</label>
                  <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" className={inputClass} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Instagram</label>
                    <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@handle" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">Facebook</label>
                    <input value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} placeholder="Page URL" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">TikTok</label>
                    <input value={form.tiktok} onChange={e => setForm(f => ({ ...f, tiktok: e.target.value }))} placeholder="@handle" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 mb-0.5 block">LinkedIn</label>
                    <input value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="Profile URL" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-stone-500 mb-0.5 block">Message</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your business and partnership goals..." className={`${inputClass} min-h-[60px]`} />
                </div>

                <button onClick={handleSubmit} disabled={submitting} className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-800 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-60 transition">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit Application
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
