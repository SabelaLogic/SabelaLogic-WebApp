"use client";

import { useState } from "react";
import { PAYSTACK_CURRENCY, PAYSTACK_PUBLIC_KEY } from "@/lib/monetization/config";

type PaystackPop = new () => {
  newTransaction: (opts: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

const SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

function loadPaystack(): Promise<PaystackPop> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve(window.PaystackPop);
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => (window.PaystackPop ? resolve(window.PaystackPop) : reject(new Error("no PaystackPop"))));
    s.addEventListener("error", () => reject(new Error("Paystack failed to load")));
  });
}

export function PaystackDepositButton({
  amountZar,
  label = "SET IT UP FOR ME →",
  item,
}: {
  amountZar: number;
  label?: string;
  /** What the deposit is for; stored in Paystack metadata. */
  item: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const Pop = await loadPaystack();
      new Pop().newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: Math.round(amountZar * 100),
        currency: PAYSTACK_CURRENCY,
        metadata: { item, custom_fields: [{ display_name: "Item", variable_name: "item", value: item }] },
        onSuccess: async (tx: { reference: string }) => {
          setStatus("Payment received — confirming…");
          const res = await fetch("/pay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: tx.reference }),
          }).catch(() => null);
          const json = (await res?.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
          setStatus(
            json?.ok
              ? `Deposit confirmed (ref ${tx.reference}). I'll email you within one business day to schedule.`
              : `Paystack reference ${tx.reference} received. ${json?.error ?? "I'll confirm by email."}`,
          );
          setBusy(false);
        },
        onCancel: () => {
          setStatus("Payment cancelled.");
          setBusy(false);
        },
        onError: () => {
          setStatus("Paystack could not start the payment. Please try again.");
          setBusy(false);
        },
      });
    } catch {
      setStatus("Could not load Paystack. Check your connection and try again.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sl-btn-outline flex shrink-0 items-center gap-[7px] rounded-[2px] border border-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-signal"
      >
        {label}
      </button>
    );
  }

  return (
    <form onSubmit={pay} className="flex w-full max-w-[420px] flex-col gap-2">
      <label className="text-[11px] tracking-[0.14em] text-grey" htmlFor={`pay-${item}`}>
        EMAIL FOR YOUR RECEIPT · DEPOSIT R{amountZar.toLocaleString("en-ZA")}
      </label>
      <div className="flex gap-2">
        <input
          id={`pay-${item}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-[2px] border border-hairline bg-ink px-3 py-2.5 text-[13px] text-bone"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-[2px] border border-signal bg-signal px-4 py-2.5 text-[12px] font-bold tracking-[0.06em] text-ink disabled:opacity-60"
        >
          {busy ? "…" : "PAY DEPOSIT"}
        </button>
      </div>
      {status && <p className="m-0 text-[12px] leading-[1.6] text-bone-dim" role="status">{status}</p>}
    </form>
  );
}
