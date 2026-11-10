import type { ToolFaq } from "@/lib/data/workshop-content";

/**
 * Visible FAQ list, server-rendered so the answers are in the raw HTML that
 * crawlers fetch. Pair it with faqJsonLd() using the same array so the
 * structured data always matches what's on the page.
 */
export function FaqList({ faqs, heading = "Frequently asked questions" }: { faqs: ToolFaq[]; heading?: string }) {
  if (faqs.length === 0) return null;
  return (
    <div>
      <h2 className="mb-5 font-display text-[clamp(20px,2.6vw,26px)] font-semibold tracking-[-0.01em]">{heading}</h2>
      <div className="flex flex-col border-t border-hairline">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-hairline py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[13.5px] font-semibold text-bone marker:hidden">
              <h3 className="m-0 text-[13.5px] font-semibold">{f.q}</h3>
              <span className="text-signal transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mb-0 mt-3 max-w-[68ch] text-[13px] leading-[1.8] text-bone-dim">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Numbered steps in the same style as the Workshop "How to use" lists. */
export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3.5 text-[13.5px] leading-[1.75] text-bone-dim">
          <span className="mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center border border-hairline text-[11px] text-signal">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
