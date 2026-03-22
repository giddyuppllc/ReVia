import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReVia Research Supply",
    short_name: "ReVia",
    description: "Premium research-grade peptides",
    start_url: "/",
    display: "standalone",
    background_color: "#f0fdf4",
    theme_color: "#059669",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
