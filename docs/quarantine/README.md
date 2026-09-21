# Quarantined asset — do not return to `public/`

## `hero-lab-coa.webp`

Removed from `public/images/` on 2026-09-19. It was the site-wide OpenGraph
image (`src/app/layout.tsx`), so it was the preview card rendered for every
revialife.com link posted anywhere.

It is a rendered photograph of four ReVia vials beside a framed document
headed **CERTIFICATE OF ANALYSIS**, legible at card size, reporting:

| Test              | Specification      | Result        |
|-------------------|--------------------|---------------|
| Appearance        | White Lyophilized… | Complies      |
| Identity          | Conforms to Standard | Complies    |
| Purity (HPLC)     | ≥ 99%              | 99.8%         |
| Water Content     | ≤ 5.0%             | 2.1%          |
| Endotoxins        | ≤ 1.0 EU/mg        | < 0.1 EU/mg   |
| Residual Solvents | Conforms           | Complies      |
| Peptide Content   | 95.0 – 105.0%      | 101.2%        |

The certificate is not real. `PRODUCT NAME`, `BATCH NUMBER`, `MANUFACTURE DATE`
and `TEST DATE` are blank, and there is a drawn signature over `QA APPROVAL`.

Three separate problems with publishing it:

1. **It reports tests that are not run.** `scripts/check-claims.ts` names
   endotoxin and residual solvents specifically as assays no certificate here
   carries. The image asserts results for both.
2. **It contradicts the real specification.** `src/lib/coa.ts` sets
   `puritySpec: ">98%"`. The image claims ≥99%, and the vial labels in it read
   "99% Purity".
3. **The claim gate cannot see it.** Every rule in `check-claims.ts` reads text.
   These claims are pixels, so the build passed while the strongest unsupported
   claim on the site shipped as its share card.

On a site whose entire argument is that its documents can be checked, a
fabricated document is the worst possible asset to lead with.

### The replacement is a placeholder

OpenGraph now points at `hero-overlook.webp`, which is what the Twitter card
already used — so the two at least agree, which they did not before. It is
stock photography and it is not a good answer either. A real photograph of the
actual vials, or a card built from type, should replace it.

Do not re-point any card at a rendered certificate.
