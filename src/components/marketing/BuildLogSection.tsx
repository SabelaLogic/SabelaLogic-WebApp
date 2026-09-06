import { BUILD_LOG, TICKER_ITEMS } from "@/lib/data/site-content";
import { AccentText } from "./AccentText";

export function BuildLogSection() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section id="build-log" className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(28px,5vw,64px)]">
        <div>
          <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">04 / BUILD LOG</div>
          <h2 className="mb-4 font-display text-[clamp(26px,3.6vw,42px)] leading-[1.06] font-extrabold tracking-[-0.025em]">
            <AccentText text="Cadence, not promises." />
          </h2>
          <p className="mb-[34px] max-w-[40ch] text-[13px] leading-[1.75] text-grey">
            Recent commits across the estate. Dated where the repository records a date.
          </p>

          <div className="mb-3.5 text-[10px] tracking-[0.2em] text-grey-darker">
            WHAT THE WORK CONSISTS OF
          </div>
          <div
            className="sl-ticker relative h-[clamp(210px,26vw,300px)] overflow-hidden border-l border-hairline pl-5"
            tabIndex={0}
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
            }}
          >
            <div className="sl-ticker-track flex flex-col gap-4 will-change-transform">
              {items.map((label, i) => (
                <span
                  key={i}
                  aria-hidden={i >= TICKER_ITEMS.length}
                  className="text-[15px] font-bold tracking-[-0.01em] whitespace-nowrap"
                  style={{ color: i % 3 === 2 ? "#e04a3a" : i % 2 === 0 ? "#f2efe9" : "#8a857f" }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {BUILD_LOG.map((l, i) => (
            <div key={i} className="grid grid-cols-[14px_1fr] gap-4 pb-6">
              <div className="flex flex-col items-center gap-1 pt-[5px]">
                <span className="sl-commit-pulse h-[7px] w-[7px] flex-shrink-0 rounded-full bg-signal" />
                <span className="w-px grow bg-hairline" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[13px] font-bold">{l.repo}</span>
                  <span className="text-[10.5px] tracking-[0.08em] text-grey-darker">{l.when}</span>
                </div>
                <span className="text-[12px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                  {l.what}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
