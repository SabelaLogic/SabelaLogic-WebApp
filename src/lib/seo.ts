import type { Metadata } from "next";
import type { WorkshopTool } from "@/lib/data/workshop-tools";

/**
 * Single source of truth for absolute URLs. Everything SEO-facing (canonical,
 * sitemap, robots, Open Graph, JSON-LD) builds from this, so a future domain
 * move (e.g. to a .com) is a one-line change plus a 301 at Cloudflare.
 */
export const SITE_URL = "https://[REDACTED].co.za";
export const SITE_NAME = "Sabela Logic";
export const DEFAULT_OG_IMAGE = "/og/default";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Builds a page's full metadata. Next.js merges `openGraph` and `twitter`
 * shallowly, so a page that sets either replaces the layout's object
 * entirely — this helper always emits the complete set.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: PageMetaInput): Metadata {
  const image = { url: ogImage, width: 1200, height: 630, alt: title };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: "en",
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function toolPath(tool: WorkshopTool): string {
  return `/workshop/${tool.slug}`;
}

export function toolMetadata(tool: WorkshopTool): Metadata {
  return pageMetadata({
    title: `${tool.seoTitle} | ${SITE_NAME}`,
    description: tool.seoDescription,
    path: toolPath(tool),
    ogImage: `/og/${tool.slug}`,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/brand/lockup.png"),
        description:
          "Software, automation and AI systems built end to end for clients anywhere in the world, plus free browser-based tools.",
        founder: { "@type": "Person", name: "Lunga Xhamela" },
        areaServed: "Worldwide",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function toolJsonLd(tool: WorkshopTool) {
  const url = absoluteUrl(toolPath(tool));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: tool.heading,
        url,
        description: tool.seoDescription,
        applicationCategory: tool.category,
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true,
        featureList: tool.features,
        inLanguage: "en",
        image: absoluteUrl(`/og/${tool.slug}`),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Workshop Tools", item: absoluteUrl("/workshop") },
          { "@type": "ListItem", position: 3, name: tool.name, item: url },
        ],
      },
    ],
  };
}

/** Serialises JSON-LD safely for a <script> tag (escapes `<` so content can't close the tag). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
