/**
 * Last *meaningful* content change per URL, used as <lastmod> in sitemap.xml.
 *
 * Google only trusts lastmod when it is consistently accurate. The old sitemap
 * stamped every URL with the build/request time, so every URL looked "changed
 * today" on every fetch and the signal was ignored. Bump the date here when you
 * change a page's main content (not for footer or styling tweaks).
 *
 * Dates are YYYY-MM-DD, taken from git history at the time of writing.
 */
export const PAGE_UPDATED: Record<string, string> = {
  "/": "2026-10-19",
  "/workshop": "2026-10-17",
  "/services": "2026-11-10",
  "/start-a-build": "2026-11-10",
  "/blog": "2026-11-10",
  "/team": "2026-10-17",
};

/** Workshop tool pages: the shared tool shell and how-to/FAQ content last changed on this date. */
export const WORKSHOP_TOOLS_UPDATED = "2026-10-19";

/** Blog posts: template gained dates, Article structured data and related reading on this date. */
export const BLOG_POSTS_UPDATED = "2026-11-10";

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

/** "2 SEP 2026" → "2026-09-02". Returns undefined for anything it can't parse. */
export function displayDateToIso(display: string): string | undefined {
  const m = display.trim().toUpperCase().match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/);
  if (!m || !MONTHS[m[2]]) return undefined;
  return `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}`;
}
