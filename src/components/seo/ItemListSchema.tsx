import JsonLd from "@/components/JsonLd";

export interface ItemListEntry {
  name: string;
  url: string;
}

export default function ItemListSchema({ items, name }: { items: ItemListEntry[]; name?: string }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        ...(name ? { name } : {}),
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          url: it.url,
        })),
      }}
    />
  );
}
