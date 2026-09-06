"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { DEFAULT_STAGES, DEFAULT_WORKSTREAMS, RAIL, STAGE_KEYS, STAGE_LABELS } from "@/lib/data/visualizer-defaults";
import type { JourneyStage, NarrationEvent, Workstream } from "@/lib/types";
import { StageDetail } from "./StageDetail";
import { BuildIcon, DepositIcon, GoLiveIcon, OnboardingIcon, RetainerIcon } from "./icons";

const GREY = "#6b7076";
const DONE = "#34d399";

export interface JourneyVisualizerProps {
  clientName?: string;
  projectName?: string;
  reference?: string;
  currentStage?: 1 | 2 | 3 | 4 | 5;
  accent?: string;
  workstreams?: Workstream[];
  stages?: JourneyStage[];
  onNarration?: (e: NarrationEvent) => void;
}

function mix(hex: string, alpha: number) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return `rgba(52,211,153,${alpha})`;
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${alpha})`;
}

const statusMap: Record<Workstream["status"], { label: string; color: string }> = {
  complete: { label: "COMPLETE", color: "var(--a)" },
  active: { label: "IN BUILD", color: "#f2a93b" },
  queued: { label: "QUEUED", color: GREY },
  blocked: { label: "BLOCKED", color: "#e04a3a" },
};

export function JourneyVisualizer({
  clientName = "Northgate Motor Group",
  projectName = "Dealer Operations Platform",
  reference = "SL-2026-0148",
  currentStage = 3,
  accent = DONE,
  workstreams: wsProp,
  stages: stagesProp,
  onNarration,
}: JourneyVisualizerProps) {
  const current = Math.min(Math.max(Number(currentStage) || 3, 1), 5);
  const ws = wsProp && wsProp.length ? wsProp : DEFAULT_WORKSTREAMS;
  const stageData = stagesProp && stagesProp.length === 5 ? stagesProp : DEFAULT_STAGES;

  const [open, setOpen] = useState(0);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const s1Ref = useRef<HTMLElement | null>(null);
  const s2Ref = useRef<HTMLElement | null>(null);
  const s3Ref = useRef<HTMLElement | null>(null);
  const s4Ref = useRef<HTMLElement | null>(null);
  const s5Ref = useRef<HTMLElement | null>(null);
  const sectionRefs = [s1Ref, s2Ref, s3Ref, s4Ref, s5Ref];

  const accentVars = useMemo(
    () =>
      ({
        "--a": accent,
        "--a-dim": mix(accent, 0.14),
        "--a-line": mix(accent, 0.34),
        "--a-text": accent,
      }) as CSSProperties,
    [accent],
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.getAttribute("data-narration");
          if (!id || seen[id]) return;
          setSeen((s) => ({ ...s, [id]: true }));
          onNarration?.({
            stage: id,
            src: e.target.getAttribute("data-narration-src") || null,
            el: e.target as HTMLElement,
          });
        });
      },
      { threshold: 0.28 },
    );
    sectionRefs.forEach((r) => r.current && io.observe(r.current));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNarration]);

  const workstreams = ws.map((w, i) => {
    const st = statusMap[w.status] || statusMap.queued;
    const pct = Math.min(Math.max(Number(w.pct) || 0, 0), 100);
    return {
      key: i,
      name: w.name,
      color: st.color,
      statusLabel: st.label,
      pct,
      pctLabel: pct + "%",
      width: pct + "%",
      phase: w.phase || "—",
      milestone: w.milestone || "—",
    };
  });

  const overallPct = workstreams.length
    ? Math.round(workstreams.reduce((a, w) => a + w.pct, 0) / workstreams.length)
    : 0;

  const launches = ws.map((w, i) => {
    const live = w.status === "complete";
    return {
      key: i,
      no: "L" + String(i + 1).padStart(2, "0"),
      name: w.name,
      when: w.milestone || "—",
      state: live ? "LIVE" : w.status === "active" ? "STAGED" : "SCHEDULED",
      color: live ? "var(--a)" : w.status === "active" ? "#f2a93b" : GREY,
      bg: live ? "rgba(52,211,153,.04)" : "rgba(255,255,255,.012)",
    };
  });

  const badge = (n: number, date: string) => {
    if (n < current) return { badge: "· CONFIRMED", badgeColor: "var(--a)" };
    if (n === current) return { badge: "· CURRENT", badgeColor: "#f2a93b" };
    if (n === 5) return { badge: "· ON COMPLETION", badgeColor: "#4e5358" };
    const dup = String(date || "").toUpperCase().indexOf("FORECAST") > -1;
    return { badge: dup ? "" : "· FORECAST", badgeColor: "#4e5358" };
  };

  const stage: Record<string, JourneyStage & { badge: string; badgeColor: string }> = {};
  for (let n = 1; n <= 5; n++) {
    const d = stageData[n - 1] || ({} as JourneyStage);
    stage["s" + n] = {
      date: d.date || "—",
      timing: d.timing || "—",
      includes: d.includes || [],
      faq: d.faq || [],
      ...badge(n, d.date),
    };
  }

  const rev: Record<string, { o: number; t: string }> = {};
  for (let n = 1; n <= 5; n++) {
    const key = STAGE_KEYS[n - 1];
    const on = !!seen[key];
    rev["s" + n] = { o: on ? 1 : 0.06, t: on ? "translateY(0)" : "translateY(26px)" };
  }

  const jumpTo = (i: number) => {
    const el = sectionRefs[i]?.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };

  const rail = RAIL.map((r, i) => {
    const n = i + 1;
    const isCur = n === current;
    const done = n < current;
    return {
      key: n,
      no: r.no,
      short: r.short,
      barColor: isCur ? "var(--a)" : done ? "var(--a-line)" : "#1d2024",
      numColor: isCur ? "var(--a-text)" : "#3d4247",
      labelColor: isCur ? "#e8eaed" : done ? "#6b7076" : "#3d4247",
    };
  });

  const onboardSteps = [
    { key: 1, no: "F.01", label: "Intake form", state: "SUBMITTED" },
    { key: 2, no: "F.02", label: "Scope disclaimer", state: "ACCEPTED" },
    { key: 3, no: "F.03", label: "Signature", state: "PROFILE CREATED" },
  ].map((o) => ({
    ...o,
    dot: current >= 2 ? "var(--a)" : "#1d2024",
    stateColor: current >= 2 ? "var(--a-text)" : "#4e5358",
  }));

  const retainerItems = [
    { key: 1, label: "Uptime & error monitoring", cadence: "CONTINUOUS" },
    { key: 2, label: "Security patching", cadence: "AS RELEASED" },
    { key: 3, label: "Small change window", cadence: "MONTHLY" },
    { key: 4, label: "Roadmap review", cadence: "QUARTERLY" },
  ];

  const liveCount = ws.filter((w) => w.status === "complete").length;
  const railProgress = String(current).padStart(2, "0") + " / 05";
  const footerNote = `${liveCount} of ${ws.length} systems live · figures read from the build tracker`;

  const toggle = (n: number) => setOpen((o) => (o === n ? 0 : n));
  const label = (n: number) => (open === n ? "CLOSE" : "STAGE DETAIL");

  return (
    <div
      className="min-h-screen bg-[#07080a] pb-[140px] font-sans-ui font-light text-[#e8eaed] antialiased"
      style={{
        ...accentVars,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px), radial-gradient(circle at 78% 4%, var(--a-dim), transparent 46%)",
        backgroundSize: "64px 64px, 64px 64px, 100% 100%",
      }}
    >
      <header className="sticky top-0 z-40 border-b border-[#16181c] bg-[#07080a]/82 backdrop-blur-[14px]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-10 py-[18px]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-4 transition-opacity hover:opacity-75"
              aria-label="Sabela Logic home"
            >
              <div
                className="h-[9px] w-[9px] rounded-full"
                style={{ background: "var(--a)", boxShadow: "0 0 12px var(--a-line)" }}
              />
              <div className="font-mono text-[11px] tracking-[0.22em] text-[#6b7076]">
                SABELALOGIC · BUILD TRACKER
              </div>
            </Link>
            <div data-rail-mini className="ml-1.5 items-center gap-3.5">
              <span className="flex gap-1">
                {rail.map((m, i) => (
                  <button
                    key={m.key}
                    onClick={() => jumpTo(i)}
                    title={m.short}
                    className="h-[3px] w-[22px] cursor-pointer rounded-sm border-none p-0 transition-colors duration-[400ms]"
                    style={{ background: m.barColor }}
                  />
                ))}
              </span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-[#565b60]">{railProgress}</span>
            </div>
          </div>
          <div className="flex items-center gap-7">
            <div className="text-right">
              <div className="text-[14px] font-medium text-[#f4f5f6]">{clientName}</div>
              <div className="mt-[3px] font-mono text-[11px] text-[#6b7076]">{projectName}</div>
            </div>
            <div className="rounded-[3px] border border-[#1d2024] px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[#4e5358]">
              {reference}
            </div>
          </div>
        </div>
      </header>

      <nav data-rail className="fixed top-1/2 left-[34px] z-30 -translate-y-1/2 flex-col gap-0.5">
        {rail.map((r, i) => (
          <button
            key={r.key}
            onClick={() => jumpTo(i)}
            className="flex items-center gap-3.5 border-none bg-none px-0 py-[9px] text-left font-mono"
          >
            <span className="h-[26px] w-[2px] rounded-sm transition-colors duration-[400ms]" style={{ background: r.barColor }} />
            <span className="flex items-center gap-[9px]">
              <span className="text-[10px] tracking-[0.12em] transition-colors duration-[400ms]" style={{ color: r.numColor }}>
                {r.no}
              </span>
              <span className="text-[11px] tracking-[0.04em] transition-colors duration-[400ms]" style={{ color: r.labelColor }}>
                {r.short}
              </span>
            </span>
          </button>
        ))}
        <div className="mt-[18px] pl-4 font-mono text-[9px] tracking-[0.16em] text-[#3d4247]">{railProgress}</div>
      </nav>

      <div className="mx-auto max-w-[820px] px-10">
        <section className="pt-[120px] pb-24">
          <div className="mb-7 font-mono text-[11px] tracking-[0.2em] text-[var(--a-text)]">
            FORECASTED ENGAGEMENT PATH
          </div>
          <h1 className="mb-[26px] text-[58px] leading-[1.02] font-light tracking-[-0.03em] text-[#fbfcfc]" style={{ textWrap: "pretty" }}>
            Every stage of your build, <span className="text-[#6b7076]">before it happens.</span>
          </h1>
          <p className="mb-10 max-w-[560px] text-[17px] leading-[1.65] text-[#8d9298]" style={{ textWrap: "pretty" }}>
            Five stages from deposit to ongoing retainer. This page tracks the real state of your workstreams
            — it updates as milestones land, so what you see here is what is actually true today.
          </p>
          <div className="flex flex-wrap gap-11 border-t border-[#16181c] pt-[34px]">
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-[#565b60]">CURRENT STAGE</div>
              <div className="text-[15px] text-[#e8eaed]">{STAGE_LABELS[current - 1]}</div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-[#565b60]">WORKSTREAMS</div>
              <div className="text-[15px] text-[#e8eaed]">{ws.length} active</div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-[#565b60]">OVERALL</div>
              <div className="text-[15px] text-[var(--a-text)]">{overallPct}% complete</div>
            </div>
          </div>
        </section>

        {/* Stage 1 — Deposit */}
        <section
          ref={s1Ref}
          data-narration={STAGE_KEYS[0]}
          data-narration-src=""
          className="border-t border-[#16181c] py-[76px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: rev.s1.o, transform: rev.s1.t, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        >
          <div className="flex items-start gap-9">
            <div
              className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--a-line)", background: "rgba(52,211,153,.06)" }}
            >
              <DepositIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3.5 flex items-center gap-3.5 font-mono text-[10px] tracking-[0.18em]">
                <span className="text-[var(--a-text)]">STAGE 01</span>
                <span className="text-[#3d4247]">·</span>
                <span className="text-[#6b7076]">{stage.s1.date}</span>
                <span style={{ color: stage.s1.badgeColor }}>{stage.s1.badge}</span>
              </div>
              <h2 className="mb-3.5 text-[32px] font-light tracking-[-0.02em] text-[#fbfcfc]">Deposit Confirmed</h2>
              <p className="mb-6 max-w-[520px] text-[16px] leading-[1.62] text-[#8d9298]" style={{ textWrap: "pretty" }}>
                Payment lands, the engagement is booked, and your slot in the build queue is held. Nothing
                starts before this and nothing is invoiced twice.
              </p>
              <button
                onClick={() => toggle(1)}
                className="rounded-[3px] border border-[#1d2024] bg-none px-[15px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-[#8d9298] hover:border-[var(--a-line)] hover:text-[#e8eaed]"
              >
                {label(1)}
              </button>
              {open === 1 && <StageDetail stage={stage.s1} />}
            </div>
          </div>
        </section>

        {/* Stage 2 — Onboarding */}
        <section
          ref={s2Ref}
          data-narration={STAGE_KEYS[1]}
          data-narration-src=""
          className="border-t border-[#16181c] py-[76px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: rev.s2.o, transform: rev.s2.t, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        >
          <div className="flex items-start gap-9">
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-[#1d2024] bg-white/[0.02]">
              <OnboardingIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3.5 flex items-center gap-3.5 font-mono text-[10px] tracking-[0.18em]">
                <span className="text-[var(--a-text)]">STAGE 02</span>
                <span className="text-[#3d4247]">·</span>
                <span className="text-[#6b7076]">{stage.s2.date}</span>
                <span style={{ color: stage.s2.badgeColor }}>{stage.s2.badge}</span>
              </div>
              <h2 className="mb-3.5 text-[32px] font-light tracking-[-0.02em] text-[#fbfcfc]">Onboarding</h2>
              <p className="mb-[26px] max-w-[520px] text-[16px] leading-[1.62] text-[#8d9298]" style={{ textWrap: "pretty" }}>
                Intake form, scope disclaimer and signature. Three documents, one sitting — and your client
                profile exists from that point on.
              </p>
              <div className="mb-6 grid max-w-[560px] grid-cols-3 gap-2.5">
                {onboardSteps.map((o) => (
                  <div key={o.key} className="rounded border border-[#1d2024] bg-white/[0.015] px-3.5 py-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-[0.14em] text-[#565b60]">{o.no}</span>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: o.dot }} />
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#d3d7da]">{o.label}</div>
                    <div className="mt-[9px] font-mono text-[9px] tracking-[0.1em]" style={{ color: o.stateColor }}>
                      {o.state}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggle(2)}
                className="rounded-[3px] border border-[#1d2024] bg-none px-[15px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-[#8d9298] hover:border-[var(--a-line)] hover:text-[#e8eaed]"
              >
                {label(2)}
              </button>
              {open === 2 && <StageDetail stage={stage.s2} />}
            </div>
          </div>
        </section>

        {/* Stage 3 — Build */}
        <section
          ref={s3Ref}
          data-narration={STAGE_KEYS[2]}
          data-narration-src=""
          className="border-t border-[#16181c] py-[76px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: rev.s3.o, transform: rev.s3.t, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        >
          <div className="flex items-start gap-9">
            <div
              className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border"
              style={{ borderColor: "var(--a-line)", background: "rgba(52,211,153,.06)" }}
            >
              <BuildIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3.5 flex items-center gap-3.5 font-mono text-[10px] tracking-[0.18em]">
                <span className="text-[var(--a-text)]">STAGE 03</span>
                <span className="text-[#3d4247]">·</span>
                <span className="text-[#6b7076]">{stage.s3.date}</span>
                <span style={{ color: stage.s3.badgeColor }}>{stage.s3.badge}</span>
              </div>
              <h2 className="mb-3.5 text-[32px] font-light tracking-[-0.02em] text-[#fbfcfc]">Build In Progress</h2>
              <p className="mb-[30px] max-w-[520px] text-[16px] leading-[1.62] text-[#8d9298]" style={{ textWrap: "pretty" }}>
                Each workstream runs on its own track with its own milestones. Percentages below come from the
                build tracker, not from a status meeting.
              </p>
              <div className="mb-[26px] flex flex-col gap-0.5">
                {workstreams.map((w) => (
                  <div key={w.key} className="rounded border border-[#16181c] bg-white/[0.012] p-5">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: w.color }} />
                        <span className="overflow-hidden text-[16px] text-ellipsis whitespace-nowrap text-[#e8eaed]">
                          {w.name}
                        </span>
                      </div>
                      <div className="flex flex-shrink-0 items-baseline gap-3.5 font-mono">
                        <span className="text-[10px] tracking-[0.14em]" style={{ color: w.color }}>
                          {w.statusLabel}
                        </span>
                        <span className="text-[15px] text-[#e8eaed] tabular-nums">{w.pctLabel}</span>
                      </div>
                    </div>
                    <div className="relative h-[3px] overflow-hidden rounded-sm bg-[#15171b]">
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-[1200ms]"
                        style={{ width: w.width, background: w.color, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
                      />
                    </div>
                    <div className="mt-3 flex justify-between gap-4 font-mono text-[10px] tracking-[0.1em] text-[#565b60]">
                      <span>{w.phase}</span>
                      <span>{w.milestone}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggle(3)}
                className="rounded-[3px] border border-[#1d2024] bg-none px-[15px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-[#8d9298] hover:border-[var(--a-line)] hover:text-[#e8eaed]"
              >
                {label(3)}
              </button>
              {open === 3 && <StageDetail stage={stage.s3} />}
            </div>
          </div>
        </section>

        {/* Stage 4 — Go-Live */}
        <section
          ref={s4Ref}
          data-narration={STAGE_KEYS[3]}
          data-narration-src=""
          className="border-t border-[#16181c] py-[76px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: rev.s4.o, transform: rev.s4.t, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        >
          <div className="flex items-start gap-9">
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#1d2024] bg-white/[0.02]">
              <GoLiveIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3.5 flex items-center gap-3.5 font-mono text-[10px] tracking-[0.18em]">
                <span className="text-[var(--a-text)]">STAGE 04</span>
                <span className="text-[#3d4247]">·</span>
                <span className="text-[#6b7076]">{stage.s4.date}</span>
                <span style={{ color: stage.s4.badgeColor }}>{stage.s4.badge}</span>
              </div>
              <h2 className="mb-3.5 text-[32px] font-light tracking-[-0.02em] text-[#fbfcfc]">Milestone / Go-Live</h2>
              <p className="mb-[30px] max-w-[520px] text-[16px] leading-[1.62] text-[#8d9298]" style={{ textWrap: "pretty" }}>
                Systems go live one at a time, not all on one nervous afternoon. Each launch is its own
                milestone with its own sign-off.
              </p>
              <div className="mb-[26px] flex flex-col gap-0.5">
                {launches.map((l) => (
                  <div
                    key={l.key}
                    className="flex items-center gap-[18px] rounded border border-[#16181c] px-5 py-[18px]"
                    style={{ background: l.bg }}
                  >
                    <span className="w-[26px] flex-shrink-0 font-mono text-[10px] tracking-[0.14em] text-[#565b60]">
                      {l.no}
                    </span>
                    <span className="min-w-0 flex-1 overflow-hidden text-[16px] text-ellipsis whitespace-nowrap text-[#e8eaed]">
                      {l.name}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.12em] text-[#6b7076]">{l.when}</span>
                    <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em]" style={{ color: l.color }}>
                      <span className="h-[5px] w-[5px] rounded-full" style={{ background: l.color }} />
                      {l.state}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggle(4)}
                className="rounded-[3px] border border-[#1d2024] bg-none px-[15px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-[#8d9298] hover:border-[var(--a-line)] hover:text-[#e8eaed]"
              >
                {label(4)}
              </button>
              {open === 4 && <StageDetail stage={stage.s4} />}
            </div>
          </div>
        </section>

        {/* Stage 5 — Retainer */}
        <section
          ref={s5Ref}
          data-narration={STAGE_KEYS[4]}
          data-narration-src=""
          className="border-t border-[#16181c] py-[76px] transition-[opacity,transform] duration-[800ms]"
          style={{ opacity: rev.s5.o, transform: rev.s5.t, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
        >
          <div className="flex items-start gap-9">
            <div
              className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-dashed"
              style={{ borderColor: "var(--a-line)", background: "rgba(52,211,153,.04)" }}
            >
              <RetainerIcon />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-3.5 flex items-center gap-3.5 font-mono text-[10px] tracking-[0.18em]">
                <span className="text-[var(--a-text)]">STAGE 05</span>
                <span className="text-[#3d4247]">·</span>
                <span className="text-[#6b7076]">{stage.s5.date}</span>
                <span style={{ color: stage.s5.badgeColor }}>{stage.s5.badge}</span>
              </div>
              <h2 className="mb-3.5 text-[32px] font-light tracking-[-0.02em] text-[#fbfcfc]">Ongoing Retainer</h2>
              <p className="mb-[30px] max-w-[520px] text-[16px] leading-[1.62] text-[#8d9298]" style={{ textWrap: "pretty" }}>
                The build ends; the system doesn&rsquo;t. Monitoring, patches, small changes and a standing
                monthly window for whatever the next quarter needs.
              </p>
              <div className="mb-[26px] max-w-[560px] rounded border border-[#16181c] bg-white/[0.012] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--a)", animation: "vz-blink 2.4s ease-in-out infinite" }}
                  />
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--a-text)]">
                    CONTINUOUS · NO END DATE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {retainerItems.map((ri) => (
                    <div key={ri.key}>
                      <div className="mb-1.5 text-[14px] text-[#d3d7da]">{ri.label}</div>
                      <div className="font-mono text-[10px] tracking-[0.1em] text-[#565b60]">{ri.cadence}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggle(5)}
                className="rounded-[3px] border border-[#1d2024] bg-none px-[15px] py-[9px] font-mono text-[10px] tracking-[0.14em] text-[#8d9298] hover:border-[var(--a-line)] hover:text-[#e8eaed]"
              >
                {label(5)}
              </button>
              {open === 5 && <StageDetail stage={stage.s5} />}
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap items-end justify-between gap-8 border-t border-[#16181c] pt-14">
          <div>
            <div className="mb-2.5 font-mono text-[10px] tracking-[0.18em] text-[#3d4247]">TRACKER STATE</div>
            <div className="text-[14px] text-[#6b7076]">{footerNote}</div>
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[#3d4247]">SABELALOGIC</div>
        </footer>
      </div>
    </div>
  );
}
