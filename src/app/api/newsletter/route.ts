import { NextResponse } from "next/server";
import { isValidEmail, MAX_LENGTHS, withinMax } from "@/lib/validation";

// INTEGRATION POINT — newsletter signup. Wire NEWSLETTER_WEBHOOK_URL to a real
// list (Mailchimp, ConvertKit, a serverless function that appends to a sheet).
// Until configured this returns an error and the client shows a fallback.

interface NewsletterBody {
  email?: string;
  source?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as NewsletterBody;
  const email = body.email?.trim() ?? "";

  if (!withinMax(email, MAX_LENGTHS.email) || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Newsletter signup is not connected yet." }, { status: 503 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: body.source ?? "sabelalogic.co.za" }),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not subscribe right now. Try again shortly." }, { status: 502 });
  }
}
