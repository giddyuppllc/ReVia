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
    detail: "Is it the peptide on the label?",
  },
  {
    key: "quantity",
    label: "Quantity",
    detail: "How many milligrams are in the vial",
  },
  {
    key: "purity",
    label: "Purity",
    detail: `How much of the material is the named peptide (spec ${COA_SPEC.puritySpec})`,
  },
  {
    key: "metals",
    label: "Metals",
    detail: `Heavy metals against a ${COA_SPEC.metalsSpec} limit`,
  },
] as const;

export type CoaResultKey = (typeof COA_RESULTS)[number]["key"];

/** How many results a certificate reports. Derived, so it cannot drift. */
export const COA_RESULT_COUNT = COA_RESULTS.length;


/**
 * One certificate, transcribed line by line — the worked example on /why-us.
 *
 * It lives here rather than in the component for the same reason the purity
 * specification does: this file is the authority for what the certificates say,
 * and `check-claims` reads its `puritySpec` rather than hardcoding one.
 *
 * It is also the only place on the site a MEASURED purity figure is allowed to
 * appear, and the distinction is worth stating. The `no-typed-purity` rule
 * exists to stop a measured value being presented as a general claim — "99.4%
 * average purity", which was on the home page and was false. A figure printed
 * beside the lot code it was measured on, on a certificate identified by number
 * and date, is the opposite of that: it is a reading, attributed, and it is what
 * teaches somebody how to read their own.
 *
 * Source: COA #33593, Sermorelin 10 mg, sample received 27 March 2026,
 * analysed 28 March, produced 29 March.
 */
export const COA_EXAMPLE = {
  number: "33593",
  product: "Sermorelin 10 mg",
  lotCode: "RECODE4X3KZ3",
  received: "March 27, 2026",
  analysed: "March 28, 2026",
  produced: "March 29, 2026",
  chemist: "Lucas Weber, Principal Chemist",
  rows: [
    ["Laboratory", `${COA_SPEC.lab}, verify portal at chromate.org/verify`],
    ["Product and lot code", "Sermorelin 10 mg, RECODE4X3KZ3"],
    ["Method", "Qualitative and quantitative analysis by RP-HPLC with UV detection (220 nm)"],
    ["Identity", "Sermorelin, conforms"],
    ["Quantity", "11.36 mg found against 10 mg labeled (+13.6%), conforms"],
    ["Purity", `98.028% against a ${COA_SPEC.puritySpec} specification, conforms`],
    ["Metals", `Below 50 ppb, against a ${COA_SPEC.metalsSpec} limit, conforms`],
    ["Signed", "Lucas Weber, Principal Chemist; produced March 29, 2026"],
  ],
} as const;
