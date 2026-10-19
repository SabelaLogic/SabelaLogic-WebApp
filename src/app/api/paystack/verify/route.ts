import { NextResponse } from "next/server";

// Verifies a Paystack transaction server-side. PAYSTACK_SECRET_KEY must be set
// as an env var / Cloudflare secret (`wrangler secret put PAYSTACK_SECRET_KEY`).
// It is never hardcoded or sent to the browser. If it is unset we fail softly.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { reference?: string };
  const reference = (body.reference ?? "").trim();
  if (!/^[A-Za-z0-9._=-]{1,100}$/.test(reference)) {
    return NextResponse.json({ ok: false, error: "Invalid reference." }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, pending: true, error: "Payment received by Paystack; confirmation will follow by email." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: { status?: string; amount?: number; currency?: string; customer?: { email?: string } };
    };
    const d = json.data;
    if (!res.ok || d?.status !== "success") {
      return NextResponse.json({ ok: false, error: "Payment not confirmed." }, { status: 402 });
    }
    return NextResponse.json({ ok: true, amount: d.amount, currency: d.currency });
  } catch {
    return NextResponse.json({ ok: false, pending: true, error: "Could not reach Paystack." }, { status: 502 });
  }
}
