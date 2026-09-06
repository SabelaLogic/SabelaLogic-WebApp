import { SERVICES } from "@/lib/data/site-content";
import { AccentText } from "./AccentText";
import { LiveDot } from "./LiveDot";

const SHOW_PRICING = true;

export function ServicesSection() {
  return (
    <section id="services" className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
          <LiveDot />
          06 / SERVICES
        </div>
        <h2 className="mb-11 font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
          <AccentText text="What you can hire me for." />
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {SERVICES.map((sv) => (
            <div
              key={sv.name}
              className="flex flex-col gap-4 border border-hairline bg-ink px-[22px] py-[26px] transition-colors hover:border-hairline-hover"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-bold tracking-[-0.01em]">{sv.name}</span>
                <span className="whitespace-nowrap text-[10.5px] tracking-[0.1em] text-signal">{sv.time}</span>
              </div>
              <p className="m-0 text-[12.5px] leading-[1.72] text-bone-dim" style={{ textWrap: "pretty" }}>
                {sv.body}
              </p>
              <div className="mt-auto flex flex-col gap-2 border-t border-hairline-soft pt-2">
                {sv.items.map((it) => (
                  <div key={it} className="flex items-start gap-[9px]">
                    <span className="text-[11px] leading-[1.7] text-signal">→</span>
                    <span className="text-[11.5px] leading-[1.7] text-grey">{it}</span>
                  </div>
                ))}
              </div>
              {SHOW_PRICING && (
                <div className="border-t border-hairline-soft pt-2 text-[12px] text-bone">{sv.price}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
