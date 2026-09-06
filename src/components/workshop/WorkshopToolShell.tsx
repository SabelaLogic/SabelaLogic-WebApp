import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import type { WorkshopTool } from "@/lib/data/workshop-tools";
import { AccentText } from "@/components/marketing/AccentText";

export function WorkshopToolShell({ tool, children }: { tool: WorkshopTool; children: ReactNode }) {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(48px,6vw,72px)]">
          <div className="mx-auto max-w-[860px]">
            <Link
              href="/workshop"
              className="mb-6 inline-flex items-center gap-2 text-[11.5px] tracking-[0.08em] text-grey hover:text-signal"
            >
              ← ALL WORKSHOP TOOLS
            </Link>
            <div className="mb-3.5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-signal">
              <span>{tool.tag}</span>
              <span className="text-grey-darker">·</span>
              <span className="text-grey">FREE — RUNS IN YOUR BROWSER</span>
            </div>
            <h1 className="mb-4 font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.06] tracking-[-0.025em]">
              <AccentText text={tool.name} />
            </h1>
            <p className="mb-10 max-w-[60ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              {tool.description}
            </p>
            {children}
          </div>
        </section>
        <section className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(32px,4vw,48px)]">
          <div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-1.5 text-[11px] tracking-[0.18em] text-signal">NEED SOMETHING MORE?</div>
              <p className="m-0 text-[13px] leading-[1.6] text-bone-dim">
                Free tools cover the basics. For a real system built around your business, start a build.
              </p>
            </div>
            <a
              href="/start-a-build"
              className="sl-btn-outline flex shrink-0 items-center gap-[7px] rounded-[2px] border border-signal px-5 py-3 text-[12px] font-bold tracking-[0.06em] text-signal"
            >
              START A BUILD →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
