import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { WORKSHOP_TOOLS } from "@/lib/data/workshop-tools";
import { AccentText } from "@/components/marketing/AccentText";

export const metadata: Metadata = {
  title: "Workshop Tools — Sabela Logic",
  description: "Free tools that run entirely in your browser — no signup, nothing uploaded.",
};

export default function WorkshopIndex() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">WORKSHOP</div>
            <h1 className="mb-5 max-w-[22ch] font-display text-[clamp(30px,4.8vw,56px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              <AccentText text="Free tools. No signup. Nothing uploaded." />
            </h1>
            <p className="mb-14 max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              Small utilities built the same way everything else here is built — fast, honest about what they do,
              and yours to use without an account. Most run entirely in your browser; nothing you paste or drop
              in leaves your device.
            </p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px border border-hairline bg-hairline">
              {WORKSHOP_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/workshop/${tool.slug}`}
                  className="sl-card-hover flex flex-col gap-4 border border-transparent bg-ink px-[clamp(18px,2.4vw,28px)] py-[clamp(20px,2.8vw,30px)]"
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] text-grey-darker">
                    <span className="text-signal">{tool.tag}</span>
                  </div>
                  <h2 className="m-0 font-display text-[19px] font-semibold leading-[1.24] tracking-[-0.01em]">
                    <AccentText text={tool.name} />
                  </h2>
                  <p className="m-0 flex-1 text-[12.5px] leading-[1.7] text-bone-dim" style={{ textWrap: "pretty" }}>
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-grey">
                    <span>{tool.tagline}</span>
                    <span className="text-signal">OPEN →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
