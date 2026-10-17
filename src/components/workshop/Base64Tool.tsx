"use client";

import { useState } from "react";
import { formatBytes, triggerDownload } from "@/lib/workshop/files";
import { CopyButton, DropZone, ErrorNote, ExportButton, Label, Segmented, btnPrimary, btnSecondary, textareaClass } from "./ui";

type Mode = "text" | "file";

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(bin);
}

function base64ToBytes(input: string): Uint8Array {
  let s = input.trim().replace(/^data:[^,]*,/, "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (/[^A-Za-z0-9+/=]/.test(s)) throw new Error("That isn't valid Base64. It contains characters outside A–Z, a–z, 0–9, +, / and =.");
  s += "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const toUrlSafe = (s: string) => s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState("");
  const [fileOut, setFileOut] = useState<{ name: string; size: number; b64: string; type: string } | null>(null);
  const [decoded, setDecoded] = useState<Uint8Array | null>(null);

  const encode = () => {
    setError("");
    setDecoded(null);
    const b64 = bytesToBase64(new TextEncoder().encode(input));
    setOutput(urlSafe ? toUrlSafe(b64) : b64);
  };

  const decode = () => {
    setError("");
    try {
      const bytes = base64ToBytes(input);
      setDecoded(bytes);
      try {
        setOutput(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
      } catch {
        setOutput("");
        setError(`Decoded ${formatBytes(bytes.length)} of binary data (not text). Download it as a file below.`);
      }
    } catch (err) {
      setOutput("");
      setDecoded(null);
      setError(err instanceof Error ? err.message : "Couldn't decode that.");
    }
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    setError("");
    if (f.size > 25 * 1024 * 1024) {
      setError("That file is over 25 MB. Base64 makes it about a third bigger again, which is too much to handle comfortably in a browser tab.");
      return;
    }
    const b64 = bytesToBase64(new Uint8Array(await f.arrayBuffer()));
    setFileOut({ name: f.name, size: f.size, b64, type: f.type || "application/octet-stream" });
  };

  return (
    <div className="flex flex-col gap-5">
      <Segmented<Mode> label="Mode" value={mode} onChange={setMode} options={[{ value: "text", label: "Text ⇄ Base64" }, { value: "file", label: "File → Base64 / Data URI" }]} />
      {mode === "text" ? (
        <>
          <label className="flex flex-col gap-2.5">
            <Label>INPUT</Label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className={textareaClass} spellCheck={false} placeholder="Text to encode, or Base64 to decode" />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={encode} className={btnPrimary} disabled={!input}>ENCODE →</button>
            <button type="button" onClick={decode} className={btnSecondary} disabled={!input}>DECODE ←</button>
            <label className="flex items-center gap-2 text-[12px] text-bone-dim">
              <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} className="accent-signal" /> URL-safe (Base64URL)
            </label>
          </div>
          <ErrorNote>{error}</ErrorNote>
          {decoded && !output && (
            <div>
              <ExportButton action={{ tool: "base64", action: "download" }} onExport={() => triggerDownload(new Blob([decoded as Uint8Array<ArrayBuffer>]), "decoded.bin")}>
                DOWNLOAD DECODED FILE →
              </ExportButton>
            </div>
          )}
          {output && (
            <div className="flex flex-col gap-2.5">
              <Label aside={`${output.length} characters`}>OUTPUT</Label>
              <pre className="m-0 max-h-[320px] overflow-auto whitespace-pre-wrap break-all border border-hairline bg-ink-raised p-4 text-[12.5px] leading-[1.7] text-bone-bright">{output}</pre>
              <div><CopyButton text={output} label="COPY OUTPUT" /></div>
            </div>
          )}
        </>
      ) : (
        <>
          <DropZone accept="*/*" onFiles={onFile} title="Drop any file here, or click to choose" hint="Encoded on your device. The file is never uploaded." />
          <ErrorNote>{error}</ErrorNote>
          {fileOut && (
            <div className="flex flex-col gap-3 border border-hairline bg-ink-raised px-5 py-4">
              <span className="text-[12.5px] text-bone-dim">
                {fileOut.name} · {formatBytes(fileOut.size)} → {formatBytes(fileOut.b64.length)} as Base64
              </span>
              <pre className="m-0 max-h-[200px] overflow-auto whitespace-pre-wrap break-all text-[11.5px] leading-[1.6] text-bone-bright">
                {fileOut.b64.length > 20000 ? fileOut.b64.slice(0, 20000) + "…" : fileOut.b64}
              </pre>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={fileOut.b64} label="COPY BASE64" />
                <CopyButton text={`data:${fileOut.type};base64,${fileOut.b64}`} label="COPY AS DATA URI" />
                <ExportButton variant="secondary" action={{ tool: "base64", action: "download" }} onExport={() => triggerDownload(new Blob([fileOut.b64], { type: "text/plain" }), `${fileOut.name}.b64.txt`)}>
                  DOWNLOAD .TXT
                </ExportButton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
