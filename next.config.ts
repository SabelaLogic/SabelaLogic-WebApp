import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages/Workers has no image optimization server to call out to.
    unoptimized: true,
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
