import { MetadataRoute } from "next";
import { isCanonicalDeployment } from "@/lib/canonical-host";

export default function robots(): MetadataRoute.Robots {
  // A preview must not advertise a sitemap of the real site's URLs, and it must
  // not invite a crawl of itself. Crawling is still allowed rather than
  // Disallow-ed, deliberately: a blocked page cannot be read, so the noindex in
  // the page head would never be seen and an already-known URL would linger in
  // the index. Allow the crawl, refuse the index.
  if (!isCanonicalDeployment()) {
    return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api", "/unsubscribe"] }] };
  }
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
