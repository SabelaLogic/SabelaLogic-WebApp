import { ImageResponse } from "next/og";
import { WORKSHOP_TOOLS } from "@/lib/data/workshop-tools";

// Open Graph / Twitter share cards (1200x630 PNG), one per page type.
// force-static + generateStaticParams means every card is rendered once at
// build time and served from the cache — no per-request image work on Workers.
export const dynamic = "force-static";
export const dynamicParams = false;

const INK = "#080807";
const BONE = "#f2efe9";
const BONE_DIM = "#a9a5a0";
const SIGNAL = "#e04a3a";
const HAIRLINE = "#262422";

const TOOL_EYEBROW: Record<string, string> = {
  TEXT: "FREE TOOL · TEXT",
  CODE: "FREE TOOL · CODE",
  IMAGE: "FREE TOOL · IMAGE",
  SCAN: "FREE TOOL · SCAN",
};

const CARDS: Record<string, { eyebrow: string; title: string; sub: string }> = {
  default: {
    eyebrow: "SOFTWARE · AUTOMATION · AI",
    title: "Systems that ship.",
    sub: "Software, automation and AI, built end to end for clients anywhere.",
  },
  workshop: {
    eyebrow: "FREE ONLINE TOOLS",
    title: "Free tools. No signup. Nothing uploaded.",
    sub: "Word counter, JSON formatter, image compressor, image to PDF and more.",
  },
  ...Object.fromEntries(
    WORKSHOP_TOOLS.map((t) => [
      t.slug,
      { eyebrow: TOOL_EYEBROW[t.tag] ?? "FREE TOOL", title: t.heading, sub: t.seoDescription },
    ]),
  ),
};

export function generateStaticParams() {
  return Object.keys(CARDS).map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = CARDS[slug] ?? CARDS.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          border: `2px solid ${HAIRLINE}`,
          padding: "72px 80px",
          color: BONE,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 64, height: 6, background: SIGNAL, marginBottom: 28 }} />
          <div style={{ fontSize: 26, letterSpacing: 4, color: SIGNAL }}>{card.eyebrow}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: card.title.length > 30 ? 64 : 80,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {card.title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.4, color: BONE_DIM, marginTop: 24, maxWidth: 1000 }}>
            {card.sub}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: 8 }}>
            <span>SABELA L</span>
            <span style={{ color: SIGNAL }}>O</span>
            <span>GIC</span>
          </div>
          <div style={{ fontSize: 24, color: BONE_DIM }}>[REDACTED].co.za</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
