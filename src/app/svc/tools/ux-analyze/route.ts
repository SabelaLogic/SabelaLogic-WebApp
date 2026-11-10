import { NextResponse } from "next/server";

// Free heuristic scan — regex-based signals from the raw HTML, not a full render.
// Deliberately conservative: this is a lead-generation tool, not a paid audit product,
// so findings lean toward "worth a second look" rather than definitive verdicts.

interface Finding {
  pillar: string;
  status: "good" | "warn" | "bad";
  message: string;
}

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "127.0.0.1", "::1"]);

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(h)) return true;
  if (h.endsWith(".local")) return true;
  // Private / link-local / loopback IPv4 ranges
  const ipMatch = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [a, b] = ipMatch.slice(1).map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  return false;
}

function countMatches(re: RegExp, text: string): number {
  return (text.match(re) ?? []).length;
}

function analyzeHtml(html: string, finalUrl: string): { score: number; findings: Finding[] } {
  const findings: Finding[] = [];
  let score = 0;

  // --- Simplicity & hierarchy (0-20) ---
  let simplicity = 0;
  const h1Count = countMatches(/<h1[\s>]/gi, html);
  if (h1Count === 1) {
    simplicity += 10;
    findings.push({ pillar: "Simplicity", status: "good", message: "Exactly one <h1> — a clear primary heading." });
  } else if (h1Count === 0) {
    findings.push({ pillar: "Simplicity", status: "bad", message: "No <h1> found — the page has no clear primary heading for readers or search engines." });
  } else {
    findings.push({ pillar: "Simplicity", status: "warn", message: `${h1Count} <h1> tags found — multiple competing top-level headings can blur hierarchy.` });
  }
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const titleLen = titleMatch ? titleMatch[1].trim().length : 0;
  if (titleLen >= 10 && titleLen <= 60) {
    simplicity += 10;
    findings.push({ pillar: "Simplicity", status: "good", message: "Page title is a sensible length." });
  } else if (titleLen === 0) {
    findings.push({ pillar: "Simplicity", status: "bad", message: "No <title> tag found." });
  } else {
    findings.push({ pillar: "Simplicity", status: "warn", message: `Title is ${titleLen} characters — ${titleLen > 60 ? "likely truncated in search results" : "quite short for context"}.` });
  }
  score += simplicity;

  // --- Navigation (0-20) ---
  let nav = 0;
  const hasNav = /<nav[\s>]|role=["']navigation["']/i.test(html);
  if (hasNav) {
    nav += 12;
    findings.push({ pillar: "Navigation", status: "good", message: "A semantic navigation landmark is present." });
  } else {
    findings.push({ pillar: "Navigation", status: "warn", message: "No <nav> or role=\"navigation\" landmark found — harder for assistive tech to find primary navigation." });
  }
  const hasFooterNav = /<footer[\s>]/i.test(html);
  if (hasFooterNav) {
    nav += 8;
    findings.push({ pillar: "Navigation", status: "good", message: "A <footer> landmark is present for secondary navigation." });
  } else {
    findings.push({ pillar: "Navigation", status: "warn", message: "No <footer> landmark found." });
  }
  score += nav;

  // --- Performance proxy (0-20) ---
  let perf = 20;
  const sizeKb = Math.round(html.length / 1024);
  if (sizeKb > 300) {
    perf -= 8;
    findings.push({ pillar: "Performance", status: "bad", message: `Initial HTML is ${sizeKb}KB — that's heavy before any images or scripts load.` });
  } else if (sizeKb > 150) {
    perf -= 4;
    findings.push({ pillar: "Performance", status: "warn", message: `Initial HTML is ${sizeKb}KB — on the heavier side.` });
  } else {
    findings.push({ pillar: "Performance", status: "good", message: `Initial HTML is a lean ${sizeKb}KB.` });
  }
  const blockingScripts = countMatches(/<script(?![^>]*\b(?:async|defer|type=["']application\/(?:ld\+json|json)["']))[^>]*src=/gi, html);
  if (blockingScripts > 3) {
    perf -= 8;
    findings.push({ pillar: "Performance", status: "bad", message: `${blockingScripts} render-blocking <script> tags found (no async/defer).` });
  } else if (blockingScripts > 0) {
    perf -= 3;
    findings.push({ pillar: "Performance", status: "warn", message: `${blockingScripts} script tag(s) load without async/defer.` });
  }
  score += Math.max(0, perf);

  // --- Accessibility proxy (0-20) ---
  let a11y = 0;
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  if (hasViewport) {
    a11y += 8;
    findings.push({ pillar: "Accessibility", status: "good", message: "A responsive viewport meta tag is set." });
  } else {
    findings.push({ pillar: "Accessibility", status: "bad", message: "No viewport meta tag — the page likely isn't mobile-responsive." });
  }
  const hasLang = /<html[^>]+lang=["'][a-z-]+["']/i.test(html);
  if (hasLang) {
    a11y += 6;
    findings.push({ pillar: "Accessibility", status: "good", message: "The <html> element declares a language." });
  } else {
    findings.push({ pillar: "Accessibility", status: "warn", message: "No lang attribute on <html> — screen readers may mispronounce content." });
  }
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  const imgsWithAlt = imgTags.filter((tag) => /\balt=["'][^"']*["']/.test(tag)).length;
  if (imgTags.length === 0) {
    a11y += 6;
  } else {
    const ratio = imgsWithAlt / imgTags.length;
    if (ratio === 1) {
      a11y += 6;
      findings.push({ pillar: "Accessibility", status: "good", message: `All ${imgTags.length} <img> tags have alt text.` });
    } else if (ratio >= 0.5) {
      a11y += 3;
      findings.push({ pillar: "Accessibility", status: "warn", message: `${imgsWithAlt}/${imgTags.length} images have alt text.` });
    } else {
      findings.push({ pillar: "Accessibility", status: "bad", message: `Only ${imgsWithAlt}/${imgTags.length} images have alt text.` });
    }
  }
  score += a11y;

  // --- Trust & feedback proxy (0-20) ---
  let trust = 0;
  const isHttps = finalUrl.startsWith("https://");
  if (isHttps) {
    trust += 10;
    findings.push({ pillar: "Trust", status: "good", message: "Served over HTTPS." });
  } else {
    findings.push({ pillar: "Trust", status: "bad", message: "Not served over HTTPS — browsers flag this as \"Not Secure.\"" });
  }
  const hasContact = /mailto:|tel:|contact/i.test(html);
  if (hasContact) {
    trust += 10;
    findings.push({ pillar: "Trust", status: "good", message: "A contact link or reference was found." });
  } else {
    findings.push({ pillar: "Trust", status: "warn", message: "No obvious contact link (mailto:, tel:, or a contact reference) found." });
  }
  score += trust;

  return { score: Math.max(0, Math.min(100, score)), findings };
}

export async function POST(request: Request) {
  const { url } = (await request.json().catch(() => ({}))) as { url?: string };

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Enter a URL to scan." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only http and https URLs are supported." }, { status: 400 });
  }
  if (isBlockedHost(parsed.hostname)) {
    return NextResponse.json({ error: "That host can't be scanned." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "SabelaLogicWorkshopBot/1.0 (+https://sabelalogic.co.za/workshop)" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `The site responded with status ${res.status}.` }, { status: 502 });
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({ error: "That URL didn't return an HTML page." }, { status: 400 });
    }

    const fullText = await res.text();
    const html = fullText.slice(0, 600_000); // cap what we scan
    const { score, findings } = analyzeHtml(html, res.url || parsed.toString());

    return NextResponse.json({ url: res.url || parsed.toString(), score, findings });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "That site took too long to respond." }, { status: 504 });
    }
    return NextResponse.json({ error: "Could not reach that URL." }, { status: 502 });
  }
}
