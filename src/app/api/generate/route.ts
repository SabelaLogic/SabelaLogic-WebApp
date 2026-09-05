import { NextResponse } from "next/server";

// INTEGRATION POINT — architecture generator.
// Runs server-side so no model key is ever shipped to the client. Wire ANTHROPIC_API_KEY
// (or your preferred provider) below; until configured this returns a clear error and the
// UI asks the visitor to send the brief directly instead.

const SYSTEM_PROMPT = `You are Lunga Xhamela, a solo software architect based in Pretoria, Rustenburg, Bloemfontein, Cape Town and Port Elizabeth, South Africa, writing a build brief for a prospective client. Be concrete and technical but readable by a non-engineer. Favour stacks that are cheap to run and fast to ship: Next.js, Supabase/Postgres, Cloudflare Workers with D1 and R2, Firebase, PayFast for South African payments, BulkSMS or Clickatell for SMS. Never invent prices. Use plain hyphens and ASCII only, no markdown asterisks or hashes. Output EXACTLY these five sections, each header on its own line in capitals followed by a blank line:

RECOMMENDED STACK
DATA MODEL
THE RISKY PART
BUILD SCHEDULE
WHAT I WOULD CUT FROM V1

Under BUILD SCHEDULE use lines of the form "Day 1-2  -  what happens". Keep the whole response under 400 words.`;

export async function POST(request: Request) {
  const { brief, kind } = (await request.json().catch(() => ({}))) as {
    brief?: string;
    kind?: string;
  };

  if (!brief || brief.trim().length < 12) {
    return NextResponse.json({ error: "Give me a sentence or two more." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Architecture generator is not connected yet." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1600,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Project type: ${kind || "Web app MVP"}\n\nWhat the client wants:\n${brief}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    const text = data?.content?.[0]?.text ?? "";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "The generator could not be reached just now." }, { status: 502 });
  }
}
