import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // revialife.com no longer takes orders. Checkout is gone; purchase
      // intent leaves for the partner storefront from the CTAs on the page.
      // Any bookmarked checkout URL lands on the home page rather than a 404.
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/checkout/:path*", destination: "/", permanent: true },

      // The shop is gone. /shop/:slug and /research/:slug share a slug for the
      // compounds that have a monograph, so the deep link lands on the reading
      // rather than on the index — which is what someone following an old
      // product link actually wanted.
      { source: "/shop", destination: "/research", permanent: true },
      { source: "/shop/:slug", destination: "/research/:slug", permanent: true },

      // /compare was a side-by-side of prices and nothing else.
      { source: "/compare", destination: "/research", permanent: true },

      // The eleven stack pages were product bundles — LC120, the Biomaxxing
      // tiers, Revia Lean. Only one of them (super-human-blend) has a
      // monograph, so redirecting each to /research/:slug would 404 ten of
      // them. They all land on the explainer, which is a live page about what
      // a stack is and is the honest answer to the query that brought them.
      { source: "/stacks/:slug", destination: "/stacks", permanent: true },

      // Accounts existed to place orders.
      { source: "/account", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
      { source: "/register", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
