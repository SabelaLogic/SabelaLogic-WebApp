"use client";

import { useState } from "react";
import { getPdfLib } from "@/lib/workshop/vendor";
import { formatBytes, triggerDownload } from "@/lib/workshop/files";
import { Busy, DropZone, ErrorNote, ExportButton, btnGhost, panelClass } from "./ui";

interface Item {
  id: string;
  file: File;
  pages: number | null;
}

let nextId = 0;

export function MergePdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const addFiles = async (files: File[]) => {
    setError("");
    const pdfs = files.filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
    if (pdfs.length < files.length) setError("Skipped files that aren't PDFs.");
    if (!pdfs.length) return;
    setBusy("Reading files…");
    try {
      const { PDFDocument } = await getPdfLib();
      const added: Item[] = [];
      for (const file of pdfs) {
        let pages: number | null = null;
        try {
          const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
          pages = doc.getPageCount();
        } catch {
          setError(`"${file.name}" couldn't be read. It may be damaged or password-protected.`);
          continue;
        }
        added.push({ id: String(nextId++), file, pages });
      }
      setItems((prev) => [...prev, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load the PDF engine.");
    } finally {
      setBusy("");
    }
  };

  const move = (i: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const merge = async () => {
    setError("");
    setBusy("Merging…");
    try {
      const { PDFDocument } = await getPdfLib();
      const out = await PDFDocument.create();
      for (const item of items) {
        const src = await PDFDocument.load(await item.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      triggerDownload(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }), "merged.pdf");
    } catch (err) {
      setError(err instanceof Error ? `Merge failed: ${err.message}` : "Merge failed.");
    } finally {
      setBusy("");
    }
  };

  const totalPages = items.reduce((s, i) => s + (i.pages ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <DropZone
        accept="application/pdf,.pdf"
        multiple
        onFiles={addFiles}
        title="Drop PDFs here, or click to choose"
        hint="Add as many as you like. Merged on your device, never uploaded."
      />
      <ErrorNote>{error}</ErrorNote>
      {items.length > 0 && (
        <div className={panelClass}>
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {items.map((item, i) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-2 last:border-0 last:pb-0">
                <span className="min-w-0 flex-1 truncate text-[12.5px] text-bone">
                  <span className="mr-2 text-grey">{i + 1}.</span>
                  {item.file.name}
                  <span className="ml-2 text-grey">
                    {item.pages} {item.pages === 1 ? "page" : "pages"} · {formatBytes(item.file.size)}
                  </span>
                </span>
                <span className="flex gap-1.5">
                  <button type="button" className={btnGhost} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${item.file.name} up`}>↑</button>
                  <button type="button" className={btnGhost} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${item.file.name} down`}>↓</button>
                  <button type="button" className={btnGhost} onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))} aria-label={`Remove ${item.file.name}`}>✕</button>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[12px] text-grey">
              {items.length} files · {totalPages} pages total
            </span>
            <ExportButton
              action={{ tool: "merge-pdf", action: "download", units: items.length }}
              onExport={merge}
              disabled={items.length < 2 || !!busy}
            >
              MERGE &amp; DOWNLOAD →
            </ExportButton>
          </div>
          {items.length === 1 && <p className="m-0 text-[11.5px] text-grey">Add at least one more PDF to merge.</p>}
        </div>
      )}
      {busy && <Busy>{busy}</Busy>}
    </div>
  );
}
