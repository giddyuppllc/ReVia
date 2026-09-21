import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, Layers, Timer } from "lucide-react";
import PartnerShopButton from "@/components/PartnerShopButton";
import { D2C } from "@/lib/partner";

export const metadata: Metadata = {
  title: "What’s a Stack? | ReVia",
  description:
    "A stack is several complementary peptides blended into a single vial — what that means in practice, and how a blend differs from handling separate vials.",
  alternates: { canonical: "https://revialife.com/stacks" },
};

// What a stack actually is, described plainly. Kept to the mechanics of a
// blended vial — what is in it and how it is handled — rather than to any
// claim about what it does.
const STACK_EXPLAINER = [
  {
    icon: Layers,
    title: "Several peptides, one vial",
    body: "A stack is a blend: two or more complementary compounds combined in a single vial at fixed ratios, rather than bought and handled as separate vials.",
  },
  {
    icon: FlaskConical,
    title: "Reconstituted once",
    body: "Because the compounds share a vial, the blend is reconstituted once and drawn as one solution — the ratio between compounds is set at the point it is blended, not at the bench.",
  },
  {
    icon: Timer,
    title: "Formulated around a research goal",
    body: "Each blend pairs compounds that are commonly researched together, so the vial is organized around one line of research instead of assembled ad hoc.",
  },
];

// The practical difference, stated as a comparison rather than a claim about
// which is better — that depends entirely on what the work needs.
const COMPARISON = {
  blend: [
    "One vial to store, label and track",
    "One reconstitution, so one chance to introduce error",
    "Ratio between compounds fixed when it was blended",
    "The whole vial moves together — one compound cannot be varied alone",
  ],
  separate: [
    "A vial per compound to store, label and track",
    "A reconstitution per compound",
    "Ratio decided at the bench, every time",
    "Each compound can be varied on its own",
  ],
};

// What to actually check before trusting any blend, from any source.
const WHAT_TO_CHECK = [
  {
    title: "Does the COA cover the blend?",
    body: "A certificate for each ingredient is not the same as a certificate for the vial that was actually filled. Ask which one you are being shown.",
  },
  {
    title: "Is the ratio stated?",
    body: "A blend is defined by its proportions. If the label names the compounds but not how much of each, the vial is not fully described.",
  },
  {
    title: "Which compound sets the handling?",
    body: "Storage and stability follow the least forgiving compound in the vial, not the average of them.",
  },
];

export default function StacksPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
          Start Here
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          What’s a Stack?
        </h1>
        <p className="mt-4 text-lg text-neutral-500">
          Precision-blended vials combining synergistic peptides. Each stack is formulated for a
          specific research outcome — no mixing, no guesswork.
        </p>
      </div>

      {/* The explainer — this page answers the question before it lists anything */}
      <div className="mb-20 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {STACK_EXPLAINER.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-sky-200/60 bg-sky-50/50 p-6"
          >
            <Icon size={20} className="text-sky-600" aria-hidden="true" />
            <h2 className="mt-3 text-base font-semibold text-neutral-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">{body}</p>
          </div>
        ))}
      </div>

      {/* Blend vs separate vials */}
      <div className="mb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            A blend, or separate vials?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Neither is the right answer on its own. The difference is where the decisions get
            made &mdash; at the blender, or at the bench.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-sky-200/60 bg-sky-50/50 p-7">
            <h3 className="text-base font-semibold text-neutral-900">One blended vial</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPARISON.blend.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-neutral-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-semibold text-neutral-900">Separate vials</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPARISON.separate.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-neutral-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* What to check before trusting any blend */}
      <div className="mb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Three things worth checking
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Ask these of any blend, from any source &mdash; including ours.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {WHAT_TO_CHECK.map(({ title, body }, i) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <span className="text-xs font-bold tabular-nums text-sky-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Onward: read more, or order */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-8">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Read about the compounds
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-500">
            Mechanisms, research applications and cited studies for every compound that goes into
            a blend.
          </p>
          <Link
            href="/research"
            className="mt-6 inline-flex items-center gap-1.5 self-start rounded-xl border border-sky-300/60 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Browse the library
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col rounded-3xl border border-[#3E97CE]/25 bg-gradient-to-br from-white to-sky-50/70 p-8">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Ready to order?</h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
            ReVia stacks are supplied by our exclusive research partner, {D2C.name}.
          </p>
          <PartnerShopButton audience="d2c" size="md" variant="solid" className="mt-6 self-start">
            Shop at {D2C.name}
          </PartnerShopButton>
        </div>
      </div>

    </section>
  );
}
