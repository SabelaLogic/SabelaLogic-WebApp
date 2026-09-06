import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages/Workers has no image optimization server to call out to.
    unoptimized: true,
  },
};

export default nextConfig;
