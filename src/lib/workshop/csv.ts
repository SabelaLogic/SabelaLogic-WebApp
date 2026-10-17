/** RFC 4180-style CSV parsing and writing. Handles quotes, escaped quotes, embedded newlines and CRLF. */

export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const candidates = [",", ";", "\t", "|"];
  let best = ",";
  let bestCount = 0;
  for (const d of candidates) {
    const count = firstLine.split(d).length - 1;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

export function parseCsv(text: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, ""); // strip Excel's BOM
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"' && field === "") inQuotes = true;
    else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (inQuotes) throw new Error("A quoted field is never closed. Check for a stray \" character.");
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

function inferValue(v: string): unknown {
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null") return null;
  // Keep leading-zero values (phone numbers, postcodes, IDs) as strings.
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(v) && Number.isFinite(Number(v)) && v.length < 16) return Number(v);
  return v;
}

export function csvToJson(text: string, opts: { delimiter?: string; header: boolean; infer: boolean }): unknown[] {
  const rows = parseCsv(text, opts.delimiter ?? detectDelimiter(text));
  if (!rows.length) return [];
  const val = (v: string) => (opts.infer ? inferValue(v) : v);
  if (!opts.header) return rows.map((r) => r.map(val));
  const headers = rows[0].map((h, i) => h.trim() || `column_${i + 1}`);
  // De-duplicate repeated header names so no column is silently overwritten.
  const seen: Record<string, number> = {};
  const keys = headers.map((h) => (seen[h] = (seen[h] ?? 0) + 1) > 1 ? `${h}_${seen[h]}` : h);
  return rows.slice(1).map((r) => Object.fromEntries(keys.map((k, i) => [k, val(r[i] ?? "")])));
}

function flatten(obj: unknown, prefix = "", out: Record<string, unknown> = {}): Record<string, unknown> {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (Array.isArray(obj)) {
    out[prefix] = JSON.stringify(obj);
  } else {
    out[prefix] = obj;
  }
  return out;
}

function escapeField(v: unknown, delimiter: string): string {
  const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /["\r\n]/.test(s) || s.includes(delimiter) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function jsonToCsv(text: string, delimiter = ","): string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (err) {
    throw new Error(`That isn't valid JSON: ${err instanceof Error ? err.message : ""}`);
  }
  if (!Array.isArray(data)) {
    // Accept { "items": [...] } style wrappers and single objects.
    const arr = data && typeof data === "object" ? Object.values(data).find(Array.isArray) : undefined;
    data = arr ?? [data];
  }
  const rows = data as unknown[];
  if (rows.every(Array.isArray)) return rows.map((r) => (r as unknown[]).map((v) => escapeField(v, delimiter)).join(delimiter)).join("\r\n");
  const flat = rows.map((r) => flatten(r && typeof r === "object" ? r : { value: r }));
  const headers: string[] = [];
  for (const r of flat) for (const k of Object.keys(r)) if (!headers.includes(k)) headers.push(k);
  return [headers.map((h) => escapeField(h, delimiter)).join(delimiter), ...flat.map((r) => headers.map((h) => escapeField(r[h], delimiter)).join(delimiter))].join("\r\n");
}
