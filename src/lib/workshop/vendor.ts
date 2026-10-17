"use client";

/**
 * Lazy loaders for the heavy client-side libraries the Workshop tools use.
 *
 * The libraries are vendored, unmodified, under public/vendor/ (versions and
 * licences in public/vendor/README.md) and only fetched when someone actually
 * drops a file in, so they never weigh down page load. They are served from
 * this site's own domain: no CDN, and nothing a user processes ever leaves
 * their device.
 */

// Bypass the bundler: these are plain ES modules fetched at runtime by URL.
function importUrl<T>(url: string): Promise<T> {
  return import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url) as Promise<T>;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-vendor="${src}"]`);
    if (existing?.dataset.loaded === "1") return resolve();
    const el = existing ?? document.createElement("script");
    el.addEventListener("load", () => {
      el.dataset.loaded = "1";
      resolve();
    });
    el.addEventListener("error", () => reject(new Error(`Could not load ${src}. Check your connection and retry.`)));
    if (!existing) {
      el.src = src;
      el.async = true;
      el.dataset.vendor = src;
      document.head.appendChild(el);
    }
  });
}

// ---- pdf-lib (create / merge / split PDFs) ---------------------------------

export interface PdfLibPage {
  getSize(): { width: number; height: number };
  getRotation(): { angle: number };
  setRotation(rotation: unknown): void;
}
export interface PdfLibDocument {
  getPageCount(): number;
  getPageIndices(): number[];
  copyPages(src: PdfLibDocument, indices: number[]): Promise<PdfLibPage[]>;
  addPage(page: PdfLibPage): PdfLibPage;
  save(): Promise<Uint8Array>;
}
export interface PdfLib {
  PDFDocument: {
    create(): Promise<PdfLibDocument>;
    load(bytes: ArrayBuffer | Uint8Array, opts?: { ignoreEncryption?: boolean }): Promise<PdfLibDocument>;
  };
}

let pdfLib: Promise<PdfLib> | null = null;
export function getPdfLib(): Promise<PdfLib> {
  pdfLib ??= importUrl<PdfLib>("/vendor/pdf-lib/pdf-lib.esm.min.js");
  return pdfLib;
}

// ---- pdf.js (render PDF pages to images) -----------------------------------

export interface PdfjsViewport {
  width: number;
  height: number;
}
export interface PdfjsPage {
  getViewport(opts: { scale: number }): PdfjsViewport;
  render(opts: { canvasContext: CanvasRenderingContext2D; viewport: PdfjsViewport }): { promise: Promise<void> };
  cleanup(): void;
}
export interface PdfjsDocument {
  numPages: number;
  getPage(n: number): Promise<PdfjsPage>;
  destroy(): Promise<void>;
}
export interface Pdfjs {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: { data: Uint8Array; isEvalSupported?: boolean }): { promise: Promise<PdfjsDocument> };
}

let pdfjs: Promise<Pdfjs> | null = null;
export function getPdfjs(): Promise<Pdfjs> {
  pdfjs ??= importUrl<Pdfjs>("/vendor/pdfjs/pdf.min.mjs").then((mod) => {
    mod.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs";
    return mod;
  });
  return pdfjs;
}

// ---- heic2any (HEIC/HEIF → JPG/PNG) ----------------------------------------

export type Heic2Any = (opts: {
  blob: Blob;
  toType?: "image/jpeg" | "image/png";
  quality?: number;
  multiple?: boolean;
}) => Promise<Blob | Blob[]>;

let heic: Promise<Heic2Any> | null = null;
export function getHeic2Any(): Promise<Heic2Any> {
  heic ??= loadScript("/vendor/heic2any/heic2any.min.js").then(() => {
    const fn = (window as unknown as { heic2any?: Heic2Any }).heic2any;
    if (!fn) throw new Error("HEIC converter failed to load.");
    return fn;
  });
  return heic;
}

// ---- qrcode-generator -------------------------------------------------------

export interface QrCode {
  addData(data: string, mode?: string): void;
  make(): void;
  getModuleCount(): number;
  isDark(row: number, col: number): boolean;
}
export interface QrCodeFactory {
  (typeNumber: number, errorCorrectionLevel: "L" | "M" | "Q" | "H"): QrCode;
  stringToBytes: (s: string) => number[];
}

let qr: Promise<QrCodeFactory> | null = null;
export function getQrCode(): Promise<QrCodeFactory> {
  qr ??= importUrl<{ default: QrCodeFactory }>("/vendor/qrcode/qrcode.mjs").then((mod) => {
    const factory = mod.default;
    // Encode as UTF-8 so accents, emoji and non-Latin scripts scan correctly.
    // The library reads factory.stringToBytes at encode time, so swapping it is supported.
    factory.stringToBytes = (s: string) => Array.from(new TextEncoder().encode(s));
    return factory;
  });
  return qr;
}
