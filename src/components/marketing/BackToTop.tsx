"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className={
        "sl-widget-hover fixed bottom-3.5 left-3.5 z-[60] flex h-11 w-11 items-center justify-center rounded-[2px] border border-hairline bg-ink/84 text-bone backdrop-blur-[12px] transition-opacity duration-200 " +
        (visible ? "opacity-100" : "pointer-events-none opacity-0")
      }
      style={{ boxShadow: "rgba(0,0,0,0.5) 0 4px 14px 2px" }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
