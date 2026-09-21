import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  B2B,
  D2C,
  PARTNER_LINK_PROPS,
  b2bUrl,
  d2cUrl,
  type B2BPath,
} from "@/lib/partner";

type Variant = "solid" | "outline" | "chip";

// globals.css remaps the whole sky and blue scales to warm mocha
// (--color-sky-600 is #8B6D4F), so a Tailwind blue utility renders BROWN here.
// The site's real accent blue — the hero's primary CTA, the logo swoosh — is
// this explicit hex, so the solid variant states it directly. The softer
// variants stay on the mocha scale, which is what the cards already sit on.
const VARIANTS: Record<Variant, string> = {
  solid:
    "border border-[#3E97CE] bg-[#3E97CE] text-white shadow-sm hover:bg-[#3585B8] hover:border-[#3585B8] active:scale-[0.97]",
  outline:
    "bg-transparent text-[#3D3229] border border-[#3D3229]/25 hover:border-[#A38569] hover:text-[#A38569]",
  chip:
    "bg-white/90 text-[#2f7ba8] border border-[#3E97CE]/35 hover:bg-[#3E97CE]/10 active:scale-95",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

/**
 * `audience` decides where this goes, and the two are not interchangeable:
 *   "d2c" — i2b, for individual researchers buying for themselves.
 *   "b2b" — ReVia Wholesale, which serves businesses and brands ONLY.
 * Sending a consumer to the wholesale site is a dead end for them, so the
 * audience is required rather than defaulted.
 */
export default function PartnerShopButton({
  audience,
  children,
  b2bPath = "wholesale",
  variant = "solid",
  size = "md",
  className = "",
  showIcon = true,
}: {
  audience: "d2c" | "b2b";
  children?: React.ReactNode;
  b2bPath?: B2BPath;
  variant?: Variant;
  size?: keyof typeof SIZES;
  className?: string;
  showIcon?: boolean;
}) {
  const isB2B = audience === "b2b";
  const name = isB2B ? B2B.name : D2C.name;
  const href = isB2B ? b2bUrl(b2bPath) : d2cUrl();

  // B2B is always external. D2C is external only once i2b has a domain —
  // until then d2cUrl() returns /contact, which must render as a real
  // internal link rather than a new-tab link to a relative path.
  const external = isB2B || D2C.isLive;
  const classes = `inline-flex items-center gap-1.5 rounded-xl font-semibold transition ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const label = children ?? `Shop at ${name}`;

  if (!external) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...PARTNER_LINK_PROPS}
      title={`Opens ${name} in a new tab`}
      className={classes}
    >
      {label}
      {showIcon && <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span className="sr-only"> (opens {name} in a new tab)</span>
    </a>
  );
}
