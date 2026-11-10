#!/usr/bin/env node
/**
 * Indexability check for every URL in sitemap.xml.
 *
 *   npm run build && npm run start &   # or any running deployment
 *   node scripts/check-seo.mjs http://localhost:3000
 *
 * The sitemap lists absolute production URLs; each one is re-requested
 * against BASE (path preserved) and must:
 *   - return 200 with no redirect
 *   - have exactly one canonical, equal to the sitemap URL
 *   - carry no noindex (meta robots or X-Robots-Tag)
 *   - have a unique <title> and meta description, and an <h1>
 *   - have a real (non-build-time) lastmod
 * It also checks that a *.workers.dev Host gets X-Robots-Tag: noindex.
 * Exits non-zero on any failure.
 */
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const failures = [];
const fail = (msg) => failures.push(msg);

const norm = (u) => (new URL(u).pathname === "/" ? new URL(u).origin + "/" : u);
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`, "i")) || [])[1];
const decode = (s) =>
  s?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const smRes = await fetch(`${BASE}/sitemap.xml`, { headers: { "User-Agent": UA } });
if (smRes.status !== 200) {
  console.error(`sitemap.xml returned ${smRes.status}`);
  process.exit(1);
}
const sm = await smRes.text();
const entries = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: (m[1].match(/<loc>(.*?)<\/loc>/) || [])[1],
  lastmod: (m[1].match(/<lastmod>(.*?)<\/lastmod>/) || [])[1],
}));
if (entries.length === 0) fail("sitemap.xml has no <url> entries");

const today = new Date().toISOString().slice(0, 10);
const titles = new Map();
const descs = new Map();

for (const { loc, lastmod } of entries) {
  const path = new URL(loc).pathname;
  if (path !== "/" && path.endsWith("/")) fail(`${loc}: trailing slash in sitemap URL`);
  if (!lastmod) fail(`${loc}: missing lastmod`);
  else if (lastmod.includes("T")) fail(`${loc}: lastmod looks like a build timestamp (${lastmod})`);

  const res = await fetch(BASE + path, { redirect: "manual", headers: { "User-Agent": UA } });
  if (res.status !== 200) {
    fail(`${loc}: status ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`);
    continue;
  }
  const xrt = res.headers.get("x-robots-tag") || "";
  if (/noindex/i.test(xrt)) fail(`${loc}: X-Robots-Tag ${xrt}`);
  const html = await res.text();
  const head = html.split("</head>")[0];

  const canon = [...head.matchAll(/<link[^>]+rel="canonical"[^>]*>/gi)].map((m) => attr(m[0], "href"));
  if (canon.length !== 1) fail(`${loc}: ${canon.length} canonical tags`);
  else if (norm(canon[0]) !== norm(loc)) fail(`${loc}: canonical is ${canon[0]}`);

  for (const m of head.matchAll(/<meta[^>]+name="(robots|googlebot)"[^>]*>/gi)) {
    if (/noindex/i.test(attr(m[0], "content") || "")) fail(`${loc}: meta ${m[1]} noindex`);
  }
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
  const desc = decode(attr((head.match(/<meta[^>]+name="description"[^>]*>/i) || [""])[0], "content"));
  if (!title) fail(`${loc}: no <title>`);
  if (!desc) fail(`${loc}: no meta description`);
  if (!/<h1[\s>]/i.test(html)) fail(`${loc}: no <h1> in server HTML`);
  if (title) titles.set(title, [...(titles.get(title) || []), loc]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), loc]);
}
for (const [t, urls] of titles) if (urls.length > 1) fail(`duplicate title "${t}": ${urls.join(", ")}`);
for (const [d, urls] of descs) if (urls.length > 1) fail(`duplicate description "${d}": ${urls.join(", ")}`);

// Preview hosts must be noindex. Only meaningful against a local server,
// where we can spoof the Host header.
if (/localhost|127\.0\.0\.1/.test(BASE)) {
  const { request } = await import("node:http");
  const u = new URL(BASE + "/workshop");
  const xrt = await new Promise((resolve, reject) => {
    const req = request(
      { host: u.hostname, port: u.port, path: u.pathname, headers: { Host: "preview.example.workers.dev", "User-Agent": UA } },
      (r) => {
        r.resume();
        resolve(r.headers["x-robots-tag"] || "");
      },
    );
    req.on("error", reject);
    req.end();
  });
  if (!/noindex/i.test(xrt)) fail(`*.workers.dev host is missing X-Robots-Tag noindex (got "${xrt}")`);
}

console.log(`Checked ${entries.length} sitemap URLs against ${BASE} (lastmod sanity vs today ${today}).`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n- ` + failures.join("\n- "));
  process.exit(1);
}
console.log("All indexability checks passed.");
