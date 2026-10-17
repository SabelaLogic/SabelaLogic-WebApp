"use client";

import { useState } from "react";
import { baseName, canEncode, canvasToBlob, drawToCanvas, formatBytes, loadImage, revokeAll } from "@/lib/workshop/files";
import { BatchImageResults, type ImageResult } from "./BatchImageResults";
import { Busy, DropZone, ErrorNote, Label, Segmented, fieldClass } from "./ui";

const SIZES = ["20", "50", "100", "200", "500"] as const;

/**
 * Finds the highest JPEG/WebP quality that fits under the target, and only
 * shrinks the pixel dimensions if even low quality can't get there.
 */
async function fitUnder(bmp: ImageBitmap, targetBytes: number, type: string): Promise<{ blob: Blob; w: number; h: number; q: number }> {
  let scale = 1;
  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = drawToCanvas(bmp, bmp.width * scale, bmp.height * scale, type === "image/jpeg" ? "#ffffff" : undefined);
    let lo = 0.3;
    let hi = 0.95;
    let best: Blob | null = null;
    let bestQ = lo;
    const floor = await canvasToBlob(canvas, type, lo);
    if (floor.size <= targetBytes) {
      best = floor;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const b = await canvasToBlob(canvas, type, mid);
        if (b.size <= targetBytes) {
          best = b;
          bestQ = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return { blob: best, w: canvas.width, h: canvas.height, q: bestQ };
    }
    // Still too big at low quality: shrink dimensions roughly in proportion and retry.
    scale *= Math.max(0.5, Math.min(0.9, Math.sqrt(targetBytes / floor.size) * 0.95));
  }
  throw new Error("Couldn't get that image under the target size.");
}

export function CompressToKbTool() {
  const [preset, setPreset] = useState<string>("100");
  const [custom, setCustom] = useState("");
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const targetKb = preset === "custom" ? parseInt(custom, 10) : parseInt(preset, 10);

  const run = async (files: File[]) => {
    setError("");
    setResults(revokeAll);
    if (!targetKb || targetKb < 5) {
      setError("Enter a target of at least 5 KB.");
      return;
    }
    const type = format === "image/webp" && canEncode("image/webp") ? "image/webp" : "image/jpeg";
    const target = targetKb * 1024;
    const out: ImageResult[] = [];
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(`Compressing ${i + 1} of ${files.length} to under ${targetKb} KB…`);
      try {
        if (file.size <= target && (file.type === type)) {
          out.push({ name: file.name, blob: file, url: URL.createObjectURL(file), originalBytes: file.size, note: "already under target, unchanged" });
          continue;
        }
        const bmp = await loadImage(file);
        const ow = bmp.width;
        const r = await fitUnder(bmp, target, type);
        bmp.close();
        out.push({
          name: `${baseName(file.name)}-${targetKb}kb.${type === "image/webp" ? "webp" : "jpg"}`,
          blob: r.blob,
          url: URL.createObjectURL(r.blob),
          originalBytes: file.size,
          note: `${r.w}×${r.h}px${r.w < ow ? " (resized to fit)" : ""} · quality ${Math.round(r.q * 100)}%`,
        });
      } catch {
        failed.push(file.name);
      }
    }
    setResults(out);
    if (failed.length) setError(`Couldn't compress: ${failed.join(", ")}.`);
    setBusy("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label aside={targetKb ? `≤ ${formatBytes(targetKb * 1024)}` : undefined}>TARGET SIZE</Label>
        <Segmented<string>
          label="Target size"
          value={preset}
          onChange={setPreset}
          options={[...SIZES.map((s) => ({ value: s, label: `${s} KB` })), { value: "custom", label: "Custom" }]}
        />
        {preset === "custom" && (
          <input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} placeholder="Size in KB, e.g. 30" className={`${fieldClass} max-w-[220px]`} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>OUTPUT</Label>
        <Segmented<"image/jpeg" | "image/webp">
          label="Output format"
          value={format}
          onChange={setFormat}
          options={[
            { value: "image/jpeg", label: "JPG (accepted everywhere)" },
            { value: "image/webp", label: "WebP (smaller)" },
          ]}
        />
      </div>
      <DropZone accept="image/*" multiple onFiles={run} title="Drop images here, or click to choose" hint="Compressed on your device to fit upload limits. Never uploaded." />
      <ErrorNote>{error}</ErrorNote>
      {busy && <Busy>{busy}</Busy>}
      {!busy && <BatchImageResults tool="compress-image-to-kb" results={results} zipName={`images-under-${targetKb}kb.zip`} />}
    </div>
  );
}
