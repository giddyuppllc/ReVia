"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, Check, X, Copy } from "lucide-react";

// First-time-visitor welcome offer: email for 10% off the first order.
//
// Rules of engagement, deliberately narrow so it can't annoy a buyer:
//   • once per visitor (localStorage), and never again after they claim it
//   • never on checkout / cart / account / admin — no interrupting a purchase
//   • waits for the age gate to be cleared first, otherwise it fires behind it
//   • opens on a delay OR on exit intent, whichever comes first
const STORAGE_KEY = "revia-welcome-popup";
const CODE = "WELCOME10";
const DELAY_MS = 8000;
const SUPPRESSED_PREFIXES = ["/checkout", "/cart", "/account", "/admin", "/order"];

export default function WelcomePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "claimed" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const armed = useRef(false);

  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname?.startsWith(p));

  const close = useCallback((remember: boolean) => {
    setOpen(false);
    document.body.style.overflow = "";
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "dismissed");
      } catch {
        /* private mode — just don't remember */
      }
    }
  }, []);

  useEffect(() => {
    if (suppressed || armed.current) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    armed.current = true;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let ageWatch: ReturnType<typeof setInterval> | undefined;

    const show = () => {
      setOpen(true);
      cleanup();
    };

    const onExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (ageWatch) clearInterval(ageWatch);
      document.removeEventListener("mouseout", onExitIntent);
    };

    // The age gate locks scrolling and covers the viewport; wait it out.
    const start = () => {
      timer = setTimeout(show, DELAY_MS);
      document.addEventListener("mouseout", onExitIntent);
    };

    if (localStorage.getItem("revia-age-verified")) {
      start();
    } else {
      ageWatch = setInterval(() => {
        if (localStorage.getItem("revia-age-verified")) {
          clearInterval(ageWatch);
          start();
        }
      }, 1000);
    }

    return cleanup;
  }, [suppressed]);

  // Escape to dismiss.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "welcome-popup" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("claimed");
      try {
        localStorage.setItem(STORAGE_KEY, "claimed");
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  function copyCode() {
    navigator.clipboard?.writeText(CODE).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        /* clipboard blocked — the code is on screen anyway */
      }
    );
  }

  if (!open || suppressed) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-stone-900/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => close(true)}
      role="dialog"
      aria-modal="true"
      aria-label="10% off your first order"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => close(true)}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 pb-7 pt-9 text-center">
          {status === "claimed" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#A38569]/15">
                <Check className="h-6 w-6 text-[#A38569]" />
              </div>
              <h2 className="font-serif text-2xl text-[#3D3229]">You&apos;re in.</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Use this code at checkout for 10% off your first order. We&apos;ve emailed it to you as well.
              </p>
              <button
                type="button"
                onClick={copyCode}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#A38569] bg-[#F0EDE5] px-4 py-3 font-mono text-lg tracking-[0.2em] text-[#3D3229] transition hover:bg-[#e9e4d9]"
              >
                {CODE}
                {copied ? <Check className="h-4 w-4 text-[#A38569]" /> : <Copy className="h-4 w-4 text-stone-400" />}
              </button>
              <a
                href="/shop"
                onClick={() => close(true)}
                className="mt-3 block w-full rounded-xl bg-[#3D3229] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2c241e]"
              >
                Shop the catalog
              </a>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A38569]">
                First order
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-[#3D3229]">
                Take 10% off
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Join the ReVia list for your discount code, batch COA releases, and restock
                notices. No spam — unsubscribe any time.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-center text-sm outline-none transition focus:border-[#A38569] focus:ring-2 focus:ring-[#A38569]/20"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D3229] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2c241e] disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    "Get my 10% code"
                  )}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-3 text-xs text-red-600">{errorMessage}</p>
              )}

              <button
                type="button"
                onClick={() => close(true)}
                className="mt-4 text-xs text-stone-400 underline underline-offset-2 transition hover:text-stone-600"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
