import type { Metadata } from "next";
import {
  researchCompounds,
  getCompoundBySlug,
} from "@/data/research-compounds";
import ResearchDetailClient from "./ResearchDetailClient";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import I2bAvailability from "@/components/I2bAvailability";

/* ── Static generation ── */
export function generateStaticParams() {
  return researchCompounds.map((c) => ({ slug: c.slug }));
}

/* ── Dynamic metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const compound = getCompoundBySlug(slug);

  if (!compound) {
    return { title: "Compound Not Found | ReVia" };
  }

  const url = `https://revialife.com/research/${slug}`;
  return {
    title: `${compound.name} Research Summary | ReVia`,
    description: compound.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${compound.name} Research Summary | ReVia`,
      description: compound.description,
      type: "article",
      url,
    },
  };
}

/* ── Page component ── */
export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const compound = getCompoundBySlug(slug);

  if (!compound) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://revialife.com/" },
          { name: "Research", url: "https://revialife.com/research" },
          { name: compound.name, url: `https://revialife.com/research/${compound.slug}` },
        ]}
      />
      <ResearchDetailClient compound={compound} />
      {/* Below the monograph, not above it. The page exists to explain the
          compound; where to obtain it is the answer to a question the reader
          only has once they have read it. Renders nothing at all when i2b's
          catalogue cannot be reached — see the component. */}
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <I2bAvailability
          researchSlug={compound.slug}
          compoundName={compound.name}
          placement="monograph"
        />
      </div>
    </>
  );
}
