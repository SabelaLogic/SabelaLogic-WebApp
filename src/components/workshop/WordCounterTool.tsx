"use client";

import { useMemo, useState } from "react";

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s|$)/g) ?? []).length || (trimmed ? 1 : 0) : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0;
  const readingMinutes = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => countStats(text), [text]);

  const stat = (label: string, value: number | string) => (
    <div className="border border-hairline bg-ink-raised px-4 py-4">
      <div className="mb-1.5 font-display text-[clamp(20px,2.6vw,28px)] font-extrabold leading-none text-signal">
        {value}
      </div>
      <div className="text-[10.5px] tracking-[0.12em] text-grey">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste or type your text here…"
        className="sl-field w-full resize-y rounded-[2px] border border-hairline bg-ink-raised px-4 py-3.5 text-[13.5px] leading-[1.7] text-bone outline-none"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
        {stat("WORDS", stats.words)}
        {stat("CHARACTERS", stats.characters)}
        {stat("NO SPACES", stats.charactersNoSpaces)}
        {stat("SENTENCES", stats.sentences)}
        {stat("PARAGRAPHS", stats.paragraphs)}
        {stat("READ TIME", stats.readingMinutes ? `${stats.readingMinutes}m` : "—")}
      </div>
    </div>
  );
}
