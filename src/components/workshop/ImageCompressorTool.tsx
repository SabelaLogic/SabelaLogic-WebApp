"use client";

import { useCallback, useRef, useState } from "react";

interface Result {
  url: string;
  originalBytes: number;
  compressedBytes: number;
  fileName: string;
  keptOriginal: boolean;
}

function supportsWebpEncoding(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

export function ImageCompressorTool() {
  const [quality, setQuality] = useState(0.72);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("That doesn't look like an image file.");
        return;
      }
      setBusy(true);
      setError("");
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported in this browser.");
        ctx.drawImage(bitmap, 0, 0);
        const useWebp = supportsWebpEncoding();
        const mime = useWebp ? "image/webp" : "image/jpeg";
        const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
        if (!blob) throw new Error("Could not compress that image.");
        if (result) URL.revokeObjectURL(result.url);

        // Some sources (already-optimized WebP, simple graphics) can come out larger after
        // re-encoding — never hand back something bigger than what was dropped in.
        const keptOriginal = blob.size >= file.size;
        const finalBlob = keptOriginal ? file : blob;
        const ext = keptOriginal ? file.name.match(/\.[^.]+$/)?.[0] ?? "" : useWebp ? ".webp" : ".jpg";
        setResult({
          url: URL.createObjectURL(finalBlob),
          originalBytes: file.size,
          compressedBytes: finalBlob.size,
          fileName: file.name.replace(/\.[^.]+$/, "") + (keptOriginal ? "" : "-compressed") + ext,
          keptOriginal,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not compress that image.");
      } finally {
        setBusy(false);
      }
    },
    [quality, result],
  );

  const onFile = (files: FileList | null) => {
    const file = files?.[0];
    if (file) compress(file);
  };

  const formatBytes = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)}KB` : `${(bytes / 1024 / 1024).toFixed(2)}MB`;

  const savings = result
    ? Math.max(0, Math.round((1 - result.compressedBytes / result.originalBytes) * 100))
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFile(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={
          "flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-6 py-14 text-center transition-colors " +
          (dragOver ? "border-signal bg-[#141110]" : "border-hairline bg-ink-raised hover:border-hairline-hover")
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files)}
        />
        <span className="text-[13px] font-bold text-bone">Drop an image here, or click to choose one</span>
        <span className="text-[11.5px] text-grey">JPG, PNG or WebP — processed on your device, never uploaded</span>
      </div>

      <label className="flex flex-col gap-2.5">
        <span className="flex items-center justify-between text-[10.5px] tracking-[0.14em] text-grey">
          <span>QUALITY</span>
          <span className="text-signal">{Math.round(quality * 100)}%</span>
        </span>
        <input
          type="range"
          min={0.2}
          max={0.95}
          step={0.01}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-signal"
        />
      </label>

      {busy && <div className="flex items-center gap-2.5 text-[12.5px] text-grey">
        <span className="sl-spinner" />
        Compressing…
      </div>}

      {error && (
        <div className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
          {error}
        </div>
      )}

      {result && !busy && (
        <div className="flex flex-col gap-2.5 border border-hairline bg-ink-raised px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-[12.5px] text-bone-dim">
              <span>{formatBytes(result.originalBytes)} → {formatBytes(result.compressedBytes)}</span>
              {!result.keptOriginal && savings > 0 && <span className="text-signal">{savings}% smaller</span>}
            </div>
            <a
              href={result.url}
              download={result.fileName}
              className="sl-cta-primary rounded-[2px] bg-signal px-5 py-2.5 text-[12px] font-bold tracking-[0.06em] text-ink"
            >
              DOWNLOAD →
            </a>
          </div>
          {result.keptOriginal && (
            <p className="m-0 text-[11.5px] leading-[1.6] text-grey">
              This image is already well optimized — re-encoding it made it larger, so here&rsquo;s the original
              file unchanged.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
