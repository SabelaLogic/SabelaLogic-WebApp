"use client";

import { useState } from "react";
import { isValidEmail, MAX_LENGTHS } from "@/lib/validation";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sabelalogic.co.za/blog" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not subscribe.");
      setSent(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-hairline bg-ink-raised p-[clamp(20px,3vw,32px)]">
      <div className="mb-2 text-[11px] tracking-[0.22em] text-signal">THE WEEKLY BRIEF</div>
      <h3 className="mb-3 font-display text-[clamp(20px,2.6vw,28px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
        Practical builds and business tech, once a week.
      </h3>
      <p className="mb-6 max-w-[52ch] text-[13px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
        No sales pitch every issue — real use cases, what they cost, and what they actually replace. Unsubscribe
        whenever it stops being useful.
      </p>

      {sent ? (
        <div className="flex items-center gap-3 border border-[#2b2827] bg-ink px-5 py-4 text-[13px] text-bone">
          <span className="text-signal">✓</span>
          You&rsquo;re on the list. First issue lands within the week.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@company.co.za"
            maxLength={MAX_LENGTHS.email}
            className="sl-field flex-1 rounded-[2px] border border-[#2b2827] bg-ink px-[13px] py-3 text-[13px] text-bone outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className={
              "shrink-0 rounded-[2px] border border-signal px-[22px] py-3 text-[12px] font-bold tracking-[0.06em] transition-all " +
              (sending ? "cursor-wait bg-[#241412] text-signal" : "cursor-pointer bg-signal text-ink")
            }
          >
            {sending ? "SUBSCRIBING…" : "SUBSCRIBE →"}
          </button>
        </form>
      )}
      {error && (
        <div className="mt-3 border border-[#4d3520] bg-[#1a1210] px-3.5 py-3 text-[12px] leading-[1.6] text-[#f2c98b]">
          {error}
        </div>
      )}
    </div>
  );
}
