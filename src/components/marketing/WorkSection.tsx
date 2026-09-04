"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FILTERS, PROJECTS, TONE } from "@/lib/data/projects";
import type { ProjectStatus } from "@/lib/types";

function isExternal(href: string) {
  return href.startsWith("http");
}

export function WorkSection() {
  const [filter, setFilter] = useState<ProjectStatus | "ALL">("ALL");

  const flagship = useMemo(() => PROJECTS.filter((p) => p.flag), []);
  const roster = useMemo(
    () => PROJECTS.filter((p) => filter === "ALL" || p.status === filter),
    [filter],
  );

  return (
    <section id="work" className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">01 / DEPLOYMENTS</div>
            <h2 className="m-0 font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
              Everything I&rsquo;ve built.
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-[13px] leading-[1.7] text-grey">
            Including the unfinished. Work in progress is evidence of cadence, not a gap in the portfolio.
          </p>
        </div>

        <div className="mb-[52px] grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {flagship.map((p) => (
            <div key={p.name} className="sl-build-card sl-card-hover flex flex-col border border-hairline bg-ink-raised">
              <div className="relative h-[186px] overflow-hidden border-b border-hairline bg-ink">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-4 text-center text-[11px] tracking-[0.08em] text-grey-dark">
                    {p.slotHint}
                  </div>
                )}
              </div>
              <div className="flex grow flex-col gap-3.5 px-5 py-[22px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold tracking-[-0.01em]">{p.name}</span>
                  <span
                    className="whitespace-nowrap rounded-[2px] border px-[9px] py-1 text-[9.5px] tracking-[0.14em]"
                    style={{ color: TONE[p.status], borderColor: TONE[p.status] }}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-[11px] tracking-[0.1em] text-signal">{p.kind}</div>
                <p className="m-0 text-[12.5px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                  {p.summary}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-[2px] border border-hairline bg-[#151413] px-2 py-1 text-[10px] text-grey"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-[9px]">
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-2 text-[11.5px] tracking-[0.08em] text-signal hover:text-signal-hover"
                    >
                      OPEN LIVE BUILD ↗
                    </a>
                  )}
                  {p.href2 &&
                    (isExternal(p.href2) ? (
                      <a
                        href={p.href2}
                        className="flex items-center gap-2 text-[11.5px] tracking-[0.08em] text-grey hover:text-bone"
                      >
                        {p.href2Label} →
                      </a>
                    ) : (
                      <Link
                        href={p.href2}
                        className="flex items-center gap-2 text-[11.5px] tracking-[0.08em] text-grey hover:text-bone"
                      >
                        {p.href2Label} →
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-[18px] flex flex-wrap items-center gap-2">
          <span className="mr-1.5 text-[11px] tracking-[0.16em] text-grey">FULL ROSTER</span>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "cursor-pointer rounded-[2px] border px-[13px] py-2 text-[10.5px] tracking-[0.12em] transition-all duration-150 " +
                  (active
                    ? "border-signal bg-signal font-bold text-ink"
                    : "border-[#2b2827] bg-transparent text-grey")
                }
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="border border-hairline">
          {roster.map((p) => (
            <div
              key={p.name}
              className="flex flex-wrap items-start gap-x-[22px] gap-y-3 border-b border-hairline-soft p-[18px] transition-colors hover:bg-[#100f0e]"
            >
              <div className="flex min-w-0 flex-[1_1_210px] flex-col gap-[7px]">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="text-[13.5px] font-bold tracking-[-0.01em]">{p.name}</span>
                  <span
                    className="sl-status-pill whitespace-nowrap rounded-[2px] border px-[9px] py-1 text-[9.5px] tracking-[0.13em]"
                    style={{ color: TONE[p.status], borderColor: TONE[p.status] }}
                  >
                    {p.status}
                  </span>
                </div>
                {p.href && (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener"
                    className="text-[10.5px] break-words text-signal"
                  >
                    {p.hrefLabel} ↗
                  </a>
                )}
              </div>
              <span className="min-w-0 flex-[2_1_320px] text-[12.5px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                {p.summary}
              </span>
              <span className="min-w-0 flex-[1_1_180px] text-[10.5px] leading-[1.75] text-grey">
                {p.stack.join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
