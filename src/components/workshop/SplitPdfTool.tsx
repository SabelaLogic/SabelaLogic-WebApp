"use client";

import { useState } from "react";
import { getPdfLib, type PdfLibDocument } from "@/lib/workshop/vendor";
import { baseName, makeZip, parsePageRanges, triggerDownload } from "@/lib/workshop/files";
import { Busy, DropZone, ErrorNote, ExportButton, Label, Segmented, fieldClass, panelClass } from "./ui";

type Mode = "extract" | "every";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("extract");
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = async (files: File[]) => {
    const f = files[0];
    setError("");
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      setError("That isn't a PDF file.");
      return;
    }
    setBusy("Reading PDF…");
    try {
      const { PDFDocument } = await getPdfLib();
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setFile(f);
      setPageCount(doc.getPageCount());
      setRanges(doc.getPageCount() > 1 ? `1-${Math.min(3, doc.getPageCount())}` : "1");
    } catch {
      setError("That PDF couldn't be read. It may be damaged or password-protected.");
    } finally {
      setBusy("");
    }
  };

  const pagesToPdf = async (src: PdfLibDocument, indices: number[]) => {
    const { PDFDocument } = await getPdfLib();
    const out = await PDFDocument.create();
    (await out.copyPages(src, indices)).forEach((p) => out.addPage(p));
    return out.save();
  };

  const run = async () => {
    if (!file) return;
    setError("");
    setBusy(mode === "every" ? "Splitting every page…" : "Extracting pages…");
    try {
      const { PDFDocument } = await getPdfLib();
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const name = baseName(file.name);
      if (mode === "extract") {
        const indices = parsePageRanges(ranges, pageCount);
        if (!indices.length) throw new Error("Enter at least one page, e.g. 1-3, 5.");
        const bytes = await pagesToPdf(src, indices);
        triggerDownload(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }), `${name}-pages.pdf`);
      } else {
        const entries = [];
        const width = String(pageCount).length;
        for (let i = 0; i < pageCount; i++) {
          entries.push({ name: `${name}-page-${String(i + 1).padStart(width, "0")}.pdf`, data: await pagesToPdf(src, [i]) });
        }
        triggerDownload(await makeZip(entries), `${name}-split.zip`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Split failed.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={load}
        title={file ? `${file.name} · ${pageCount} pages. Drop another to replace` : "Drop a PDF here, or click to choose"}
        hint="Split on your device. Your PDF is never uploaded."
      />
      <ErrorNote>{error}</ErrorNote>
      {file && (
        <div className={panelClass}>
          <Segmented<Mode>
            label="Split mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "extract", label: "Extract pages into one PDF" },
              { value: "every", label: "Every page as its own PDF (ZIP)" },
            ]}
          />
          {mode === "extract" && (
            <label className="flex flex-col gap-2">
              <Label aside={`${pageCount} pages`}>PAGES TO KEEP</Label>
              <input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 5, 8-" className={fieldClass} spellCheck={false} />
              <span className="text-[11.5px] text-grey">Use commas and ranges. &ldquo;8-&rdquo; means page 8 to the end. Order is kept as typed.</span>
            </label>
          )}
          <div>
            <ExportButton
              action={{ tool: "split-pdf", action: mode === "every" ? "download-zip" : "download", units: pageCount }}
              onExport={run}
              disabled={!!busy}
            >
              {mode === "every" ? `SPLIT INTO ${pageCount} PDFs →` : "EXTRACT & DOWNLOAD →"}
            </ExportButton>
          </div>
        </div>
      )}
      {busy && <Busy>{busy}</Busy>}
    </div>
  );
}
