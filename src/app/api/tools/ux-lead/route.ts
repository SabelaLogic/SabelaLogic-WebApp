import { NextResponse } from "next/server";
import { isValidEmail, MAX_LENGTHS, withinMax } from "@/lib/validation";

// Captures the email a visitor enters to unlock their full UX Analyzer report.
// Reuses CONTACT_WEBHOOK_URL — this is the same "new lead" notification as the
// contact form, just sourced from the free tool instead of the brief form.

interface LeadBody {
  email?: string;
  url?: string;
  score?: number;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LeadBody;
  const email = body.email?.trim() ?? "";
  const scannedUrl = body.url?.trim() ?? "";

  if (!isValidEmail(email) || !withinMax(email, MAX_LENGTHS.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!scannedUrl || !withinMax(scannedUrl, 2000)) {
    return NextResponse.json({ error: "Missing the scanned URL." }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    // No destination configured yet — still let the visitor see their report.
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "workshop-ux-analyzer",
        email,
        scannedUrl,
        score: typeof body.score === "number" ? body.score : null,
      }),
    });
    return NextResponse.json({ ok: true, delivered: res.ok });
  } catch {
    return NextResponse.json({ ok: true, delivered: false });
  }
}
