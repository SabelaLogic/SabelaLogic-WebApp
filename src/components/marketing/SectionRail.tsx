"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "top", label: "TOP" },
  { id: "showcase", label: "3D" },
  { id: "turnaround", label: "SLA" },
  { id: "work", label: "01" },
  { id: "proof", label: "02" },
  { id: "process", label: "03" },
  { id: "build-log", label: "04" },
  { id: "generator", label: "05" },
  { id: "services", label: "06" },
  { id: "contact", label: "07" },
];

export function SectionRail() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = activeRef.current;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActive(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-[9px] lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            aria-label={s.label}
            title={s.label}
            className="group flex items-center justify-end gap-2.5"
          >
            <span
              className={
                "font-mono text-[9.5px] tracking-[0.1em] opacity-0 transition-opacity duration-150 group-hover:opacity-100 " +
                (isActive ? "text-signal" : "text-grey")
              }
            >
              {s.label}
            </span>
            <span
              className="block h-[7px] w-[7px] shrink-0 rounded-full border transition-all duration-200"
              style={{
                borderColor: isActive ? "var(--color-signal)" : "var(--color-hairline-hover)",
                background: isActive ? "var(--color-signal)" : "transparent",
                transform: isActive ? "scale(1.3)" : "scale(1)",
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
