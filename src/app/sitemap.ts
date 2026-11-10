import type { MetadataRoute } from "next";
import { WORKSHOP_TOOLS } from "@/lib/data/workshop-tools";
import { BLOG_POSTS } from "@/lib/data/blog-content";
import { BLOG_POSTS_UPDATED, PAGE_UPDATED, WORKSHOP_TOOLS_UPDATED } from "@/lib/data/content-dates";
import { absoluteUrl, toolPath } from "@/lib/seo";

/**
 * Only final, indexable, 200-status URLs belong here — no redirects, no
 * noindex pages (/login, /portal, /acceptance) and no trailing-slash variants.
 * lastmod is the real date the page's content last changed (see
 * content-dates.ts), not the build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    updated: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: absoluteUrl(path), lastModified: updated, changeFrequency, priority });

  const page = (path: string, priority: number, freq?: MetadataRoute.Sitemap[number]["changeFrequency"]) => {
    const updated = PAGE_UPDATED[path];
    if (!updated) throw new Error(`sitemap: no PAGE_UPDATED date for ${path}`);
    return entry(path, updated, priority, freq);
  };

  return [
    page("/", 1, "weekly"),
    page("/workshop", 0.9, "weekly"),
    ...WORKSHOP_TOOLS.map((tool) => entry(toolPath(tool), WORKSHOP_TOOLS_UPDATED, 0.8)),
    page("/services", 0.8),
    page("/start-a-build", 0.7),
    page("/blog", 0.6, "weekly"),
    ...BLOG_POSTS.map((post) => entry(`/blog/${post.slug}`, BLOG_POSTS_UPDATED, 0.5)),
    page("/team", 0.4),
  ];
}
