"use client";

import { useRef, useState, type ReactNode } from "react";
import { runExport, type ExportAction } from "@/lib/workshop/premium";

export const btnPrimary =
  "sl-cta-primary inline-flex items-center justify-center rounded-[2px] bg-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-ink disabled:cursor-not-allowed disabled:opacity-50";
export const btnSecondary =
  "sl-btn-outline inline-flex items-center justify-center rounded-[2px] border border-[#332f2d] px-5 py-3 text-[12px] text-bone disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center rounded-[2px] border border-hairline px-4 py-2.5 text-[12px] text-grey hover:border-hairline-hover hover:text-bone";
export const fieldClass =
  "sl-field w-full rounded-[2px] border border-hairline bg-ink-raised px-3.5 py-2.5 font-mono text-[13px] leading-[1.6] text-bone outline-none";
export const textareaClass =
  "sl-field w-full resize-y rounded-[2px] border border-hairline bg-ink-raised px-4 py-3.5 font-mono text-[13px] leading-[1.6] text-bone outline-none";
export const panelClass = "flex flex-col gap-3 border border-hairline bg-ink-raised px-5 py-4";

export function Label({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <span className="flex items-center justify-between text-[10.5px] tracking-[0.14em] text-grey">
      <span>{children}</span>
      {aside && <span className="text-signal">{aside}</span>}
    </span>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]"
    >
      {children}
    </div>
  );
}

export function Busy({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-grey" aria-live="polite">
      <span className="sl-spinner" />
      {children}
    </div>
  );
}

export function DropZone({
  accept,
  multiple = false,
  onFiles,
  title,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title: string;
  hint: string;
}) {
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      onClick={() => input.current?.click()}
      className={
        "flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-6 py-12 text-center transition-colors " +
        (over ? "border-signal bg-[#141110]" : "border-hairline bg-ink-raised hover:border-hairline-hover")
      }
    >
      <input
        ref={input}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
      <span className="text-[13px] font-bold text-bone">{title}</span>
      <span className="text-[11.5px] text-grey">{hint}</span>
    </div>
  );
}

/**
 * Every download in the Workshop goes through this button, so a future
 * premium gate (see lib/workshop/premium.ts) wraps all exports in one place.
 */
export function ExportButton({
  action,
  onExport,
  children,
  variant = "primary",
  disabled,
}: {
  action: ExportAction;
  onExport: () => void | Promise<void>;
  children: ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  const [working, setWorking] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled || working}
      onClick={async () => {
        setWorking(true);
        try {
          await runExport(action, onExport);
        } finally {
          setWorking(false);
        }
      }}
      className={variant === "primary" ? btnPrimary : btnSecondary}
    >
      {children}
    </button>
  );
}

export function CopyButton({ text, label = "COPY" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard blocked (e.g. insecure context) — the text is still selectable.
        }
      }}
      className={btnGhost}
    >
      {copied ? "COPIED ✓" : label}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={
            "rounded-[2px] border px-3.5 py-2 text-[12px] transition-colors " +
            (value === o.value
              ? "border-signal text-signal"
              : "border-hairline text-bone-dim hover:border-hairline-hover hover:text-bone")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
