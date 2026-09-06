const STACK = [
  "NEXT.JS",
  "CLOUDFLARE WORKERS",
  "SUPABASE",
  "POSTGRES",
  "PAYFAST",
  "BULKSMS",
  "D1",
  "R2",
  "GITHUB ACTIONS",
  "THREE.JS",
  "TYPESCRIPT",
  "VERCEL",
];

export function TechMarquee() {
  const items = [...STACK, ...STACK];

  return (
    <div className="sl-marquee border-b border-hairline bg-ink-raised py-4">
      <div className="sl-marquee-track">
        <div className="sl-marquee-row">
          {items.map((item, i) => (
            <span key={i} aria-hidden={i >= STACK.length}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
