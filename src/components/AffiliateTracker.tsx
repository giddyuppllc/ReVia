"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    // Store in cookie for 30 days
    document.cookie = `revia_ref=${ref};path=/;max-age=${30 * 24 * 60 * 60};SameSite=Lax`;

    // Track click
    fetch("/api/affiliate/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref }),
    }).catch(() => {});
  }, [searchParams]);

  return null;
}
