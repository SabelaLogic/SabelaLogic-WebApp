"use client";

import { formatBytes, makeZip, triggerDownload } from "@/lib/workshop/files";
import { runExport } from "@/lib/workshop/premium";
import { ExportButton, panelClass } from "./ui";

export interface ImageResult {
  name: string;
  blob: Blob;
  url: string;
  originalBytes: number;
  note?: string;
}

/** Shared result list for the batch image tools: per-file download plus "download all" as a ZIP. */
export function BatchImageResults({ tool, results, zipName }: { tool: string; results: ImageResult[]; zipName: string }) {
  if (!results.length) return null;
  const before = results.reduce((s, r) => s + r.originalBytes, 0);
  const after = results.reduce((s, r) => s + r.blob.size, 0);
  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[12.5px] text-bone-dim">
          {results.length} {results.length === 1 ? "file" : "files"} · {formatBytes(before)} → {formatBytes(after)}
        </span>
        {results.length === 1 ? (
          <ExportButton action={{ tool, action: "download", units: 1 }} onExport={() => triggerDownload(results[0].blob, results[0].name)}>
            DOWNLOAD →
          </ExportButton>
        ) : (
          <ExportButton
            action={{ tool, action: "download-zip", units: results.length }}
            onExport={async () => triggerDownload(await makeZip(results.map((r) => ({ name: r.name, data: r.blob }))), zipName)}
          >
            DOWNLOAD ALL (ZIP) →
          </ExportButton>
        )}
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {results.map((r) => (
          <li key={r.url} className="flex items-center gap-3 border-t border-hairline pt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.url} alt="" className="h-12 w-12 shrink-0 bg-[#1a1918] object-contain" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] text-bone">{r.name}</span>
              <span className="block text-[11px] text-grey">
                {formatBytes(r.originalBytes)} → {formatBytes(r.blob.size)}
                {r.note ? ` · ${r.note}` : ""}
              </span>
            </span>
            {results.length > 1 && (
              <button
                type="button"
                onClick={() => runExport({ tool, action: "download", units: 1 }, () => triggerDownload(r.blob, r.name))}
                className="text-[11.5px] text-signal hover:underline"
              >
                Download
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
