"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "https://sabelalogic26.firebaseapp.com/Sabela.mp3";

// Mounted once in the root layout (not inside Hero) so it survives client-side
// navigation between pages instead of stopping the moment you leave "/".
export function AmbientAudio() {
  const [audioOn, setAudioOn] = useState(false);
  const [level, setLevel] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const levelRef = useRef(0);
  const idleRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = reduceMotion ? 0.14 : 0;
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

    // Reactive volume tracks pointer movement — skipped under reduced motion so the audio
    // system stays at a flat, predictable level instead of an animated one.
    let cleanupReactivity = () => {};
    if (!reduceMotion) {
      let lastX: number | null = null;
      let lastY: number | null = null;
      let lastT = 0;
      const move = (ev: PointerEvent) => {
        // Touch drags/scrolls fire pointermove too — only real mouse movement should
        // drive the reactive volume, otherwise every scroll on a touchscreen reads as
        // a fast cursor swipe and the volume jumps around unpredictably.
        if (ev.pointerType !== "mouse") return;
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

      cleanupReactivity = () => {
        clearInterval(raf);
        window.removeEventListener("pointermove", move);
      };
    }

    return () => {
      cleanupReactivity();
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
    <button
      onClick={toggleAudio}
      title={audioOn ? "Mute ambient audio" : "Play ambient audio"}
      aria-label={audioOn ? "Mute ambient audio" : "Play ambient audio"}
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
  );
}
