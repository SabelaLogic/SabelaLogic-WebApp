"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sl-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (!window.localStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
          requestAnimationFrame(() => setEntered(true));
        }
      } catch {
        // localStorage unavailable — skip the banner rather than break the page
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const dismiss = (value: "accepted" | "declined") => {
    setEntered(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-3.5 z-[70] mx-auto flex w-[calc(100%-28px)] max-w-[480px] flex-col gap-3.5 rounded-[2px] border border-hairline bg-ink-raised p-[18px] font-mono transition-all duration-300 ease-out sm:flex-row sm:items-center sm:justify-between"
      style={{
        boxShadow: "rgba(0,0,0,0.55) 0 10px 30px 4px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <p className="m-0 text-[12px] leading-[1.65] text-bone-dim">
        This site uses cookies for basic analytics only — nothing sold, nothing tracked across other sites.
      </p>
      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() => dismiss("declined")}
          className="rounded-[2px] border border-hairline px-3.5 py-2 text-[11px] tracking-[0.06em] text-grey hover:border-hairline-hover hover:text-bone"
        >
          DECLINE
        </button>
        <button
          type="button"
          onClick={() => dismiss("accepted")}
          className="sl-btn-outline rounded-[2px] border border-signal px-3.5 py-2 text-[11px] font-bold tracking-[0.06em] text-signal"
        >
          ACCEPT
        </button>
      </div>
    </div>
  );
}
