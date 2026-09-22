import type { Metadata } from "next";
import Link from "next/link";

import { DrawRule, Heading, Label, Rise } from "@/components/record/primitives";

/**
 * Who ReVia works with, and how a conversation starts.
 *
 * ## What this page is careful about
 *
 * Every audience below arrived as a list of words from the owner — "GPOs,
 * CMOs, buying groups", "biomodeling and feasibility studies" — and the
 * temptation with a list like that is to write the programme around it: minimum
 * volumes, tier names, lead times, margins, a commission rate for the
 * affiliates. None of that is written down anywhere in this repository, so none
 * of it is written down here. What each section states is the audience and the
 * two or three things a first message should contain, which is true on the day
 * it ships and stays true however the terms land.
 *
 * The same goes in the other direction. This page describes conversations, and
 * a conversation is not an offer: there is no price, no quantity, no
 * availability and no control that starts a transaction anywhere on it. That is
 * not a stylistic choice, it is the condition of this domain existing — see
 * `scripts/check-claims.ts`, which fails the build over it.
 *
 * ## Why every route lands on /contact
 *
 * One desk. A per-audience mailbox implies a per-audience team, and inventing
 * an address that nobody reads is worse than a slightly slower reply from one
 * that somebody does. `contact@revialife.com` is the address the contact form
 * and the API route already use; it is not repeated in prose here, because the
 * page links to the form rather than asking a reader to copy an address.
 */

export const metadata: Metadata = {
  title: "Work With Us | ReVia",
  description:
    "Researchers, wholesale and white label, bulk, practitioners, affiliates, research partners and skin care — who ReVia works with, and how to start a conversation.",
  alternates: { canonical: "https://revialife.com/work-with-us" },
};

interface Audience {
  id: string;
  /** The heading. The owner's own words for the group. */
  title: string;
  /** Who is in it, set as the eyebrow so a reader can scan for themselves. */
  who: string;
  /** What the conversation covers, and what to put in the first message. */
  body: string;
  /** The link text. Per-section, because "Contact us" seven times reads as a form. */
  cta: string;
}

const AUDIENCES: Audience[] = [
  {
    id: "researchers",
    title: "Researchers",
    who: "Individuals and lab groups",
    body:
      "If you are working with these compounds yourself, tell us what you are running. We can point you to the certificate for the lot in question, to the monograph if we have published one, and to the ReVia property that serves an individual researcher.",
    cta: "Ask about a compound",
  },
  {
    id: "wholesale",
    title: "Wholesale — branded and white label",
    who: "Large physician groups, GPOs, CMOs, buying groups, telehealth companies, resellers",
    body:
      "Trade supply under the ReVia name or under your own. The compounds, the volumes and the packaging you have in mind are enough to start; we will take it from there with ReVia Wholesale, which is the property that handles trade accounts.",
    cta: "Start a wholesale conversation",
  },
  {
    id: "bulk",
    title: "Bulk",
    who: "Compounding pharmacies, large research institutions",
    body:
      "Larger quantities of a single compound, for organizations that go through it at scale. The compound, the quantity and your timeline are the three things we need to give you a useful answer.",
    cta: "Ask about bulk",
  },
  {
    id: "practitioners",
    title: "Practitioners and clinics",
    who: "Clinics, prescribers, and the staff who support them",
    body:
      "Professional accounts are served by their own property in the group, with its own terms. Tell us about your practice — what you do, roughly how many people you see, and what you are looking for — and we will make the introduction.",
    cta: "Ask about a professional account",
  },
  {
    id: "affiliates",
    title: "Affiliates and brand ambassadors",
    who: "Writers, educators, and practitioners with an audience",
    body:
      "If you already talk about this category, tell us where you publish and who reads you. We will go through what a partnership would involve, what we would ask of you, and what you can expect from us in writing before anything begins.",
    cta: "Ask about partnering",
  },
  {
    id: "research-partners",
    title: "Research partners",
    who: "Biomodeling and feasibility studies",
    body:
      "Collaborations on biomodeling and feasibility work. Describe the question you are trying to answer and the shape of the study, and we will tell you plainly whether we are the right people to help with it.",
    cta: "Propose a study",
  },
  {
    id: "skin-care",
    title: "Skin care",
    who: "Surgeons, doctors, aesthetics, spas, medspas, salons, and skin care enthusiasts",
    body:
      "ReVia Cosmetics is the group's skin care line. If you run a practice, a spa or a salon, or you simply follow this category closely, write to us about what you would want to see and we will come back to you as it takes shape.",
    cta: "Ask about skin care",
  },
];

