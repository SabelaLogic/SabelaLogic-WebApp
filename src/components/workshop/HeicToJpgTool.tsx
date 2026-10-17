"use client";

import { useState } from "react";
import { getHeic2Any } from "@/lib/workshop/vendor";
import { baseName, revokeAll } from "@/lib/workshop/files";
import { BatchImageResults, type ImageResult } from "./BatchImageResults";
import { Busy, DropZone, ErrorNote, Label, Segmented } from "./ui";

type Target = "image/jpeg" | "image/png";

export function HeicToJpgTool() {
  const [target, setTarget] = useState<Target>("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const convert = async (files: File[]) => {
    setError("");
    const heics = files.filter((f) => /\.(heic|heif)$/i.test(f.name) || /image\/hei[cf]/.test(f.type));
    if (!heics.length) {
      setError("Those don't look like HEIC/HEIF files. iPhone photos usually end in .HEIC.");
      return;
    }
    setResults(revokeAll);
    const out: ImageResult[] = [];
    const failed: string[] = [];
    try {
      setBusy("Loading converter…");
      const heic2any = await getHeic2Any();
      for (const [i, file] of heics.entries()) {
        setBusy(`Converting ${i + 1} of ${heics.length}: ${file.name}`);
        try {
          const res = await heic2any({ blob: file, toType: target, quality });
          const blob = Array.isArray(res) ? res[0] : res;
          const ext = target === "image/png" ? "png" : "jpg";
          out.push({ name: `${baseName(file.name)}.${ext}`, blob, url: URL.createObjectURL(blob), originalBytes: file.size });
        } catch {
          failed.push(file.name);
        }
      }
      setResults(out);
      if (failed.length) setError(`Couldn't convert: ${failed.join(", ")}. The file may be damaged or use an unsupported HEIC variant.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>CONVERT TO</Label>
        <Segmented<Target> label="Output format" value={target} onChange={setTarget} options={[{ value: "image/jpeg", label: "JPG (smaller)" }, { value: "image/png", label: "PNG (lossless)" }]} />
      </div>
      {target === "image/jpeg" && (
        <label className="flex flex-col gap-2.5">
          <Label aside={`${Math.round(quality * 100)}%`}>JPG QUALITY</Label>
          <input type="range" min={0.5} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-signal" />
        </label>
      )}
      <DropZone
        accept=".heic,.heif,image/heic,image/heif"
        multiple
        onFiles={convert}
        title="Drop HEIC photos here, or click to choose"
        hint="Batch conversion on your device. Photos are never uploaded."
      />
      <ErrorNote>{error}</ErrorNote>
      {busy && <Busy>{busy}</Busy>}
      {!busy && <BatchImageResults tool="heic-to-jpg" results={results} zipName="converted-photos.zip" />}
    </div>
  );
}
