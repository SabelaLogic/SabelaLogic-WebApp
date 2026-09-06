"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/marketing/Spinner";

const LINE = "Welcome to SabelaLogic, your project is about to take off ....";
const PERKS = [
  { no: "01", label: "Live workstream progress, read from the build tracker" },
  { no: "02", label: "Go-live dates and sign-off checklists per system" },
  { no: "03", label: "Invoices, scope notes and your signed engagement terms" },
];

export function LoginForm() {
  const router = useRouter();
  const [typed, setTyped] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTyped((n) => {
        if (n >= LINE.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return n;
        }
        return n + 1;
      });
    }, 42);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter both your email and password to continue.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { accepted?: boolean; error?: string };
      if (!res.ok) {
        setBusy(false);
        setError(data.error ?? "Invalid email or password.");
        return;
      }
      router.push(data.accepted ? "/portal" : "/acceptance");
    } catch {
      setBusy(false);
      setError("Could not reach the portal right now — try again shortly.");
    }
  };

  return (
    <div className="w-full max-w-[1000px] grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(36px,6vw,80px)]">
      <div className="sl-in">
        <div className="mb-6 font-mono text-[11px] tracking-[0.2em] text-signal">CLIENT PORTAL · SECURE</div>
        <h1 className="mb-[26px] min-h-[3.3em] font-display text-[clamp(34px,4.6vw,52px)] leading-[1.1] font-normal tracking-[-0.01em] text-bone" style={{ textWrap: "pretty" }}>
          {LINE.slice(0, typed)}
          <span
            className="ml-[3px] inline-block h-[0.92em] w-[3px] bg-signal align-[-0.09em]"
            style={{ animation: "sl-caret 1.06s steps(1) infinite" }}
          />
        </h1>
        <p className="mb-[34px] max-w-[400px] text-[14.5px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
          Sign in to track your build stage by stage — workstream progress, go-live dates and everything your
          retainer covers, live.
        </p>
        <div className="flex max-w-[400px] flex-col gap-3.5 border-t border-hairline pt-7">
          {PERKS.map((k) => (
            <div key={k.no} className="flex items-baseline gap-3.5">
              <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.14em] text-signal">{k.no}</span>
              <span className="text-[13.5px] leading-[1.6] text-bone-dim">{k.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="sl-in border border-hairline bg-ink-raised p-[clamp(26px,3.4vw,40px)]"
        style={{ animationDelay: ".14s" }}
      >
        <div className="mb-[30px] flex items-center justify-between gap-3">
          <span className="text-[16px] font-semibold tracking-[-0.01em] text-bone">Sign in</span>
          <span className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em] text-grey">
            <span className="h-[5px] w-[5px] rounded-full bg-green" />
            PORTAL ONLINE
          </span>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2.5">
            <span className="font-mono text-[10px] tracking-[0.16em] text-grey">EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@company.co.za"
              autoComplete="email"
              className="sl-field w-full rounded-[2px] border border-hairline bg-ink px-3.5 py-[13px] font-display text-[14px] text-bone"
            />
          </label>
          <label className="flex flex-col gap-2.5">
            <span className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em] text-grey">
              PASSWORD <a href="#reset" className="text-[9.5px] tracking-[0.12em]">FORGOT?</a>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="sl-field w-full rounded-[2px] border border-hairline bg-ink px-3.5 py-[13px] font-display text-[14px] text-bone"
            />
          </label>
          {error && (
            <div className="border-l border-signal pl-3 text-[12.5px] leading-[1.6] text-signal">{error}</div>
          )}
          <button
            type="submit"
            className="sl-submit mt-1.5 flex w-full items-center justify-center gap-2.5 rounded-[2px] border-none bg-signal px-[22px] py-[15px] font-display text-[13px] font-bold tracking-[0.06em] text-ink"
          >
            {busy && <Spinner className="sl-spinner-ink" />}
            {busy ? "CHECKING…" : "SIGN IN"}
          </button>
        </form>
        <div className="mt-[26px] border-t border-hairline pt-[22px] text-[12.5px] leading-[1.7] text-grey">
          No portal access yet? <Link href="/#contact">Start a build</Link> and we&rsquo;ll issue credentials at
          onboarding.
        </div>
        <Link
          href="/start-a-build"
          className="sl-cta-primary sl-ping mt-4 flex w-full items-center justify-center gap-[10px] rounded-[2px] bg-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] text-ink"
          style={{ boxShadow: "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px" }}
        >
          START A BUILD →
        </Link>
      </div>
    </div>
  );
}
