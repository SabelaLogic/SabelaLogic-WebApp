import { PHASES } from "@/lib/data/site-content";
import { AccentText } from "./AccentText";
import { LiveDot } from "./LiveDot";

export function ProcessSection() {
  return (
    <section id="process" className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
          <LiveDot />
          03 / PROCESS
        </div>
        <h2 className="mb-[18px] font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
          <AccentText text="Ten days, accounted for." />
        </h2>
        <p className="mb-11 max-w-[58ch] text-[14px] leading-[1.75] text-bone-dim">
          This is the actual shape of a web app MVP. Deploys go live on day two — you watch it get built
          rather than waiting for a reveal.
        </p>
        <div className="grid gap-px border border-hairline bg-hairline">
          {PHASES.map((ph) => (
            <div
              key={ph.day}
              className="grid grid-cols-[96px_1fr] items-start gap-[clamp(16px,3vw,36px)] bg-ink-raised px-[clamp(16px,2.4vw,26px)] py-[22px] transition-colors hover:bg-[#121010]"
            >
              <div className="pt-0.5 font-display text-[14px] font-extrabold tracking-[0.04em] text-signal">
                {ph.day}
              </div>
              <div className="flex flex-col gap-[9px]">
                <span className="text-[15px] font-bold tracking-[-0.01em]">{ph.title}</span>
                <span className="max-w-[70ch] text-[12.5px] leading-[1.72] text-bone-dim" style={{ textWrap: "pretty" }}>
                  {ph.body}
                </span>
                <span className="text-[11px] tracking-[0.05em] text-grey-darker">DELIVERABLE — {ph.out}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
