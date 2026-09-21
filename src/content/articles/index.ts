import { validateArticles, type Article } from "@/lib/articles";
import { renaissanceOfPeptideResearch } from "./renaissance-of-peptide-research";
import { understandingBpc157Research } from "./understanding-bpc-157-research";
import { glp1AgonistsBeyondHeadlines } from "./glp1-agonists-beyond-headlines";
import { mitochondrialPeptidesLongevityFrontier } from "./mitochondrial-peptides-longevity-frontier";
import { scienceOfPeptideStacking } from "./science-of-peptide-stacking";
import { ghkCuCopperPeptideResearch } from "./ghk-cu-copper-peptide-research";
import { nootropicPeptidesCognitiveResearch } from "./nootropic-peptides-cognitive-research";
import { howToEvaluatePeptideSupplier } from "./how-to-evaluate-peptide-supplier";
import { gutBrainAxisPeptideResearch } from "./gut-brain-axis-peptide-research";
import { article2025PeptideResearchTrends } from "./2025-peptide-research-trends";

/**
 * The archive, newest first.
 *
 * Adding an article is a module beside this one and a line here. The same shape
 * as src/content/news/index.ts, for the same reason: the registry is explicit,
 * so nothing appears on the site because a file happened to land in a folder.
 */
export const ARTICLES: Article[] = [
  renaissanceOfPeptideResearch,
  understandingBpc157Research,
  glp1AgonistsBeyondHeadlines,
  mitochondrialPeptidesLongevityFrontier,
  scienceOfPeptideStacking,
  ghkCuCopperPeptideResearch,
  nootropicPeptidesCognitiveResearch,
  howToEvaluatePeptideSupplier,
  gutBrainAxisPeptideResearch,
  article2025PeptideResearchTrends,
].sort((a, b) => (a.published < b.published ? 1 : -1));

// Throws at module load rather than rendering something malformed.
validateArticles(ARTICLES);

export const ARTICLE_COUNT = ARTICLES.length;
export const getArticle = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug);
export const articleCategories = (): string[] =>
  [...new Set(ARTICLES.map((a) => a.category))].sort();
