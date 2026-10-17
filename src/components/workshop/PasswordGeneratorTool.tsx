"use client";

import { useCallback, useEffect, useState } from "react";
import { CopyButton, Label, Segmented, btnPrimary } from "./ui";

type Mode = "password" | "passphrase";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/~",
};
const AMBIGUOUS = /[O0oIl1|]/g;

// EFF large wordlist (7,776 words, CC BY 3.0 US, Electronic Frontier Foundation):
// each word adds log2(7776) ≈ 12.9 bits. Fetched once, only when passphrase mode is used.
let wordList: Promise<string[]> | null = null;
function getWordList(): Promise<string[]> {
  wordList ??= fetch("/vendor/eff/eff_large_wordlist.txt")
    .then((r) => {
      if (!r.ok) throw new Error("Word list failed to load.");
      return r.text();
    })
    .then((txt) => txt.split("\n").map((w) => w.trim()).filter(Boolean))
    .catch((err) => {
      wordList = null;
      throw err;
    });
  return wordList;
}

function secureIndex(max: number): number {
  // Rejection sampling avoids modulo bias.
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % max;
}

export function PasswordGeneratorTool() {
  const [mode, setMode] = useState<Mode>("password");
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true, noAmbiguous: false });
  const [words, setWords] = useState(6);
  const [list, setList] = useState<string[] | null>(null);
  const [listError, setListError] = useState("");
  const [sep, setSep] = useState("-");
  const [capitalize, setCapitalize] = useState(true);
  const [value, setValue] = useState("");
  const [bits, setBits] = useState(0);

  const generate = useCallback(() => {
    if (mode === "password") {
      const active = (Object.keys(SETS) as (keyof typeof SETS)[]).filter((k) => opts[k]);
      if (!active.length) {
        setValue("");
        setBits(0);
        return;
      }
      const clean = (s: string) => (opts.noAmbiguous ? s.replace(AMBIGUOUS, "") : s);
      const pools = active.map((k) => clean(SETS[k]));
      const all = pools.join("");
      // Guarantee at least one character from each chosen set, then shuffle.
      const chars = pools.map((p) => p[secureIndex(p.length)]);
      while (chars.length < length) chars.push(all[secureIndex(all.length)]);
      for (let i = chars.length - 1; i > 0; i--) {
        const j = secureIndex(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      setValue(chars.slice(0, length).join(""));
      setBits(Math.round(length * Math.log2(all.length)));
    } else {
      if (!list) {
        setValue("");
        setBits(0);
        return;
      }
      const picked = Array.from({ length: words }, () => list[secureIndex(list.length)]).map((w) => (capitalize ? w[0].toUpperCase() + w.slice(1) : w));
      setValue(picked.join(sep));
      setBits(Math.round(words * Math.log2(list.length)));
    }
  }, [mode, length, opts, words, sep, capitalize, list]);

  useEffect(() => {
    if (mode === "passphrase" && !list) getWordList().then(setList, () => setListError("The word list couldn't load. Check your connection and try again."));
  }, [mode, list]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- regenerate whenever the settings change
  useEffect(() => generate(), [generate]);

  const strength = bits >= 100 ? "Excellent" : bits >= 75 ? "Strong" : bits >= 55 ? "Fair" : "Weak";

  return (
    <div className="flex flex-col gap-5">
      <Segmented<Mode> label="Type" value={mode} onChange={setMode} options={[{ value: "password", label: "Random password" }, { value: "passphrase", label: "Memorable passphrase" }]} />
      <div className="flex flex-col gap-3 border border-hairline bg-ink-raised px-5 py-4">
        <output aria-live="polite" className="break-all font-mono text-[18px] leading-[1.5] text-bone">{value || (mode === "passphrase" ? listError || "Loading word list…" : "Select at least one character set")}</output>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11.5px] text-grey">
            ≈ {bits} bits of entropy · <span className={bits >= 75 ? "text-signal" : ""}>{strength}</span>
          </span>
          <span className="flex gap-2">
            <button type="button" onClick={generate} className={btnPrimary}>GENERATE NEW</button>
            {value && <CopyButton text={value} />}
          </span>
        </div>
      </div>
      {mode === "password" ? (
        <>
          <label className="flex flex-col gap-2.5">
            <Label aside={`${length} characters`}>LENGTH</Label>
            <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-signal" />
          </label>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5 text-[12px] text-bone-dim">
            {([["lower", "a–z"], ["upper", "A–Z"], ["digits", "0–9"], ["symbols", "!@#$"], ["noAmbiguous", "Avoid look-alikes (O/0, l/1)"]] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts((o) => ({ ...o, [k]: e.target.checked }))} className="accent-signal" />
                {label}
              </label>
            ))}
          </div>
        </>
      ) : (
        <>
          <label className="flex flex-col gap-2.5">
            <Label aside={`${words} words`}>WORDS</Label>
            <input type="range" min={3} max={10} value={words} onChange={(e) => setWords(Number(e.target.value))} className="w-full accent-signal" />
          </label>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[12px] text-bone-dim">
            <label className="flex items-center gap-2">
              Separator
              <select value={sep} onChange={(e) => setSep(e.target.value)} className="rounded-[2px] border border-hairline bg-ink-raised px-2 py-1 text-bone">
                <option value="-">hyphen -</option>
                <option value=".">dot .</option>
                <option value="_">underscore _</option>
                <option value=" ">space</option>
                <option value="">none</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="accent-signal" /> Capitalise words
            </label>
          </div>
        </>
      )}
    </div>
  );
}
