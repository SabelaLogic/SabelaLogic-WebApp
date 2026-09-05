"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HERO_STATS } from "@/lib/data/site-content";

const HERO_IMAGES = [
  "https://sabelalogic26.firebaseapp.com/mythical-chinese-dragon-stockcake.webp",
  "https://sabelalogic26.firebaseapp.com/bg-2.jpg",
  "https://sabelalogic26.firebaseapp.com/bg-3.jpg",
  "https://sabelalogic26.firebaseapp.com/bg-4.jpg",
];

const AUDIO_SRC = "https://sabelalogic26.firebaseapp.com/Sabela.mp3";
const SLIDESHOW_SECONDS = 6;

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [audioOn, setAudioOn] = useState(false);
  const [level, setLevel] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const levelRef = useRef(0);
  const idleRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_IMAGES.length);
    }, SLIDESHOW_SECONDS * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;
    const base = 0.14;
    const peak = 0.52;

    const start = () => {
      audio
        .play()
        .then(() => setAudioOn(true))
        .catch(() => {});
    };
    const unlock = () => {
      if (audio.paused && !mutedRef.current) start();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastT = 0;
    const move = (ev: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && lastY !== null) {
        const d = Math.hypot(ev.clientX - lastX, ev.clientY - lastY);
        const dt = Math.max(now - lastT, 16);
        const v = Math.min((d / dt) * 22, 1);
        levelRef.current = levelRef.current * 0.72 + v * 0.28;
      }
      lastX = ev.clientX;
      lastY = ev.clientY;
      lastT = now;
      idleRef.current = now;
    };
    window.addEventListener("pointermove", move, { passive: true });

    const raf = setInterval(() => {
      if (performance.now() - idleRef.current > 260) levelRef.current *= 0.86;
      const lv = levelRef.current;
      if (!audio.paused) {
        audio.volume = Math.min(base + lv * (peak - base), 1);
      }
      setLevel((prev) => (Math.abs(lv - prev) > 0.045 ? lv : prev));
    }, 90);

    return () => {
      clearInterval(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      mutedRef.current = false;
      audio
        .play()
        .then(() => setAudioOn(true))
        .catch(() => {});
    } else {
      mutedRef.current = true;
      audio.pause();
      setAudioOn(false);
    }
  };

  const bar = (base: number, mult: number) => (audioOn ? base + level * mult : 2).toFixed(1) + "px";

  return (
    <>
      <section
        id="top"
        className="relative flex min-h-[clamp(560px,88vh,900px)] items-center overflow-hidden border-b border-hairline px-[clamp(16px,4vw,48px)] pt-[clamp(60px,9vw,120px)] pb-[clamp(48px,6vw,80px)]"
        style={{ animation: "sl-boot 1.3s ease-out both" }}
      >
        <div className="absolute inset-0 overflow-hidden bg-ink">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: slide === i ? 1 : 0 }}
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center [animation:drift_30s_ease-in-out_infinite_alternate]"
                style={{
                  inset: "-5%",
                  width: "110%",
                  height: "110%",
                  filter: "grayscale(88%) contrast(142%) brightness(0.72)",
                  mixBlendMode: "lighten",
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(8,9,10,0.94) 0%, rgba(8,9,10,0.82) 42%, rgba(8,9,10,0.42) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, #080807 0%, rgba(8,9,10,0) 34%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 [animation:sl-grid-pulse_7s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(224,74,58,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(224,74,58,0.05) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 90% 70% at 20% 0%, #000 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 20% 0%, #000 20%, transparent 78%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[110px]"
          style={{ background: "linear-gradient(to bottom, rgba(224,74,58,0.045), transparent)" }}
        />

        <div className="relative mx-auto w-full max-w-[1180px]">
          <div className="mb-7 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-signal">
            <span
              className="h-px w-[26px] origin-left bg-signal"
              style={{ animation: "sl-draw 900ms cubic-bezier(.7,0,.3,1) both, sl-signal 3.4s ease-in-out 1s infinite" }}
            />
            PRETORIA, SOUTH AFRICA — AVAILABLE FOR WORK
          </div>
          <h1 className="mb-6 max-w-[16ch] font-display text-[clamp(38px,7.2vw,88px)] leading-[0.98] font-extrabold tracking-[-0.03em]" style={{ textWrap: "balance" }}>
            Beautiful is the <span className="text-grey">easy</span> half.
          </h1>
          <p className="mb-10 max-w-[56ch] text-[clamp(14px,1.45vw,17px)] leading-[1.68] text-bone-dim" style={{ textWrap: "pretty" }}>
            I build software that carries real weight — payments that clear, one-time PINs that arrive,
            databases at the edge, deploy pipelines that run without me. Then I make it look like something
            you&rsquo;d want to open. Both halves, or it isn&rsquo;t finished.
          </p>
          <div className="mb-14 flex flex-wrap gap-3">
            <a
              href="/start-a-build"
              className="sl-ping sl-cta-primary flex items-center gap-[10px] rounded-[2px] bg-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] text-ink"
              style={{ boxShadow: "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px" }}
            >
              START A BUILD →
            </a>
            <a
              href="#work"
              className="sl-cta-secondary flex items-center gap-[10px] rounded-[2px] border border-[#332f2d] px-6 py-3.5 text-[13px] text-bone"
            >
              SEE WHAT I&rsquo;VE SHIPPED
            </a>
          </div>
          <div className="mb-8 flex items-center gap-[10px]">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Show hero image ${i + 1}`}
                className="h-[2px] cursor-pointer rounded-[2px] border-0 p-0 transition-all duration-[400ms]"
                style={{ width: slide === i ? "38px" : "16px", background: slide === i ? "#e04a3a" : "#3a3634" }}
              />
            ))}
            <span className="ml-1.5 font-mono text-[10px] tracking-[0.16em] text-grey-darker">
              {String(slide + 1).padStart(2, "0")} / 04
            </span>
          </div>
          <div className="sl-stat-grid grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px border border-hairline bg-hairline">
            {HERO_STATS.map((s) => (
              <div key={s.k} className="bg-ink-raised px-[18px] py-5">
                <div className="sl-stat-num mb-2 font-display text-[clamp(24px,3vw,34px)] leading-none font-extrabold text-signal">
                  {s.v}
                </div>
                <div className="text-[10.5px] leading-[1.5] tracking-[0.13em] text-grey">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        onClick={toggleAudio}
        title={audioOn ? "Mute ambient audio" : "Play ambient audio"}
        className="sl-widget-hover fixed right-3.5 bottom-3.5 z-[60] flex select-none items-center gap-[11px] rounded-[2px] border border-hairline bg-ink/84 px-3.5 py-[9px] backdrop-blur-[12px]"
        style={{ boxShadow: "rgba(0,0,0,0.5) 0 4px 14px 2px" }}
      >
        <span
          className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
          style={{
            background: audioOn ? "#e04a3a" : "#3e3a37",
            animation: audioOn ? "sl-pulse 2.4s ease-out infinite" : "none",
          }}
        />
        <span className="whitespace-nowrap text-[9.5px] tracking-[0.16em] text-grey">
          {audioOn ? "AUDIO_SYS: ONLINE" : "AUDIO_SYS: TAP TO ARM"}
        </span>
        <div className="flex h-[13px] items-end gap-[2px]">
          <span className="w-[2px] bg-signal transition-[height] duration-[120ms] ease-linear" style={{ height: bar(3, 10) }} />
          <span className="w-[2px] bg-signal transition-[height] duration-[120ms] ease-linear" style={{ height: bar(5, 8) }} />
          <span className="w-[2px] bg-signal transition-[height] duration-[120ms] ease-linear" style={{ height: bar(2, 11) }} />
          <span className="w-[2px] bg-signal transition-[height] duration-[120ms] ease-linear" style={{ height: bar(6, 7) }} />
        </div>
      </button>
    </>
  );
}
