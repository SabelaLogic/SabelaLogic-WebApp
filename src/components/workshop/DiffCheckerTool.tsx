"use client";

import { useMemo, useState } from "react";
import { Label, Segmented, textareaClass } from "./ui";

type Op = { type: "same" | "add" | "del"; text: string };

/**
 * LCS diff over tokens (lines or words). Common leading/trailing tokens are
 * peeled off first, so typical edits to long documents stay fast.
 */
function diff(a: string[], b: string[]): Op[] {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const head: Op[] = a.slice(0, start).map((text) => ({ type: "same", text }));
  const tail: Op[] = a.slice(endA).map((text) => ({ type: "same", text }));
  const x = a.slice(start, endA);
  const y = b.slice(start, endB);
  const n = x.length;
  const m = y.length;
  if ((n + 1) * (m + 1) > 16_000_000) throw new Error("The changed sections are too long to compare in the browser. Try comparing a part at a time.");
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      ops.push({ type: "same", text: x[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push({ type: "del", text: x[i++] });
    else ops.push({ type: "add", text: y[j++] });
  }
  while (i < n) ops.push({ type: "del", text: x[i++] });
  while (j < m) ops.push({ type: "add", text: y[j++] });
  return [...head, ...ops, ...tail];
}

type Mode = "lines" | "words";

export function DiffCheckerTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<Mode>("lines");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreSpace, setIgnoreSpace] = useState(false);

  const result = useMemo(() => {
    if (!left && !right) return null;
    const norm = (s: string) => {
      let t = s;
      if (ignoreCase) t = t.toLowerCase();
      if (ignoreSpace) t = t.replace(/\s+/g, " ").trim();
      return t;
    };
    const split = (s: string) => (mode === "lines" ? s.split(/\r?\n/) : s.split(/(\s+)/).filter((t) => t !== ""));
    const a = split(left);
    const b = split(right);
    try {
      // Compare normalised tokens, but display the original text.
      const ops = diff(a.map(norm), b.map(norm));
      let ai = 0;
      let bi = 0;
      const shown = ops.map((op) => ({ type: op.type, text: op.type === "add" ? b[bi++] : op.type === "del" ? a[ai++] : (bi++, a[ai++]) }));
      const added = shown.filter((o) => o.type === "add" && o.text.trim()).length;
      const removed = shown.filter((o) => o.type === "del" && o.text.trim()).length;
      return { ops: shown, added, removed, error: "" };
    } catch (err) {
      return { ops: [], added: 0, removed: 0, error: err instanceof Error ? err.message : "Comparison failed." };
    }
  }, [left, right, mode, ignoreCase, ignoreSpace]);

  const unit = mode === "lines" ? "lines" : "words";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2.5">
          <Label>ORIGINAL TEXT</Label>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={10} className={textareaClass} spellCheck={false} />
        </label>
        <label className="flex flex-col gap-2.5">
          <Label>CHANGED TEXT</Label>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} rows={10} className={textareaClass} spellCheck={false} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Segmented<Mode> label="Compare by" value={mode} onChange={setMode} options={[{ value: "lines", label: "Line by line" }, { value: "words", label: "Word by word" }]} />
        <label className="flex items-center gap-2 text-[12px] text-bone-dim"><input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="accent-signal" /> Ignore case</label>
        <label className="flex items-center gap-2 text-[12px] text-bone-dim"><input type="checkbox" checked={ignoreSpace} onChange={(e) => setIgnoreSpace(e.target.checked)} className="accent-signal" /> Ignore extra whitespace</label>
      </div>
      {result?.error && <div role="alert" className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] text-[#f2c98b]">{result.error}</div>}
      {result && !result.error && (
        <div className="flex flex-col gap-2 border border-hairline bg-ink-raised">
          <div className="flex flex-wrap gap-4 border-b border-hairline px-4 py-2.5 text-[11.5px]">
            <span className="text-[#7fd49a]">+{result.added} {unit} added</span>
            <span className="text-[#f08a7e]">−{result.removed} {unit} removed</span>
            {result.added === 0 && result.removed === 0 && <span className="text-grey">The texts are identical{ignoreCase || ignoreSpace ? " (with your ignore settings)" : ""}.</span>}
          </div>
          <pre className={"m-0 max-h-[480px] overflow-auto px-4 pb-4 text-[12.5px] leading-[1.7] " + (mode === "words" ? "whitespace-pre-wrap" : "")}>
            {result.ops.map((op, k) =>
              mode === "lines" ? (
                <div key={k} className={op.type === "add" ? "bg-[#12291a] text-[#9fe3b4]" : op.type === "del" ? "bg-[#2e1513] text-[#f5a99f] line-through decoration-[#f5a99f]/40" : "text-bone-dim"}>
                  <span className="mr-3 inline-block w-3 select-none text-grey">{op.type === "add" ? "+" : op.type === "del" ? "−" : " "}</span>
                  {op.text || " "}
                </div>
              ) : (
                <span key={k} className={op.type === "add" ? "bg-[#12291a] text-[#9fe3b4]" : op.type === "del" ? "bg-[#2e1513] text-[#f5a99f] line-through" : "text-bone-dim"}>
                  {op.text}
                </span>
              ),
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
