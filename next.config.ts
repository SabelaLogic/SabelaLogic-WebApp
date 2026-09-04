import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Pages/Workers has no image optimization server to call out to.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sabelalogic26.firebaseapp.com",
      },
    ],
  },
};

export default nextConfig;
