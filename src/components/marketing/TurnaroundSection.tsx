import { SLA } from "@/lib/data/site-content";

export function TurnaroundSection() {
  return (
    <section className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(40px,5vw,64px)]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="m-0 text-[12px] font-medium tracking-[0.22em] text-grey">
            TURNAROUND — WHAT I COMMIT TO
          </h2>
          <span className="text-[11px] text-grey-darker">
            Quoted from brief acceptance. Miss it and the overrun is on me.
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
          {SLA.map((t) => (
            <div
              key={t.what}
              className="border border-hairline border-t-2 border-t-signal bg-ink px-5 py-6 transition-colors duration-200 ease-linear hover:border-hairline-hover hover:border-t-signal"
            >
              <div className="mb-2.5 font-display text-[clamp(28px,3.6vw,40px)] leading-none font-extrabold tracking-[-0.02em]">
                {t.time}
              </div>
              <div className="mb-2 text-[13px] font-medium text-bone">{t.what}</div>
              <div className="text-[11.5px] leading-[1.6] text-grey">{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
