import Link from "next/link";
import { CheckCircle2, MailWarning } from "lucide-react";
import ResendVerification from "./ResendVerification";

export const metadata = {
  title: "Email Verification — ReVia Research Supply",
  robots: { index: false, follow: false },
};

const STATES: Record<string, { title: string; body: string; ok: boolean; offerResend: boolean }> = {
  already: {
    title: "Already Verified",
    body: "This email address is already verified. You can sign in and continue.",
    ok: true,
    offerResend: false,
  },
  invalid: {
    title: "This Link Has Expired",
    body: "This verification link is no longer valid — it may already have been used, or replaced by a newer one.",
    ok: false,
    offerResend: true,
  },
  missing: {
    title: "This Link Didn't Come Through",
    body: "Some email apps break long links. Request a new one below, or copy the link from your email into your browser's address bar.",
    ok: false,
    offerResend: true,
  },
  error: {
    title: "Something Went Wrong",
    body: "We couldn't verify your email just now. Please try again in a moment.",
    ok: false,
    offerResend: true,
  },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const state = STATES[status ?? ""] ?? STATES.missing;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            state.ok ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          ) : (
            <MailWarning className="h-7 w-7 text-amber-600" />
          )}
        </div>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">{state.title}</h1>
        <p className="mt-2 text-sm text-neutral-500">{state.body}</p>

        {!state.ok ? (
          <p className="mt-4 text-xs text-neutral-400">
            Verifying is optional — you can browse and order without it.
          </p>
        ) : null}

        {state.offerResend ? <ResendVerification /> : null}

        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Link href="/login" className="text-sky-600 transition-colors hover:text-sky-500">
            Sign in
          </Link>
          <span className="text-neutral-300">·</span>
          <Link href="/shop" className="text-sky-600 transition-colors hover:text-sky-500">
            Browse catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
