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
    return [
      // Canonical host: 301 www → apex so every page exists exactly once for
      // search engines. This covers every request the worker handles; static
      // files served straight from the Cloudflare assets layer (e.g. /brand/*,
      // /terms.html) bypass the worker, so a Cloudflare Redirect Rule for
      // www.[REDACTED].co.za/* is still recommended as the catch-all.
      // Two rules rather than one `/:path*`: OpenNext's redirect compiler
      // leaves a literal ":path*" in the Location header when the path is
      // empty, so the bare root gets its own rule.
      ...[
        { source: "/", destination: "https://[REDACTED].co.za/" },
        { source: "/:path+", destination: "https://[REDACTED].co.za/:path+" },
      ].map((rule) => ({
        ...rule,
        has: [{ type: "host" as const, value: "www.[REDACTED].co.za" }],
        statusCode: 301 as const,
      })),
      ...["terms", "privacy", "refund", "contact"].map((page) => ({
        source: `/${page}`,
        destination: `/${page}.html`,
        permanent: false,
      })),
    ];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
