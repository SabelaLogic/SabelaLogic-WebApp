"use client";

import { useState } from "react";
import { KINDS } from "@/lib/data/site-content";
import { MAX_LENGTHS } from "@/lib/validation";
import { Spinner } from "./Spinner";
import { AccentText } from "./AccentText";
import { LiveDot } from "./LiveDot";

export function GeneratorSection({ eyebrow = "05 / ARCHITECTURE GENERATOR" }: { eyebrow?: string }) {
  const [brief, setBrief] = useState("");
  const [kind, setKind] = useState("Web app MVP");
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const runGen = async () => {
    const trimmed = brief.trim();
    if (trimmed.length < 12) {
      setError("Give me a sentence or two more — I need something to architect.");
      return;
    }
    setBusy(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: trimmed, kind }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setOutput(String(data.text || "").trim());
    } catch {
      setError(
        "The generator could not be reached just now. Send the brief straight to me instead and I will write it by hand.",
      );
    } finally {
      setBusy(false);
    }
  };

  const sendToBrief = () => {
    const el = document.getElementById("contact");
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    }
    window.dispatchEvent(
      new CustomEvent("sabelalogic:send-to-brief", { detail: { kind, generated: output } }),
    );
  };

  return (
    <section id="generator" className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
          <LiveDot />
          {eyebrow}
        </div>
        <h2 className="mb-4 font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
          <AccentText text="Describe it. Get the build plan." />
        </h2>
        <p className="mb-[34px] max-w-[58ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
          A real generator, not a demo reel. Tell it what you want built and it returns the stack, the data
          model, the risky parts and a day-by-day schedule — the same brief I&rsquo;d write before quoting
          you.
        </p>

        <div className="border border-hairline bg-ink-raised">
          <div className="flex items-center gap-[9px] border-b border-hairline bg-[#111010] px-[18px] py-3">
            <span className="h-2 w-2 rounded-full bg-[#ff6b5e]" />
            <span className="h-2 w-2 rounded-full bg-amber" />
            <span className="h-2 w-2 rounded-full bg-signal" />
            <span className="ml-2 text-[10.5px] tracking-[0.14em] text-grey-darker">sabela://architect</span>
          </div>
          <div className="flex flex-col gap-[18px] p-[clamp(18px,3vw,28px)]">
            <div>
              <label className="mb-2.5 block text-[10.5px] tracking-[0.14em] text-grey">
                WHAT DO YOU WANT BUILT?
              </label>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  setError("");
                }}
                rows={4}
                maxLength={MAX_LENGTHS.brief}
                placeholder="A booking system for my mobile car-wash — customers pick a slot and pay a deposit, my drivers see the day's route on their phones."
                className="sl-field w-full resize-y rounded-[2px] border border-[#2b2827] bg-ink px-3.5 py-3.5 text-[13px] leading-[1.7] text-bone outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10.5px] tracking-[0.14em] text-grey">TYPE</span>
              {KINDS.map((k) => {
                const active = kind === k;
                return (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={
                      "cursor-pointer rounded-[2px] border px-[13px] py-2 text-[10.5px] tracking-[0.12em] transition-all duration-150 " +
                      (active
                        ? "border-signal bg-signal font-bold text-ink"
                        : "border-[#2b2827] bg-transparent text-grey")
                    }
                  >
                    {k}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={runGen}
                disabled={busy}
                className={
                  "flex items-center gap-2.5 rounded-[2px] border border-signal px-[22px] py-[13px] text-[12px] font-bold tracking-[0.06em] transition-all " +
                  (busy ? "cursor-wait bg-[#241412] text-signal" : "cursor-pointer bg-signal text-ink")
                }
                style={busy ? undefined : { boxShadow: "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px" }}
              >
                {busy && <Spinner />}
                {busy ? "ARCHITECTING…" : "GENERATE BUILD BRIEF →"}
              </button>
              {output && (
                <button
                  onClick={sendToBrief}
                  className="sl-btn-outline rounded-[2px] border border-[#332f2d] bg-transparent px-5 py-[13px] text-[12px] text-bone hover:border-signal hover:text-signal"
                >
                  SEND THIS TO LUNGA →
                </button>
              )}
            </div>
            {error && (
              <div className="border border-[#4d3520] bg-[#1a1210] p-3.5 text-[12px] leading-[1.65] text-[#f2c98b]">
                {error}
              </div>
            )}
            {output && (
              <div className="max-h-[520px] overflow-y-auto border border-hairline bg-ink p-[clamp(16px,2.4vw,24px)]">
                <div className="mb-4 text-[10.5px] tracking-[0.16em] text-signal">— BUILD BRIEF</div>
                <div className="text-[12.5px] leading-[1.85] whitespace-pre-wrap break-words text-bone-bright">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
