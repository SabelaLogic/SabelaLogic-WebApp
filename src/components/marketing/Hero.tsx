"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO_STATS } from "@/lib/data/site-content";
import { AccentText } from "./AccentText";

const HERO_IMAGES = [
  "/hero/dragon.webp",
  "/hero/bg-2.webp",
  "/hero/bg-3.webp",
  "/hero/bg-4.webp",
];

const SLIDESHOW_SECONDS = 6;

export function Hero() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_IMAGES.length);
    }, SLIDESHOW_SECONDS * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
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
        style={{
          background: "linear-gradient(to top, #080807 0%, rgba(8,9,10,0) 34%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 [animation:sl-grid-pulse_7s_ease-in-out_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(224,74,58,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(224,74,58,0.05) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 20% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 20% 0%, #000 20%, transparent 78%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[110px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(224,74,58,0.045), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1180px]">
        <div className="mb-7 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-signal">
          <span
            className="h-px w-[26px] origin-left bg-signal"
            style={{
              animation:
                "sl-draw 900ms cubic-bezier(.7,0,.3,1) both, sl-signal 3.4s ease-in-out 1s infinite",
            }}
          />
          PRETORIA, SOUTH AFRICA — AVAILABLE FOR WORK
        </div>
        <h1
          className="mb-6 max-w-[16ch] font-display text-[clamp(38px,7.2vw,88px)] leading-[0.98] font-extrabold tracking-[-0.03em]"
          style={{ textWrap: "balance" }}
        >
          <AccentText text="Beautiful is the" />{" "}
          <span className="text-grey">easy</span> half.
        </h1>
        <p
          className="mb-10 max-w-[56ch] text-[clamp(14px,1.45vw,17px)] leading-[1.68] text-bone-dim"
          style={{ textWrap: "pretty" }}
        >
          I build software that carries real weight — payments that clear,
          one-time PINs that arrive, databases at the edge, deploy pipelines
          that run without me. Then I make it look like something you&rsquo;d
          want to open. Both halves, or it isn&rsquo;t finished.
        </p>
        <div className="mb-14 flex flex-wrap gap-3">
          <Link
            href="/start-a-build"
            className="sl-ping sl-cta-primary flex items-center gap-[10px] rounded-[2px] bg-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] text-ink"
            style={{
              boxShadow:
                "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px",
            }}
          >
            START A BUILD →
          </Link>
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
              style={{
                width: slide === i ? "38px" : "16px",
                background: slide === i ? "#e04a3a" : "#3a3634",
              }}
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
              <div className="text-[10.5px] leading-[1.5] tracking-[0.13em] text-grey">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
