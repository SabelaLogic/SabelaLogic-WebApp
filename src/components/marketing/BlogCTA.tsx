import Link from "next/link";
import { SLA } from "@/lib/data/site-content";
import { AccentText } from "./AccentText";

export function BlogCTA() {
  return (
    <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-[clamp(24px,4vw,48px)] border border-hairline bg-ink-raised p-[clamp(24px,3.6vw,40px)]">
      <div>
        <div className="mb-2.5 text-[11px] tracking-[0.22em] text-signal">GOT A BUILD IN MIND?</div>
        <h2 className="mb-3 font-display text-[clamp(22px,2.8vw,30px)] font-extrabold leading-[1.12] tracking-[-0.02em]">
          <AccentText text="Describe it, get a plan back today." />
        </h2>
        <p className="mb-6 max-w-[46ch] text-[13.5px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
          The architecture generator turns a few sentences into a real build brief — stack, data model, schedule.
          No form to fill in first.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href="/start-a-build"
            className="sl-cta-primary flex items-center gap-[10px] rounded-[2px] bg-signal px-6 py-3.5 text-[13px] font-bold tracking-[0.06em] text-ink"
            style={{ boxShadow: "rgba(224,74,58,0.26) 0 1px 3px 0, rgba(0,0,0,0.5) 0 4px 8px 3px" }}
          >
            START A BUILD →
          </a>
          <Link href="/#contact" className="text-[12.5px] font-bold tracking-[0.02em] text-signal hover:text-signal-hover">
            or send a note directly
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border border-hairline bg-hairline">
        {SLA.slice(0, 2).map((s) => (
          <div key={s.what} className="bg-ink px-4 py-5">
            <div className="mb-1.5 font-display text-[clamp(22px,3vw,30px)] leading-none font-extrabold text-signal">
              {s.time}
            </div>
            <div className="text-[11px] leading-[1.5] tracking-[0.1em] text-grey">{s.what.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
