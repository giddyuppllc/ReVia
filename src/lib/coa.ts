/* ------------------------------------------------------------------ */
/*  What the Certificate of Analysis actually says                     */
/*                                                                     */
/*  Every testing claim on this site is built from this module. It     */
/*  exists because the same claim, written out by hand in eight        */
/*  places, had already drifted: the FAQ said ">99% purity" while the  */
/*  structured data said "98%+", and the home page advertised twelve   */
/*  assays against a certificate that runs one.                        */
/*                                                                     */
/*  Read from two live certificates on 2026-09-11:                     */
/*    /coa/retatrutide-coa.png  — Chromate #32917, purity 99.375%      */
/*    /coa/tirzepatide-coa.png  — Chromate #32920, purity 98.622%      */
/*                                                                     */
/*  Both state ONE method and FOUR results. The second is why the      */
/*  specification below is >98% and not >99%: a certificate published  */
/*  on this very site reports 98.622%, so ">99%" was disproved by our  */
/*  own document.                                                      */
/*                                                                     */
/*  Do not add an assay here because a competitor advertises it. If    */
/*  it is not printed on the certificate, it does not go on the site.  */
/* ------------------------------------------------------------------ */

export const COA_SPEC = {
  /** The independent laboratory named on the certificate. */
  lab: "Chromate",

  /** Where a reader can check a certificate for themselves. */
  verifyUrl: "https://chromate.org/verify",

  /** The single analytical method, as printed. */
  method: "RP-HPLC with UV detection",

  /** The method sentence, verbatim from the certificate. */
  methodStatement:
    "Qualitative and quantitative chemical analysis by RP-HPLC with UV detection",

  /** Purity specification. The measured figure varies by batch and is on the COA. */
  puritySpec: ">98%",

  /** Heavy metals specification. */
  metalsSpec: "<50 ppb",
} as const;

/**
 * The four results every certificate reports, in the order they are printed.
 * This array is the authority for "how many tests" — never write the number.
 */
export const COA_RESULTS = [
  {
    key: "identity",
    label: "Identity",
    detail: "Confirmed against specification",
  },
  {
    key: "quantity",
    label: "Quantity",
    detail: "Net peptide per vial",
  },
  {
    key: "purity",
    label: "Purity",
    detail: `Specification ${COA_SPEC.puritySpec}`,
  },
  {
    key: "metals",
    label: "Metals",
    detail: `Specification ${COA_SPEC.metalsSpec}`,
  },
] as const;

export type CoaResultKey = (typeof COA_RESULTS)[number]["key"];

/** How many results a certificate reports. Derived, so it cannot drift. */
export const COA_RESULT_COUNT = COA_RESULTS.length;
