import { CASES, ENGINEERING, FLOW, HARDENING, RR_SCREENS } from "@/lib/data/site-content";
import { Carousel } from "./Carousel";

export function ProofSection() {
  return (
    <section id="proof" className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">02 / CASE STUDIES</div>
        <h2 className="mb-[18px] max-w-[22ch] font-display text-[clamp(28px,4.4vw,52px)] leading-[1.04] font-extrabold tracking-[-0.025em]">
          Three builds, with the reasoning left in.
        </h2>
        <p className="mb-12 max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
          Problem, decision, result. No invented metrics — every claim below is a live URL, a structural
          choice with a stated reason, or an event that actually ran on the system.
        </p>

        <div className="mb-11 flex flex-col gap-px border border-hairline bg-hairline">
          {CASES.map((c) => (
            <div key={c.no} className="bg-ink px-[clamp(18px,2.8vw,34px)] py-[clamp(22px,3.4vw,38px)]">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3.5">
                <span className="text-[10.5px] tracking-[0.2em] text-signal">{c.no}</span>
                <span
                  className="rounded-[2px] border px-[9px] py-1 text-[9.5px] tracking-[0.14em]"
                  style={{ color: c.tone, borderColor: c.tone }}
                >
                  {c.status}
                </span>
              </div>
              <h3 className="mb-[22px] font-display text-[clamp(22px,2.9vw,34px)] leading-[1.14] font-semibold tracking-[-0.02em]">
                {c.name}
              </h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[clamp(18px,2.6vw,32px)]">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] tracking-[0.18em] text-grey-darker">THE PROBLEM</span>
                  <p className="m-0 text-[12.5px] leading-[1.78] text-bone-dim" style={{ textWrap: "pretty" }}>
                    {c.problem}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] tracking-[0.18em] text-grey-darker">THE BUILD</span>
                  <p className="m-0 text-[12.5px] leading-[1.78] text-bone-dim" style={{ textWrap: "pretty" }}>
                    {c.build}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] tracking-[0.18em] text-grey-darker">THE RESULT</span>
                  <p className="m-0 text-[12.5px] leading-[1.78] text-bone-bright" style={{ textWrap: "pretty" }}>
                    {c.result}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-[26px] gap-y-2.5">
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-[9px] text-[11.5px] tracking-[0.08em] text-signal hover:text-signal-hover"
                  >
                    {c.cta} ↗
                  </a>
                )}
                {c.href2 && (
                  <a
                    href={c.href2}
                    className="inline-flex items-center gap-[9px] text-[11.5px] tracking-[0.08em] text-grey hover:text-bone"
                  >
                    {c.cta2} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 text-[10.5px] tracking-[0.18em] text-grey-darker">
          INSIDE CASE 03 — HOW A PAID VOTE SETTLES
        </div>

        <div className="mb-10 border border-hairline bg-ink p-[clamp(20px,3vw,36px)]">
          <div className="mb-[26px] text-[10.5px] tracking-[0.18em] text-grey-darker">
            REQUEST PATH — SCAN TO SETTLED VOTE
          </div>
          <div className="sl-flow flex flex-wrap items-stretch gap-2.5">
            {FLOW.map((n) => (
              <div
                key={n.tag}
                className="sl-flow-node flex min-w-[138px] flex-[1_1_138px] flex-col gap-2 border border-[#2b2827] bg-[#100f0e] px-3.5 py-[15px]"
                style={{ borderLeft: `2px solid ${n.tone}` }}
              >
                <span className="text-[9.5px] tracking-[0.12em]" style={{ color: n.tone }}>
                  {n.tag}
                </span>
                <span className="text-[12.5px] leading-[1.35] font-bold">{n.title}</span>
                <span className="text-[10.5px] leading-[1.6] text-grey">{n.detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px] border-t border-hairline pt-5">
            {HARDENING.map((h) => (
              <div key={h} className="flex items-start gap-2.5">
                <span className="text-[12px] leading-[1.6] text-signal">▪</span>
                <span className="text-[11.5px] leading-[1.65] text-bone-dim">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 text-[10.5px] tracking-[0.18em] text-grey-darker">
          SEE IT IN THE ROOM — REDEEMED &amp; RISING AWARDS
        </div>
        <div className="mb-10">
          <Carousel slides={RR_SCREENS} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {ENGINEERING.map((e) => (
            <div key={e.head} className="border border-hairline bg-ink px-5 py-6">
              <div className="mb-3.5 text-[11px] tracking-[0.14em] text-signal">{e.head}</div>
              <p className="m-0 text-[12.5px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
                {e.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
