"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BrandCanvas = dynamic(() => import("./BrandScene").then((m) => m.BrandCanvas), {
  ssr: false,
});

type PinMode = "before" | "pinned" | "after";

/**
 * Manual scroll-pin instead of CSS `position: sticky` — the page root wraps
 * everything in `overflow-x-hidden`, which breaks sticky's containing-block
 * lookup for descendants. Fixed/absolute positioning driven by scroll
 * position sidesteps that entirely.
 */
function usePinMode(sectionRef: React.RefObject<HTMLElement | null>) {
  const [mode, setMode] = useState<PinMode>("before");

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > 0) setMode("before");
      else if (rect.bottom <= window.innerHeight) setMode("after");
      else setMode("pinned");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef]);

  return mode;
}

export function BrandShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mode = usePinMode(sectionRef);

  const stageClass =
    mode === "pinned"
      ? "fixed inset-x-0 top-0 h-screen w-full"
      : mode === "after"
        ? "absolute inset-x-0 bottom-0 h-screen w-full"
        : "absolute inset-x-0 top-0 h-screen w-full";

  return (
    <section id="showcase" ref={sectionRef} className="relative h-[220vh] border-b border-hairline bg-ink">
      <div className={`${stageClass} overflow-hidden`}>
        <BrandCanvas sectionRef={sectionRef} />
        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1180px] flex-col justify-center px-[clamp(16px,4vw,48px)]">
          <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">IN THREE DIMENSIONS</div>
          <h2 className="max-w-[18ch] font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
            Built from parts, scroll by scroll.
          </h2>
        </div>
      </div>
    </section>
  );
}
