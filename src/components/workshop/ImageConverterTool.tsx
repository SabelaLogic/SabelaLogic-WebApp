"use client";

import { useState } from "react";
import { IMAGE_EXT, baseName, canEncode, canvasToBlob, drawToCanvas, loadImage, revokeAll } from "@/lib/workshop/files";
import { BatchImageResults, type ImageResult } from "./BatchImageResults";
import { Busy, DropZone, ErrorNote, Label, Segmented } from "./ui";

type Target = "image/jpeg" | "image/png" | "image/webp";

export function ImageConverterTool() {
  const [target, setTarget] = useState<Target>("image/png");
  const [quality, setQuality] = useState(0.9);
  const [background, setBackground] = useState("#ffffff");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const convert = async (files: File[]) => {
    setError("");
    setResults(revokeAll);
    if (target === "image/webp" && !canEncode("image/webp")) {
      setError("This browser can't create WebP files. Try Chrome, Edge or Firefox, or pick PNG/JPG.");
      return;
    }
    const out: ImageResult[] = [];
    const failed: string[] = [];
    for (const [i, file] of files.entries()) {
      setBusy(`Converting ${i + 1} of ${files.length}…`);
      try {
        const bmp = await loadImage(file);
        const canvas = drawToCanvas(bmp, bmp.width, bmp.height, target === "image/jpeg" ? background : undefined);
        bmp.close();
        const blob = await canvasToBlob(canvas, target, target === "image/png" ? undefined : quality);
        out.push({ name: `${baseName(file.name)}.${IMAGE_EXT[target]}`, blob, url: URL.createObjectURL(blob), originalBytes: file.size });
      } catch {
        failed.push(file.name);
      }
    }
    setResults(out);
    if (failed.length) setError(`Couldn't read: ${failed.join(", ")}. For iPhone HEIC photos, use the HEIC to JPG tool.`);
    setBusy("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>CONVERT TO</Label>
        <Segmented<Target>
          label="Output format"
          value={target}
          onChange={setTarget}
          options={[
            { value: "image/png", label: "PNG" },
            { value: "image/jpeg", label: "JPG" },
            { value: "image/webp", label: "WebP" },
          ]}
        />
      </div>
      {target !== "image/png" && (
        <label className="flex flex-col gap-2.5">
          <Label aside={`${Math.round(quality * 100)}%`}>QUALITY</Label>
          <input type="range" min={0.4} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-signal" />
        </label>
      )}
      {target === "image/jpeg" && (
        <label className="flex items-center gap-3 text-[12px] text-bone-dim">
          <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-8 w-10 cursor-pointer border border-hairline bg-transparent" />
          Background for transparent areas (JPG has no transparency)
        </label>
      )}
      <DropZone
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif,image/svg+xml"
        multiple
        onFiles={convert}
        title="Drop images here, or click to choose"
        hint="JPG, PNG, WebP, GIF, BMP, AVIF in. Converted on your device, never uploaded."
      />
      <ErrorNote>{error}</ErrorNote>
      {busy && <Busy>{busy}</Busy>}
      {!busy && <BatchImageResults tool="image-converter" results={results} zipName="converted-images.zip" />}
    </div>
  );
}
