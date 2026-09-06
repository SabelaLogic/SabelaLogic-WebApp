"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface CarouselSlide {
  src: string;
  alt: string;
  caption: string;
}

const AUTOPLAY_SECONDS = 5;

export function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <div
      className="border border-hairline bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex h-[clamp(260px,42vw,460px)] items-center justify-center overflow-hidden bg-ink-raised">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-[600ms] ease-in-out"
            style={{ opacity: index === i ? 1 : 0, pointerEvents: index === i ? "auto" : "none" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-contain p-[clamp(12px,2.4vw,28px)]"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous screenshot"
          className="sl-widget-hover absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[2px] border border-hairline bg-ink/80 text-bone backdrop-blur-[8px]"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next screenshot"
          className="sl-widget-hover absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[2px] border border-hairline bg-ink/80 text-bone backdrop-blur-[8px]"
        >
          →
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-4 py-3.5">
        <span className="text-[12px] leading-[1.6] text-bone-dim">{slides[index].caption}</span>
        <div className="flex items-center gap-[10px]">
          {slides.map((s, i) => (
            <button
              key={s.src}
              onClick={() => go(i)}
              aria-label={`Show screenshot ${i + 1}`}
              className="h-[2px] cursor-pointer rounded-[2px] border-0 p-0 transition-all duration-[400ms]"
              style={{ width: index === i ? "28px" : "12px", background: index === i ? "#e04a3a" : "#3a3634" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
