import { NextResponse } from "next/server";
import { MAX_LENGTHS, withinMax } from "@/lib/validation";

// INTEGRATION POINT — contact form. Wire CONTACT_WEBHOOK_URL to a real inbox (Formspree,
// a serverless email sender, a CRM webhook). Until configured this returns an error and the
// client falls back to opening WhatsApp with the brief pre-composed.

interface ContactBody {
  name?: string;
  contact?: string;
  type?: string;
  when?: string;
  brief?: string;
  source?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ContactBody;

  if (!body.name?.trim() || !body.contact?.trim() || !body.brief?.trim()) {
    return NextResponse.json({ error: "Name, contact and brief are required." }, { status: 400 });
  }

  if (
    !withinMax(body.name, MAX_LENGTHS.name) ||
    !withinMax(body.contact, MAX_LENGTHS.contact) ||
    !withinMax(body.type ?? "", MAX_LENGTHS.type) ||
    !withinMax(body.when ?? "", MAX_LENGTHS.when) ||
    !withinMax(body.brief, MAX_LENGTHS.brief)
  ) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Contact routing is not connected yet." }, { status: 503 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not reach the inbox." }, { status: 502 });
  }
}
