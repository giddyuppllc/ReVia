"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Google Analytics, loaded only once someone has said yes.
 *
 * ## What was wrong
 *
 * The gtag scripts sat in `<head>` and ran on every page load, before the
 * cookie banner had even appeared. The banner wrote "accepted" or "declined" to
 * localStorage and nothing read it, so Decline was a button that dismissed
 * itself and changed nothing — the visitor was measured either way, and had
 * been told otherwise.
 *
 * ## What happens now
 *
 * Nothing loads until consent is stored. `next/script` with `afterInteractive`
 * injects it at that point, and the storage event listener means clicking
 * Accept starts measurement in the same page view rather than the next one.
 *
 * ## The cross-domain linker
 *
 * `linker.domains` still carries revialife.com and world-wide-peptide.com. That
 * is one of the six funnel sites, not a ReVia property, and it is the only
 * external domain in the configuration — worth a decision about whether it
 * belongs, but not one to make silently while fixing consent.
 */

const GA_ID = "G-WDJGY6R2PS";
const KEY = "revia-cookie-consent";

export default function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const read = () => setGranted(localStorage.getItem(KEY) === "accepted");
    read();
    // Fires for the banner in this tab and for a choice made in another one.
    window.addEventListener("revia-consent", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("revia-consent", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!granted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{linker:{domains:['revialife.com','world-wide-peptide.com']}});`}
      </Script>
    </>
  );
}
