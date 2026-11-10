import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Client-only and API surfaces — nothing there for search engines.
        disallow: ["/svc/", "/portal", "/acceptance", "/login"],
      },
    ],
    // No `host:` line — it's a Yandex-only directive Google ignores; the
    // canonical host is enforced by the www → apex 301 and canonical tags.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
