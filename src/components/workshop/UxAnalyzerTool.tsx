"use client";

import { useState } from "react";
import { isValidEmail } from "@/lib/validation";

interface Finding {
  pillar: string;
  status: "good" | "warn" | "bad";
  message: string;
}

interface ScanResult {
  url: string;
  score: number;
  findings: Finding[];
}

const STATUS_COLOR: Record<Finding["status"], string> = {
  good: "#4ade80",
  warn: "#f2a93b",
  bad: "#e04a3a",
};

const STATUS_LABEL: Record<Finding["status"], string> = {
  good: "GOOD",
  warn: "CHECK",
  bad: "FIX",
};

const FREE_FINDINGS = 3;

export function UxAnalyzerTool() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [leadError, setLeadError] = useState("");

  const scan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanError("");
    setResult(null);
    setUnlocked(false);
    setScanning(true);
    try {
      const res = await fetch("/api/tools/ux-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not scan that URL.");
      setResult(data);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Could not scan that URL.");
    } finally {
      setScanning(false);
    }
  };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError("");
    if (!isValidEmail(email)) {
      setLeadError("Enter a valid email address.");
      return;
    }
    setUnlocking(true);
    try {
      await fetch("/api/tools/ux-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url: result?.url, score: result?.score }),
      });
    } catch {
      // still unlock — the scan already ran, no reason to block the visitor
    } finally {
      setUnlocking(false);
      setUnlocked(true);
    }
  };

  const scoreColor = result ? (result.score >= 80 ? "#4ade80" : result.score >= 55 ? "#f2a93b" : "#e04a3a") : undefined;
  const visibleFindings = result ? (unlocked ? result.findings : result.findings.slice(0, FREE_FINDINGS)) : [];
  const lockedCount = result ? result.findings.length - FREE_FINDINGS : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] items-center gap-6 border border-hairline bg-ink-raised p-5">
        <div>
          <div className="mb-2 text-[10.5px] tracking-[0.16em] text-signal">HOW THIS SCORE WORKS</div>
          <p className="m-0 text-[13px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
            A minute from Lunga on what the score actually measures, and why the free scan only shows part of
            the picture.
          </p>
        </div>
        <video
          controls
          preload="metadata"
          className="mx-auto aspect-[9/16] max-h-[320px] w-auto rounded-[2px] border border-hairline bg-ink"
        >
          <source src="/media/ux-analyzer-intro.mp4" type="video/mp4" />
        </video>
      </div>

      <form onSubmit={scan} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.co.za"
          className="sl-field flex-1 rounded-[2px] border border-hairline bg-ink-raised px-4 py-3.5 text-[13.5px] text-bone outline-none"
        />
        <button
          type="submit"
          disabled={scanning}
          className={
            "flex shrink-0 items-center justify-center gap-2.5 rounded-[2px] border border-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] " +
            (scanning ? "cursor-wait bg-[#241412] text-signal" : "cursor-pointer bg-signal text-ink")
          }
        >
          {scanning && <span className="sl-spinner" />}
          {scanning ? "SCANNING…" : "SCAN →"}
        </button>
      </form>

      {scanError && (
        <div className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
          {scanError}
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-5 border border-hairline bg-ink-raised p-[clamp(20px,3vw,32px)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-5">
            <div>
              <div className="mb-1.5 text-[10.5px] tracking-[0.16em] text-grey">STRUCTURAL SCORE</div>
              <div className="text-[11.5px] text-grey-darker">{result.url}</div>
            </div>
            <div className="font-display text-[clamp(40px,6vw,64px)] font-extrabold leading-none" style={{ color: scoreColor }}>
              {result.score}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {visibleFindings.map((f, i) => (
              <div key={i} className="flex items-start gap-3 text-[12.5px] leading-[1.6]">
                <span
                  className="mt-0.5 shrink-0 rounded-[2px] border px-[7px] py-[2px] text-[9.5px] font-bold tracking-[0.08em]"
                  style={{ color: STATUS_COLOR[f.status], borderColor: STATUS_COLOR[f.status] }}
                >
                  {STATUS_LABEL[f.status]}
                </span>
                <span className="text-bone-dim">
                  <span className="text-grey">{f.pillar} — </span>
                  {f.message}
                </span>
              </div>
            ))}
          </div>

          {!unlocked && lockedCount > 0 && (
            <div className="border-t border-hairline pt-5">
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.7] text-bone-dim">
                {lockedCount} more finding{lockedCount === 1 ? "" : "s"} in this scan — enter your email to see
                the rest.
              </p>
              <form onSubmit={unlock} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLeadError("");
                  }}
                  placeholder="you@company.co.za"
                  className="sl-field flex-1 rounded-[2px] border border-hairline bg-ink px-4 py-3 text-[13px] text-bone outline-none"
                />
                <button
                  type="submit"
                  disabled={unlocking}
                  className="sl-btn-outline shrink-0 rounded-[2px] border border-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-signal"
                >
                  {unlocking ? "UNLOCKING…" : "SEE FULL REPORT →"}
                </button>
              </form>
              {leadError && <p className="m-0 mt-2.5 text-[11.5px] text-[#f2c98b]">{leadError}</p>}
              <p className="m-0 mt-2.5 text-[11px] text-grey-darker">
                No spam — just the occasional note when something worth reading gets built.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
