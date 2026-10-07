import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages/Workers has no image optimization server to call out to.
    unoptimized: true,
  },
  // Clean URLs for the static legal pages in public/. On Cloudflare the
  // assets layer already serves /terms from terms.html before the worker
  // runs, so these mainly cover `next start` and any other host.
  async redirects() {
    return ["terms", "privacy", "refund", "contact"].map((page) => ({
      source: `/${page}`,
      destination: `/${page}.html`,
      permanent: false,
    }));
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
