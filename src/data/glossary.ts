import { COA_SPEC } from "@/lib/coa";

/**
 * The vocabulary, defined.
 *
 * Every term here appears somewhere on this site or on a certificate a reader
 * can be shown. That is the test for inclusion — a glossary padded with words
 * the site never uses is a keyword page wearing a reference book's clothes.
 *
 * Two rules in the definitions:
 *
 *   1. Define, do not claim. "cGMP" says what the letters stand for and what
 *      registration does and does not mean; it does not say ReVia's facility is
 *      better for holding it.
 *   2. Say plainly where a term is often used loosely. Several of these —
 *      "third-party tested", "pharmaceutical grade", "batch tested" — are used
 *      in this category to mean almost nothing, and a reader is better served
 *      by being told that than by a tidy definition that pretends otherwise.
 *
 * Assays ReVia does not run are deliberately absent. Explaining an endotoxin
 * test on a site whose certificates do not report one invites the reader to
 * assume it was performed.
 */

export interface Term {
  slug: string;
  term: string;
  /** Expansion of an abbreviation, where there is one. */
  expansion?: string;
  definition: string;
  /** Where this matters when reading a certificate or a product page. */
  inPractice?: string;
  /** Related terms, by slug. */
  see?: string[];
}

export const GLOSSARY: Term[] = [
  {
    slug: "research-use-only",
    term: "Research Use Only",
    expansion: "RUO",
    definition:
      "A designation meaning a material is supplied for laboratory research and is not intended for human or veterinary use. It is not a quality grade and it is not an approval — it describes the permitted use, nothing else.",
    inPractice:
      "A compound sold Research Use Only has not been evaluated by the FDA for safety or efficacy in people, whatever else is true about how it was made or tested.",
    see: ["certificate-of-analysis", "compounding"],
  },
  {
    slug: "certificate-of-analysis",
    term: "Certificate of Analysis",
    expansion: "COA",
    definition:
      "A laboratory document reporting what was measured on a specific batch of material, by which method, on what date, and by whom.",
    inPractice:
      "A certificate is only evidence about the batch it names. One issued for a different lot tells you nothing about the vial in your hand, which is why the batch number on the document and on the label should match.",
    see: ["batch", "rp-hplc", "identity-quantity-purity-metals"],
  },
  {
    slug: "batch",
    term: "Batch",
    expansion: "also: lot",
    definition:
      "A quantity of material produced in one run, under one set of conditions, and treated as a single unit for testing and traceability.",
    inPractice:
      "Testing is per batch because material from a different run is different material. A supplier who publishes one certificate for a product rather than one per batch is publishing a sample, not a record.",
    see: ["certificate-of-analysis"],
  },
  {
    slug: "rp-hplc",
    term: "RP-HPLC",
    expansion: "reversed-phase high-performance liquid chromatography",
    definition:
      "A separation technique that pushes a dissolved sample through a column so its components come off at different times. With a UV detector, the size of each peak gives a proportion — which is how a purity figure is produced.",
    inPractice: `It is the method named on ReVia's certificates: ${COA_SPEC.method}. "Tested" without a named method is not something you can check.`,
    see: ["purity-specification", "certificate-of-analysis"],
  },
  {
    slug: "purity-specification",
    term: "Purity specification",
    definition:
      "The threshold a batch must meet to pass, as distinct from the figure actually measured on it.",
    inPractice: `ReVia's specification is ${COA_SPEC.puritySpec}. The measured result varies from batch to batch and is printed on that batch's certificate — a headline number on a website is a specification, not a measurement.`,
    see: ["rp-hplc", "certificate-of-analysis"],
  },
  {
    slug: "identity-quantity-purity-metals",
    term: "Identity, quantity, purity, metals",
    definition:
      "The four results ReVia's certificates report: that the material is what the label says, how much peptide is in the vial, what proportion of it is the named compound, and the heavy-metal content.",
    inPractice:
      "A certificate reports the tests that were run. An absent result is not a passed result — assume nothing about anything the document does not mention.",
    see: ["certificate-of-analysis", "heavy-metals"],
  },
  {
    slug: "heavy-metals",
    term: "Heavy metals",
    definition:
      "Trace metallic elements that can carry over from manufacture, reported as a concentration.",
    inPractice: `Reported against a specification of ${COA_SPEC.metalsSpec}. "ppb" is parts per billion.`,
    see: ["identity-quantity-purity-metals"],
  },
  {
    slug: "lyophilised",
    term: "Lyophilised",
    expansion: "freeze-dried",
    definition:
      "Dried by freezing the material and removing the water under vacuum, leaving a solid cake or powder that is stable at ordinary temperatures far longer than a solution would be.",
    inPractice:
      "It is why research peptides ship as a powder in a sealed vial rather than as a liquid, and why the vial is reconstituted before use.",
    see: ["reconstitution", "bacteriostatic-water"],
  },
  {
    slug: "reconstitution",
    term: "Reconstitution",
    definition:
      "Returning a lyophilised powder to solution by adding a measured volume of diluent to the vial.",
    inPractice:
      "The volume added determines the concentration. Nothing about reconstitution changes what is in the vial — a certificate describes the powder, whatever it is later dissolved in.",
    see: ["lyophilised", "bacteriostatic-water"],
  },
  {
    slug: "bacteriostatic-water",
    term: "Bacteriostatic water",
    definition:
      "Sterile water containing a small proportion of benzyl alcohol, which inhibits bacterial growth and so allows a vial to be entered more than once.",
    inPractice:
      "Distinct from sterile water for injection, which contains no preservative and is intended for single use.",
    see: ["reconstitution"],
  },
  {
    slug: "cgmp",
    term: "cGMP",
    expansion: "current Good Manufacturing Practice",
    definition:
      "The FDA's regulations governing how a facility manufactures, tests and documents what it produces — covering premises, equipment, records and controls rather than any particular product.",
    inPractice:
      "Registration of a facility is not approval of a product. A facility can be registered and cGMP-compliant while making something the FDA has never evaluated.",
    see: ["fda-registration", "research-use-only"],
  },
  {
    slug: "fda-registration",
    term: "FDA registration",
    definition:
      "A facility telling the FDA it exists and what it does, which establishments are required to do. It is an administrative filing.",
    inPractice:
      "It is not an endorsement, an inspection result, or approval of anything made there — a distinction routinely blurred in marketing copy.",
    see: ["cgmp"],
  },
  {
    slug: "compounding",
    term: "Compounding",
    definition:
      "Preparing a medication for an individual patient by combining or altering ingredients, done by a licensed pharmacy or outsourcing facility rather than by a manufacturer.",
    inPractice:
      "Whether a given substance may be compounded at all depends on whether it appears on a list the FDA maintains — which is what the Pharmacy Compounding Advisory Committee meets to consider.",
    see: ["pcac", "bulk-substance", "section-503a"],
  },
  {
    slug: "section-503a",
    term: "503A and 503B",
    definition:
      "Two sections of the Federal Food, Drug, and Cosmetic Act. 503A covers traditional pharmacy compounding for an identified patient; 503B covers registered outsourcing facilities, which may compound in larger quantities and are subject to cGMP.",
    inPractice:
      "The two operate under different rules, and a claim about one does not transfer to the other.",
    see: ["compounding", "cgmp"],
  },
  {
    slug: "bulk-substance",
    term: "Bulk drug substance",
    definition:
      "An active ingredient in its raw form, before it is made into a finished preparation.",
    inPractice:
      "The FDA maintains lists of bulk substances that may be used in compounding. A substance being reviewed for that list is the subject of a Pharmacy Compounding Advisory Committee session.",
    see: ["compounding", "pcac"],
  },
  {
    slug: "pcac",
    term: "Pharmacy Compounding Advisory Committee",
    expansion: "PCAC",
    definition:
      "An FDA advisory committee that reviews substances proposed for compounding and votes on recommendations to the agency.",
    inPractice:
      "Its votes are recommendations. A recommendation is not a rule, and the FDA is not bound by it.",
    see: ["compounding", "bulk-substance", "docket"],
  },
  {
    slug: "docket",
    term: "Docket",
    definition:
      "The public file for a federal proceeding, holding the submissions and comments filed to it, each with an identifier.",
    inPractice:
      "A docket number lets anybody retrieve the same documents the committee saw, including written comments from the public.",
    see: ["pcac"],
  },
  {
    slug: "third-party-tested",
    term: "“Third-party tested”",
    definition:
      "A phrase meaning testing was performed by a laboratory other than the seller.",
    inPractice:
      "On its own it commits to nothing: no laboratory named, no method stated, no batch identified, and no result. It becomes checkable only when all four are present.",
    see: ["certificate-of-analysis", "rp-hplc"],
  },
  {
    slug: "pharmaceutical-grade",
    term: "“Pharmaceutical grade”",
    definition:
      "A marketing phrase with no fixed regulatory definition in this context.",
    inPractice:
      "There is no standard it corresponds to and no body that awards it. The specification on a certificate is a statement; this is not.",
    see: ["purity-specification", "research-use-only"],
  },
];

/** Alphabetical, by the term as displayed. */
export const GLOSSARY_SORTED: Term[] = [...GLOSSARY].sort((a, b) =>
  a.term.replace(/[^A-Za-z]/g, "").localeCompare(b.term.replace(/[^A-Za-z]/g, "")),
);

export const GLOSSARY_COUNT = GLOSSARY.length;

export function getTerm(slug: string): Term | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

/** Throws at module load if a `see` reference points at nothing. */
function assertGlossary(): void {
  const known = new Set(GLOSSARY.map((t) => t.slug));
  for (const t of GLOSSARY) {
    for (const ref of t.see ?? []) {
      if (!known.has(ref)) {
        throw new Error(`glossary: "${t.slug}" references "${ref}", which is not a term`);
      }
    }
  }
}
assertGlossary();
