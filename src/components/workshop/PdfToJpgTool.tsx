"use client";

import { useState } from "react";
import { getPdfjs } from "@/lib/workshop/vendor";
import { runExport } from "@/lib/workshop/premium";
import { baseName, canvasToBlob, formatBytes, makeZip, parsePageRanges, triggerDownload, revokeAll } from "@/lib/workshop/files";
import { Busy, DropZone, ErrorNote, ExportButton, Label, Segmented, fieldClass, panelClass } from "./ui";

type Format = "image/jpeg" | "image/png";
type Dpi = "96" | "150" | "300";

interface Rendered {
  name: string;
  blob: Blob;
  url: string;
}

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState("");
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [dpi, setDpi] = useState<Dpi>("150");
  const [results, setResults] = useState<Rendered[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = async (files: File[]) => {
    const f = files[0];
    setError("");
    setResults(revokeAll);
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      setError("That isn't a PDF file.");
      return;
    }
    setBusy("Reading PDF…");
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()), isEvalSupported: false }).promise;
      setFile(f);
      setPageCount(doc.numPages);
      setPages(`1-${doc.numPages}`);
      await doc.destroy();
    } catch {
      setError("That PDF couldn't be opened. It may be damaged or password-protected.");
    } finally {
      setBusy("");
    }
  };

  const convert = async () => {
    if (!file) return;
    setError("");
    setResults(revokeAll);
    try {
      const indices = parsePageRanges(pages, pageCount);
      if (!indices.length) throw new Error("Choose at least one page.");
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
      const scale = Number(dpi) / 72;
      const ext = format === "image/png" ? "png" : "jpg";
      const name = baseName(file.name);
      const out: Rendered[] = [];
      for (const [n, idx] of indices.entries()) {
        setBusy(`Rendering page ${idx + 1} (${n + 1} of ${indices.length})…`);
        const page = await doc.getPage(idx + 1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas isn't supported in this browser.");
        ctx.fillStyle = "#ffffff"; // PDFs assume a white page; JPG has no transparency.
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await canvasToBlob(canvas, format, 0.92);
        out.push({ name: `${name}-page-${idx + 1}.${ext}`, blob, url: URL.createObjectURL(blob) });
        page.cleanup();
        canvas.width = canvas.height = 0;
      }
      await doc.destroy();
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy("");
    }
  };

  const total = results.reduce((s, r) => s + r.blob.size, 0);

  return (
    <div className="flex flex-col gap-5">
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={load}
        title={file ? `${file.name} · ${pageCount} pages. Drop another to replace` : "Drop a PDF here, or click to choose"}
        hint="Pages are rendered on your device. Your PDF is never uploaded."
      />
      <ErrorNote>{error}</ErrorNote>
      {file && (
        <div className={panelClass}>
          <div className="flex flex-col gap-2">
            <Label>FORMAT</Label>
            <Segmented<Format> label="Image format" value={format} onChange={setFormat} options={[{ value: "image/jpeg", label: "JPG" }, { value: "image/png", label: "PNG" }]} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>RESOLUTION</Label>
            <Segmented<Dpi>
              label="Resolution"
              value={dpi}
              onChange={setDpi}
              options={[
                { value: "96", label: "96 DPI · screen" },
                { value: "150", label: "150 DPI · standard" },
                { value: "300", label: "300 DPI · print" },
              ]}
            />
          </div>
          <label className="flex flex-col gap-2">
            <Label aside={`${pageCount} pages`}>PAGES</Label>
            <input value={pages} onChange={(e) => setPages(e.target.value)} className={fieldClass} spellCheck={false} placeholder="e.g. 1-3, 7" />
          </label>
          <div>
            <button type="button" onClick={convert} disabled={!!busy} className="sl-cta-primary rounded-[2px] bg-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-ink disabled:opacity-50">
              CONVERT →
            </button>
          </div>
        </div>
      )}
      {busy && <Busy>{busy}</Busy>}
      {results.length > 0 && !busy && (
        <div className={panelClass}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12.5px] text-bone-dim">
              {results.length} {results.length === 1 ? "image" : "images"} · {formatBytes(total)}
            </span>
            {results.length === 1 ? (
              <ExportButton action={{ tool: "pdf-to-jpg", action: "download", units: 1 }} onExport={() => triggerDownload(results[0].blob, results[0].name)}>
                DOWNLOAD →
              </ExportButton>
            ) : (
              <ExportButton
                action={{ tool: "pdf-to-jpg", action: "download-zip", units: results.length }}
                onExport={async () => triggerDownload(await makeZip(results.map((r) => ({ name: r.name, data: r.blob }))), `${baseName(file!.name)}-images.zip`)}
              >
                DOWNLOAD ALL (ZIP) →
              </ExportButton>
            )}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {results.map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => runExport({ tool: "pdf-to-jpg", action: "download", units: 1 }, () => triggerDownload(r.blob, r.name))}
                className="flex flex-col gap-1.5 border border-hairline bg-ink p-2 text-left hover:border-hairline-hover"
                title={`Download ${r.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={r.name} className="aspect-[3/4] w-full bg-white object-contain" />
                <span className="truncate text-[10.5px] text-grey">{r.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
