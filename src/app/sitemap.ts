import type { MetadataRoute } from "next";
import { WORKSHOP_TOOLS } from "@/lib/data/workshop-tools";
import { BLOG_POSTS } from "@/lib/data/blog-content";
import { absoluteUrl, toolPath } from "@/lib/seo";

// Prerendered at build time, so lastModified reflects the last deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: absoluteUrl(path), lastModified: now, changeFrequency, priority });

  return [
    entry("/", 1, "weekly"),
    entry("/workshop", 0.9, "weekly"),
    ...WORKSHOP_TOOLS.map((tool) => entry(toolPath(tool), 0.8)),
    entry("/start-a-build", 0.7),
    entry("/blog", 0.6, "weekly"),
    ...BLOG_POSTS.map((post) => entry(`/blog/${post.slug}`, 0.5)),
    entry("/team", 0.4),
  ];
}
