import JsonLd from "@/components/JsonLd";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: it.url,
        })),
      }}
    />
  );
}
