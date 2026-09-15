"use client";

import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { B2B, D2C, PARTNER_LINK_PROPS, b2bUrl, d2cUrl } from "@/lib/partner";

/* ------------------------------------------------------------------ */
/*  Audience router                                                    */
/*                                                                     */
/*  Three cards that send each kind of visitor to the right place. The */
/*  consumer route goes to i2b and the trade route to ReVia Wholesale  */
/*  — those two are not interchangeable, since Wholesale does no D2C.  */
/*  The research route stays here, which is what this site is for.     */
/* ------------------------------------------------------------------ */

type Slide = {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  linkText: string;
  href: string;
  /** False for an in-site route. */
  external: boolean;
};

const slides: Slide[] = [
  {
    image: "/images/carousel-wellness.webp",
    title: "Looking for",
    subtitle: "Research Supplies?",
    description: `Research-grade compounds for laboratory use, supplied direct by ${D2C.name}.`,
    href: d2cUrl(),
    external: D2C.isLive,
    linkText: `Shop at ${D2C.name}`,
  },
  {
    image: "/images/carousel-performance.webp",
    title: "Are you a",
    subtitle: "Business or Brand?",
    description: `Wholesale pricing, private label and bulk supply from ${B2B.name}.`,
    href: b2bUrl("wholesale"),
    external: true,
    linkText: "Click here",
  },
  {
    image: "/images/carousel-lifestyle.webp",
    title: "Want to",
    subtitle: "Understand It First?",
    description: "Compound guides, stack explainers and sourcing standards — in plain English.",
    href: "/learn",
    external: false,
    linkText: "Start Learning",
  },
];

function SlideBody({ slide }: { slide: Slide }) {
  return (
    <div className="relative aspect-[16/9]">
      <img
        src={slide.image}
        alt={slide.title}
        width={1600}
        height={900}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-5">
        <h3 className="text-xl font-bold text-white leading-tight sm:text-lg lg:text-xl">
          {slide.title}
          <br />
          <span className="text-[#7FC4EE]">{slide.subtitle}</span>
        </h3>
        <p className="mt-1.5 text-xs text-white/60 line-clamp-2 max-w-[90%]">
          {slide.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7FC4EE] group-hover:text-[#A9D9F5] transition-colors">
          {slide.linkText}
          {slide.external ? (
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-2 pb-8 sm:pt-0 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
        {slides.map((slide, i) =>
          slide.external ? (
            <a
              key={i}
              href={slide.href}
              {...PARTNER_LINK_PROPS}
              className="group relative overflow-hidden rounded-2xl"
            >
              <SlideBody slide={slide} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <Link key={i} href={slide.href} className="group relative overflow-hidden rounded-2xl">
              <SlideBody slide={slide} />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
