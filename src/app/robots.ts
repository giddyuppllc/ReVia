import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /admin, /checkout and /account were deleted with the shop; a
        // disallow for a route that does not exist tells a crawler there is
        // something there worth not looking at. /unsubscribe is noindex in its
        // own metadata and carries a signed address in the query string, so it
        // is kept out of the crawl as well.
        disallow: ["/api", "/unsubscribe"],
      },
    ],
    sitemap: "https://revialife.com/sitemap.xml",
  };
}
