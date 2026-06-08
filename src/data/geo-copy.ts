// Unique, AI-generated copy blocks for the geofenced engine. Filled by the
// geo-copy generation workflow. Until a key is present, pages fall back to a
// deterministic, data-driven template (still differentiated — built from unique
// product + city data). All copy is research-use-only / informational; no
// medical, treatment, or dosing claims.

export interface CityCopy {
  /** 2–3 sentence unique intro for the city hub page. */
  intro?: string;
}

export interface CityProductCopy {
  /** Unique 2–3 sentence intro for [product] in [city]. */
  intro?: string;
  /** Unique FAQ Q/A pairs (research/informational framing). */
  faq?: { q: string; a: string }[];
}

// Populated by the workflow. Empty is fine — getters fall back to templates.
export const cityCopy: Record<string, CityCopy> = {};
export const cityProductCopy: Record<string, Record<string, CityProductCopy>> = {};

export function getCityCopy(citySlug: string): CityCopy {
  return cityCopy[citySlug] ?? {};
}

export function getCityProductCopy(citySlug: string, productSlug: string): CityProductCopy {
  return cityProductCopy[citySlug]?.[productSlug] ?? {};
}
