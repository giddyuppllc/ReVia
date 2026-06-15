import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical host: 308-redirect the www. variant to the bare apex so Google
  // stops indexing www.revialife.com pages as duplicate "alternate" URLs.
  // (The origin does receive Host: www.revialife.com through Cloudflare, so
  // this fires server-side.) Pair with Cloudflare "Always Use HTTPS" for the
  // http -> https leg.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.revialife.com" }],
        destination: "https://revialife.com/:path*",
        permanent: true,
      },
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
