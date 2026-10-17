"use client";

import { useState } from "react";
import { CopyButton, Label, btnSecondary, textareaClass } from "./ui";

const SMALL_WORDS = new Set("a an and as at but by for if in nor of on or so the to up yet vs via".split(" "));

function words(s: string): string[] {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-./\\]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const CONVERSIONS: { id: string; label: string; fn: (s: string) => string }[] = [
  { id: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { id: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    id: "title",
    label: "Title Case",
    fn: (s) =>
      s.toLowerCase().replace(/[\p{L}\p{N}']+/gu, (w, offset: number) =>
        offset > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
      ),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s) => s.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toUpperCase()),
  },
  { id: "camel", label: "camelCase", fn: (s) => words(s).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join("") },
  { id: "pascal", label: "PascalCase", fn: (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") },
  { id: "snake", label: "snake_case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("_") },
  { id: "kebab", label: "kebab-case", fn: (s) => words(s).map((w) => w.toLowerCase()).join("-") },
  { id: "constant", label: "CONSTANT_CASE", fn: (s) => words(s).map((w) => w.toUpperCase()).join("_") },
  { id: "alternating", label: "aLtErNaTiNg", fn: (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("") },
  { id: "inverse", label: "iNVERSE", fn: (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join("") },
];

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const [last, setLast] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <label className="flex flex-col gap-2.5">
        <Label aside={text ? `${text.length} characters` : undefined}>YOUR TEXT</Label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste or type text, then pick a case below." className={textareaClass} />
      </label>
      <div className="flex flex-wrap gap-2">
        {CONVERSIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={!text}
            onClick={() => {
              setText(c.fn(text));
              setLast(c.label);
            }}
            className={btnSecondary + " !px-3.5 !py-2"}
          >
            {c.label}
          </button>
        ))}
      </div>
      {text && (
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton text={text} label="COPY TEXT" />
          {last && <span className="text-[11.5px] text-grey">Converted to {last}</span>}
        </div>
      )}
    </div>
  );
}
