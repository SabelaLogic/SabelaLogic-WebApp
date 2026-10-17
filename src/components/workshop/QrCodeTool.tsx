"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getQrCode, type QrCodeFactory } from "@/lib/workshop/vendor";
import { canvasToBlob, triggerDownload } from "@/lib/workshop/files";
import { ErrorNote, ExportButton, Label, Segmented, fieldClass, textareaClass } from "./ui";

type Kind = "url" | "wifi" | "whatsapp" | "email";
type Ecc = "L" | "M" | "Q" | "H";

// Wi-Fi QR payloads need \ ; , : " escaped.
const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function QrCodeTool() {
  const [kind, setKind] = useState<Kind>("url");
  const [text, setText] = useState("https://");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [security, setSecurity] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);
  const [phone, setPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [ecc, setEcc] = useState<Ecc>("M");
  const [size, setSize] = useState(1024);
  const [factory, setFactory] = useState<QrCodeFactory | null>(null);
  const [loadError, setLoadError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getQrCode().then((f) => setFactory(() => f), () => setLoadError("The QR generator failed to load. Check your connection and refresh."));
  }, []);

  const payload = useMemo(() => {
    switch (kind) {
      case "url":
        return text.trim() === "https://" ? "" : text.trim();
      case "wifi":
        return ssid ? `WIFI:T:${security};S:${wifiEscape(ssid)};${security !== "nopass" ? `P:${wifiEscape(wifiPass)};` : ""}${hidden ? "H:true;" : ""};` : "";
      case "whatsapp": {
        const digits = phone.replace(/\D/g, "");
        return digits ? `https://wa.me/${digits}${waMsg ? `?text=${encodeURIComponent(waMsg)}` : ""}` : "";
      }
      case "email":
        return email ? `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}` : "";
    }
  }, [kind, text, ssid, wifiPass, security, hidden, phone, waMsg, email, subject]);

  const { matrix, error } = useMemo(() => {
    if (!factory || !payload) return { matrix: null as boolean[][] | null, error: "" };
    try {
      const qr = factory(0, ecc);
      qr.addData(payload, "Byte");
      qr.make();
      const n = qr.getModuleCount();
      const m: boolean[][] = [];
      for (let r = 0; r < n; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < n; c++) row.push(qr.isDark(r, c));
        m.push(row);
      }
      return { matrix: m, error: "" };
    } catch {
      return { matrix: null, error: "That's too much data for one QR code. Shorten the text or lower the error correction." };
    }
  }, [factory, payload, ecc]);

  const draw = (canvas: HTMLCanvasElement, px: number) => {
    if (!matrix) return;
    const quiet = 4; // the standard 4-module quiet zone scanners need
    const n = matrix.length + quiet * 2;
    const cell = Math.max(1, Math.ceil(px / n)); // whole-pixel modules keep edges crisp
    canvas.width = canvas.height = cell * n;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fg;
    matrix.forEach((row, r) => row.forEach((dark, c) => dark && ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell)));
  };

  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, 320);
  });

  const svg = () => {
    if (!matrix) return "";
    const quiet = 4;
    const n = matrix.length + quiet * 2;
    let d = "";
    matrix.forEach((row, r) => row.forEach((dark, c) => dark && (d += `M${c + quiet} ${r + quiet}h1v1h-1z`)));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`;
  };

  const contrast = (Math.max(luminance(fg), luminance(bg)) + 0.05) / (Math.min(luminance(fg), luminance(bg)) + 0.05);
  const inverted = luminance(fg) > luminance(bg);

  return (
    <div className="flex flex-col gap-5">
      <Segmented<Kind>
        label="QR code type"
        value={kind}
        onChange={setKind}
        options={[
          { value: "url", label: "URL / Text" },
          { value: "wifi", label: "Wi-Fi" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "email", label: "Email" },
        ]}
      />
      {kind === "url" && (
        <label className="flex flex-col gap-2">
          <Label>LINK OR TEXT</Label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className={textareaClass} spellCheck={false} />
        </label>
      )}
      {kind === "wifi" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2"><Label>NETWORK NAME (SSID)</Label><input value={ssid} onChange={(e) => setSsid(e.target.value)} className={fieldClass} /></label>
          <label className="flex flex-col gap-2"><Label>PASSWORD</Label><input value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className={fieldClass} disabled={security === "nopass"} /></label>
          <label className="flex flex-col gap-2">
            <Label>SECURITY</Label>
            <select value={security} onChange={(e) => setSecurity(e.target.value as typeof security)} className={fieldClass}>
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None (open network)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-2.5 text-[12px] text-bone-dim">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="accent-signal" /> Hidden network
          </label>
        </div>
      )}
      {kind === "whatsapp" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2"><Label>PHONE (WITH COUNTRY CODE)</Label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 900123" className={fieldClass} inputMode="tel" /></label>
          <label className="flex flex-col gap-2"><Label>PRE-FILLED MESSAGE (OPTIONAL)</Label><input value={waMsg} onChange={(e) => setWaMsg(e.target.value)} className={fieldClass} /></label>
        </div>
      )}
      {kind === "email" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2"><Label>EMAIL ADDRESS</Label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} /></label>
          <label className="flex flex-col gap-2"><Label>SUBJECT (OPTIONAL)</Label><input value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass} /></label>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-5">
        <label className="flex items-center gap-2 text-[12px] text-bone-dim"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-8 w-10 cursor-pointer border border-hairline bg-transparent" /> Foreground</label>
        <label className="flex items-center gap-2 text-[12px] text-bone-dim"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-10 cursor-pointer border border-hairline bg-transparent" /> Background</label>
        <label className="flex flex-col gap-2">
          <Label>ERROR CORRECTION</Label>
          <select value={ecc} onChange={(e) => setEcc(e.target.value as Ecc)} className={fieldClass}>
            <option value="L">Low (7%) · smallest</option>
            <option value="M">Medium (15%) · recommended</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%) · for print/outdoor</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <Label>PNG SIZE (APPROX.)</Label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={fieldClass}>
            {[512, 1024, 2048, 4096].map((s) => <option key={s} value={s}>{s}px</option>)}
          </select>
        </label>
      </div>

      <ErrorNote>{loadError || error}</ErrorNote>
      {(contrast < 3 || inverted) && matrix && (
        <ErrorNote>
          {inverted ? "Light-on-dark QR codes don't scan on many phones. Keep the foreground darker than the background." : "Low contrast between the colours may make this hard to scan."}
        </ErrorNote>
      )}

      <div className="flex flex-wrap items-center gap-6 border border-hairline bg-ink-raised p-5">
        <div className="flex h-[200px] w-[200px] items-center justify-center bg-[#1a1918]">
          {matrix ? <canvas ref={canvasRef} className="h-[200px] w-[200px]" aria-label="QR code preview" role="img" /> : <span className="px-4 text-center text-[11.5px] text-grey">Your QR code appears here</span>}
        </div>
        <div className="flex flex-col gap-3">
          <ExportButton
            action={{ tool: "qr-code-generator", action: "download-png" }}
            disabled={!matrix}
            onExport={async () => {
              const c = document.createElement("canvas");
              draw(c, size);
              triggerDownload(await canvasToBlob(c, "image/png"), "qr-code.png");
            }}
          >
            DOWNLOAD PNG →
          </ExportButton>
          <ExportButton
            variant="secondary"
            action={{ tool: "qr-code-generator", action: "download-svg" }}
            disabled={!matrix}
            onExport={() => triggerDownload(new Blob([svg()], { type: "image/svg+xml" }), "qr-code.svg")}
          >
            DOWNLOAD SVG (VECTOR)
          </ExportButton>
          <span className="max-w-[34ch] text-[11px] leading-[1.6] text-grey">Static QR codes never expire. Always test-scan before you print.</span>
        </div>
      </div>
    </div>
  );
}
