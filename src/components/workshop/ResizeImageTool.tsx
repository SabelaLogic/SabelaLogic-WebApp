"use client";

import { useState } from "react";
import { IMAGE_EXT, baseName, canEncode, canvasToBlob, drawToCanvas, loadImage, revokeAll } from "@/lib/workshop/files";
import { BatchImageResults, type ImageResult } from "./BatchImageResults";
import { Busy, DropZone, ErrorNote, Label, Segmented, fieldClass } from "./ui";

type Mode = "pixels" | "percent" | "preset";
type OutFormat = "same" | "image/jpeg" | "image/png" | "image/webp";

const PRESETS = [
  { id: "ig-square", label: "Instagram post · 1080×1080", w: 1080, h: 1080 },
  { id: "ig-story", label: "Story / Reel · 1080×1920", w: 1080, h: 1920 },
  { id: "fb-cover", label: "Facebook cover · 851×315", w: 851, h: 315 },
  { id: "li-banner", label: "LinkedIn banner · 1584×396", w: 1584, h: 396 },
  { id: "yt-thumb", label: "YouTube thumbnail · 1280×720", w: 1280, h: 720 },
  { id: "x-header", label: "X header · 1500×500", w: 1500, h: 500 },
  { id: "hd", label: "Full HD · 1920×1080", w: 1920, h: 1080 },
  { id: "passport", label: "Passport photo 35×45mm · 413×531", w: 413, h: 531 },
];

export function ResizeImageTool() {
  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [percent, setPercent] = useState(50);
  const [preset, setPreset] = useState(PRESETS[0].id);
  const [fit, setFit] = useState<"cover" | "contain">("cover");
  const [format, setFormat] = useState<OutFormat>("same");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const targetSize = (w0: number, h0: number): { w: number; h: number; box?: { w: number; h: number } } => {
    if (mode === "percent") return { w: (w0 * percent) / 100, h: (h0 * percent) / 100 };
    if (mode === "preset") {
      const p = PRESETS.find((x) => x.id === preset)!;
      return { w: p.w, h: p.h, box: { w: p.w, h: p.h } };
    }
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w && !h) throw new Error("Enter a width, a height, or both.");
    if (keepRatio || !w || !h) {
      if (w && h) {
        const s = Math.min(w / w0, h / h0);
        return { w: w0 * s, h: h0 * s };
      }
      return w ? { w, h: (h0 * w) / w0 } : { w: (w0 * h) / h0, h };
    }
    return { w, h };
  };

  const run = async (files: File[]) => {
    setError("");
    setResults(revokeAll);
    const out: ImageResult[] = [];
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(`Resizing ${i + 1} of ${files.length}…`);
      try {
        const bmp = await loadImage(file);
        const { w, h, box } = targetSize(bmp.width, bmp.height);
        if (w > 12000 || h > 12000) throw new Error("too large");
        let type: string = format === "same" ? (["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/png") : format;
        if (type === "image/webp" && !canEncode("image/webp")) type = "image/png";
        let canvas: HTMLCanvasElement;
        if (box) {
          // Fit into an exact frame: "cover" crops to fill, "contain" pads to fit.
          canvas = document.createElement("canvas");
          canvas.width = box.w;
          canvas.height = box.h;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingQuality = "high";
          const s = fit === "cover" ? Math.max(box.w / bmp.width, box.h / bmp.height) : Math.min(box.w / bmp.width, box.h / bmp.height);
          const dw = bmp.width * s;
          const dh = bmp.height * s;
          if (fit === "contain" || type === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, box.w, box.h);
          }
          ctx.drawImage(bmp, (box.w - dw) / 2, (box.h - dh) / 2, dw, dh);
        } else {
          canvas = drawToCanvas(bmp, w, h, type === "image/jpeg" ? "#ffffff" : undefined);
        }
        bmp.close();
        const blob = await canvasToBlob(canvas, type, type === "image/png" ? undefined : 0.9);
        out.push({
          name: `${baseName(file.name)}-${canvas.width}x${canvas.height}.${IMAGE_EXT[type]}`,
          blob,
          url: URL.createObjectURL(blob),
          originalBytes: file.size,
          note: `${canvas.width}×${canvas.height}px`,
        });
      } catch (err) {
        if (err instanceof Error && err.message.startsWith("Enter")) {
          setError(err.message);
          setBusy("");
          return;
        }
        failed.push(file.name);
      }
    }
    setResults(out);
    if (failed.length) setError(`Couldn't resize: ${failed.join(", ")}. Check it's a JPG, PNG or WebP under 12,000px.`);
    setBusy("");
  };

  return (
    <div className="flex flex-col gap-5">
      <Segmented<Mode>
        label="Resize mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "pixels", label: "By pixels" },
          { value: "percent", label: "By percentage" },
          { value: "preset", label: "Social & photo presets" },
        ]}
      />
      {mode === "pixels" && (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex w-[140px] flex-col gap-2">
            <Label>WIDTH (PX)</Label>
            <input inputMode="numeric" value={width} onChange={(e) => setWidth(e.target.value.replace(/\D/g, ""))} className={fieldClass} placeholder="auto" />
          </label>
          <label className="flex w-[140px] flex-col gap-2">
            <Label>HEIGHT (PX)</Label>
            <input inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))} className={fieldClass} placeholder="auto" />
          </label>
          <label className="flex items-center gap-2 pb-2.5 text-[12px] text-bone-dim">
            <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-signal" />
            Keep aspect ratio
          </label>
        </div>
      )}
      {mode === "percent" && (
        <label className="flex flex-col gap-2.5">
          <Label aside={`${percent}%`}>SCALE</Label>
          <input type="range" min={5} max={200} step={5} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full accent-signal" />
        </label>
      )}
      {mode === "preset" && (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <Label>PRESET</Label>
            <select value={preset} onChange={(e) => setPreset(e.target.value)} className={fieldClass}>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </label>
          <Segmented<"cover" | "contain">
            label="Fit"
            value={fit}
            onChange={setFit}
            options={[
              { value: "cover", label: "Fill frame (crop edges)" },
              { value: "contain", label: "Fit inside (white bars)" },
            ]}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label>OUTPUT FORMAT</Label>
        <Segmented<OutFormat>
          label="Output format"
          value={format}
          onChange={setFormat}
          options={[
            { value: "same", label: "Same as original" },
            { value: "image/jpeg", label: "JPG" },
            { value: "image/png", label: "PNG" },
            { value: "image/webp", label: "WebP" },
          ]}
        />
      </div>
      <DropZone accept="image/*" multiple onFiles={run} title="Drop images here, or click to choose" hint="Batch resize on your device. Images are never uploaded." />
      <ErrorNote>{error}</ErrorNote>
      {busy && <Busy>{busy}</Busy>}
      {!busy && <BatchImageResults tool="resize-image" results={results} zipName="resized-images.zip" />}
    </div>
  );
}