export default function WorkWithUsPage() {
  return (
    <main className="bg-[#F6F3EC]">
      <div className="mx-auto max-w-[73.75rem] px-5 sm:px-8">
        {/* ── the masthead ── */}
        <div className="pt-16 sm:pt-24">
          <Rise>
            <Label>Work with us</Label>
            <Heading as="h1" className="mt-4 max-w-[20ch] text-[2.125rem] sm:text-[2.875rem]">
              Who we work with, and how to start
            </Heading>
            <p className="mt-6 max-w-[62ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              revialife.com publishes the record. The work itself happens across
              the group: supply for individual researchers, trade accounts,
              professional accounts, and collaborations. Below is who we work
              with, and what a first message should contain so we can give you a
              real answer rather than a holding one.
            </p>
            <p className="mt-4 max-w-[62ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              Every one of them starts the same way, at the same desk. Say which
              of these fits you, or write in your own words if none of them
              quite does.
            </p>
          </Rise>
        </div>

        {/* ── the audiences ── */}
        <div className="mt-14 sm:mt-20">
          <DrawRule />
          <ul>
            {AUDIENCES.map((a, i) => (
              <li key={a.id}>
                <Rise delay={0.04 * i}>
                  <div
                    id={a.id}
                    className="grid gap-4 border-b border-[#3D3229]/12 py-9 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-12"
                  >
                    <div>
                      <h2 className="font-serif text-[1.3125rem] leading-tight text-[#3D3229]">
                        {a.title}
                      </h2>
                      {/* The audience list is prose, not a section label, so it
                          is set in the sans body face rather than through
                          <Label> — small caps at this length is unreadable. */}
                      <p className="mt-3 max-w-[30ch] font-sans text-[0.8125rem] leading-[1.6] text-[#3D3229]/45">
                        {a.who}
                      </p>
                    </div>
                    <div>
                      <p className="max-w-[58ch] font-sans text-[0.9062rem] leading-[1.75] text-[#3D3229]/75">
                        {a.body}
                      </p>
                      <Link
                        href="/contact"
                        className="group mt-4 inline-flex items-baseline gap-2 font-sans text-[0.8125rem] font-medium text-[#3D3229]"
                      >
                        <span className="border-b border-[#A38569]/50 pb-0.5 transition group-hover:border-[#A38569]">
                          {a.cta}
                        </span>
                        <span className="text-[#A38569] transition group-hover:translate-x-0.5">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </Rise>
              </li>
            ))}
          </ul>
        </div>

        {/* ── the close ── */}
        <Rise>
          <div className="py-14 sm:py-20">
            <Heading className="max-w-[24ch] text-[1.625rem] sm:text-[1.9375rem]">
              Contact us to discuss your interests
            </Heading>
            <p className="mt-5 max-w-[58ch] font-sans text-[0.9375rem] leading-[1.8] text-[#3D3229]/70">
              One desk reads all of it. Tell us which of the above fits, what
              you are working on, and how soon you need an answer. We reply
              within 24 hours on business days.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="inline-flex items-baseline gap-2 border border-[#3D3229]/25 px-5 py-2.5 font-sans text-[0.8125rem] font-medium text-[#3D3229] transition hover:border-[#A38569] hover:text-[#A38569]"
              >
                Contact us
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link
                href="/network"
                className="font-sans text-[0.8125rem] text-[#3D3229]/50 underline decoration-[#3D3229]/20 underline-offset-4 transition hover:text-[#3D3229]"
              >
                See which property serves whom
              </Link>
            </div>
          </div>
        </Rise>
      </div>
    </main>
  );
}
