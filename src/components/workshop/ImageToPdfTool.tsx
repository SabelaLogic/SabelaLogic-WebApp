"use client";

import { useRef, useState } from "react";

interface QueuedImage {
  file: File;
  previewUrl: string;
}

export function ImageToPdfTool() {
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    if (next.length === 0) {
      setError("Choose one or more image files.");
      return;
    }
    setError("");
    setImages((prev) => [...prev, ...next]);
  };

  const removeAt = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const loadImageEl = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read one of the images."));
      img.src = src;
    });

  const generate = async () => {
    if (images.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      let doc: InstanceType<typeof jsPDF> | null = null;

      for (const { previewUrl, file } of images) {
        const img = await loadImageEl(previewUrl);
        const orientation = img.width >= img.height ? "l" : "p";
        const widthMm = orientation === "l" ? 297 : 210;
        const heightMm = orientation === "l" ? 210 : 297;
        const scale = Math.min(widthMm / img.width, heightMm / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (widthMm - w) / 2;
        const y = (heightMm - h) / 2;

        if (!doc) {
          doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
        } else {
          doc.addPage("a4", orientation);
        }
        const format = file.type === "image/png" ? "PNG" : "JPEG";
        doc.addImage(img, format, x, y, w, h);
      }

      doc?.save("images.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-hairline bg-ink-raised px-6 py-14 text-center hover:border-hairline-hover"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <span className="text-[13px] font-bold text-bone">Click to choose images</span>
        <span className="text-[11.5px] text-grey">Add as many as you like — they&rsquo;ll appear as pages in order</span>
      </div>

      {error && (
        <div className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
          {images.map((img, i) => (
            <div key={img.previewUrl} className="group relative border border-hairline bg-ink-raised">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="" className="block h-[96px] w-full object-cover" />
              <button
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-[2px] bg-ink/80 text-[13px] text-bone hover:text-signal"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1.5 text-[10px] tracking-[0.06em] text-bone-bright">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generate}
        disabled={images.length === 0 || busy}
        className={
          "flex w-fit items-center gap-2.5 rounded-[2px] border border-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] " +
          (busy || images.length === 0 ? "cursor-not-allowed bg-[#241412] text-signal" : "cursor-pointer bg-signal text-ink")
        }
      >
        {busy && <span className="sl-spinner" />}
        {busy ? "BUILDING PDF…" : `GENERATE PDF (${images.length} page${images.length === 1 ? "" : "s"}) →`}
      </button>
    </div>
  );
}
