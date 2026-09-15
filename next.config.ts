import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // revialife.com no longer takes orders. Checkout is gone; purchase
      // intent leaves for the partner storefront from the CTAs on the page.
      // Any bookmarked checkout URL lands on the home page rather than a 404.
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/checkout/:path*", destination: "/", permanent: true },
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
