"use client";

import { useState } from "react";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = (mode: "format" | "minify") => {
    setCopied(false);
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "That isn't valid JSON.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2.5">
        <span className="text-[10.5px] tracking-[0.14em] text-grey">PASTE JSON</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder='{"example": true, "nested": {"value": 1}}'
          spellCheck={false}
          className="sl-field w-full resize-y rounded-[2px] border border-hairline bg-ink-raised px-4 py-3.5 font-mono text-[13px] leading-[1.6] text-bone outline-none"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => run("format")}
          className="sl-cta-primary rounded-[2px] bg-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-ink"
        >
          FORMAT
        </button>
        <button
          onClick={() => run("minify")}
          className="sl-btn-outline rounded-[2px] border border-[#332f2d] px-5 py-3 text-[12px] text-bone"
        >
          MINIFY
        </button>
        {output && (
          <button
            onClick={copy}
            className="rounded-[2px] border border-hairline px-5 py-3 text-[12px] text-grey hover:border-hairline-hover hover:text-bone"
          >
            {copied ? "COPIED ✓" : "COPY OUTPUT"}
          </button>
        )}
      </div>
      {error && (
        <div className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
          {error}
        </div>
      )}
      {output && (
        <pre className="m-0 max-h-[420px] overflow-auto border border-hairline bg-ink-raised p-4 text-[12.5px] leading-[1.7] text-bone-bright">
          {output}
        </pre>
      )}
    </div>
  );
}
