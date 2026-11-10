import { NextResponse } from "next/server";
import { isValidEmail, MAX_LENGTHS, withinMax } from "@/lib/validation";
import { getDb } from "@/lib/db";

// Signups are stored in D1 (newsletter_signups) as the source of truth, so a
// subscriber is never lost to a third party being down or unconfigured.
// NEWSLETTER_WEBHOOK_URL is optional on top of that: set it to a Zapier Catch
// Hook (or Mailchimp/ConvertKit endpoint) and each signup is forwarded there
// too. A forwarding failure does not fail the signup — we keep the row and
// mark forwarded = 0 so it can be replayed later.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    source?: string;
  };
  const email = body.email?.trim().toLowerCase() ?? "";
  const source = body.source ?? "sabelalogic.co.za";

  if (!withinMax(email, MAX_LENGTHS.email) || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  let forwarded = false;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      forwarded = res.ok;
    } catch {
      forwarded = false;
    }
  }

  try {
    const db = await getDb();
    await db
      .prepare(
        `INSERT INTO newsletter_signups (id, email, source, forwarded)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
           source = excluded.source,
           forwarded = MAX(newsletter_signups.forwarded, excluded.forwarded)`,
      )
      .bind(crypto.randomUUID(), email, source, forwarded ? 1 : 0)
      .run();
    return NextResponse.json({ ok: true });
  } catch {
    // The row is what matters. If D1 is unreachable but the webhook took it,
    // the subscriber still landed somewhere — don't show them an error.
    if (forwarded) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { error: "Could not subscribe right now. Try again shortly." },
      { status: 502 },
    );
  }
}
