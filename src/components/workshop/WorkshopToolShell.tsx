import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { getWorkshopTool, type WorkshopTool } from "@/lib/data/workshop-tools";
import { getToolContent } from "@/lib/data/workshop-content";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";
import { JsonLd } from "@/components/seo/JsonLd";
import { toolJsonLd } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import { PaystackDepositButton } from "@/components/monetization/PaystackDepositButton";
import { GUMROAD_BASE, TOOL_GUMROAD, TOOL_SETUP_DEPOSIT_ZAR } from "@/lib/monetization/config";

export function WorkshopToolShell({ tool, children }: { tool: WorkshopTool; children: ReactNode }) {
  const content = getToolContent(tool.slug);
  const gumroad = TOOL_GUMROAD[tool.slug];
  const related = (content?.related ?? []).map(getWorkshopTool).filter((t): t is WorkshopTool => !!t);

  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <JsonLd data={toolJsonLd(tool)} />
      {content && content.faqs.length > 0 && <JsonLd data={faqJsonLd(content.faqs)} />}
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
            <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
              <LiveDot />
              <span>{tool.tag}</span>
              <span className="text-grey-darker">·</span>
              <span className="text-grey">{tool.runsInBrowser ? "FREE — RUNS IN YOUR BROWSER" : "FREE — NO SIGNUP"}</span>
            </div>
            <h1 className="mb-4 font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.06] tracking-[-0.025em]">
              <AccentText text={tool.heading} />
            </h1>
            <p className="mb-10 max-w-[60ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              {tool.description}
            </p>
            {children}
            <p className="mt-8 text-[11.5px] text-grey">
              Need something custom built?{" "}
              <Link href="/start-a-build" className="text-signal underline-offset-4 hover:underline">
                Start a build →
              </Link>
            </p>
          </div>
        </section>

        {content && (
          <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(40px,5vw,64px)]">
            <div className="mx-auto flex max-w-[860px] flex-col gap-12">
              <div>
                <h2 className="mb-5 font-display text-[clamp(20px,2.6vw,26px)] font-semibold tracking-[-0.01em]">
                  How to use {tool.name}
                </h2>
                <ol className="mb-6 flex list-none flex-col gap-3 p-0">
                  {content.steps.map((step, i) => (
                    <li key={i} className="flex gap-3.5 text-[13.5px] leading-[1.75] text-bone-dim">
                      <span className="mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center border border-hairline text-[11px] text-signal">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {content.body.map((para, i) => (
                  <p key={i} className="mb-4 max-w-[68ch] text-[13.5px] leading-[1.8] text-bone-dim" style={{ textWrap: "pretty" }}>
                    {para}
                  </p>
                ))}
              </div>

              {content.faqs.length > 0 && (
                <div>
                  <h2 className="mb-5 font-display text-[clamp(20px,2.6vw,26px)] font-semibold tracking-[-0.01em]">
                    Frequently asked questions
                  </h2>
                  <div className="flex flex-col border-t border-hairline">
                    {content.faqs.map((f) => (
                      <details key={f.q} className="group border-b border-hairline py-4">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[13.5px] font-semibold text-bone marker:hidden">
                          <h3 className="m-0 text-[13.5px] font-semibold">{f.q}</h3>
                          <span className="text-signal transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                        </summary>
                        <p className="mb-0 mt-3 max-w-[68ch] text-[13px] leading-[1.8] text-bone-dim">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {related.length > 0 && (
                <div>
                  <h2 className="mb-4 text-[11px] font-normal tracking-[0.18em] text-grey">RELATED TOOLS</h2>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-px border border-hairline bg-hairline">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/workshop/${r.slug}`} className="sl-card-hover flex flex-col gap-1.5 bg-ink px-4 py-4">
                        <span className="text-[13px] font-semibold text-bone">{r.name}</span>
                        <span className="text-[11.5px] text-grey">{r.tagline}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="border-b border-hairline bg-ink-raised px-[clamp(16px,4vw,48px)] py-[clamp(32px,4vw,48px)]">
          <div className="mx-auto flex max-w-[860px] flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-1.5 text-[11px] tracking-[0.18em] text-signal">NEED SOMETHING MORE?</div>
              <p className="m-0 text-[13px] leading-[1.6] text-bone-dim">
                Free tools cover the basics. Want it set up around your business? Pay a deposit and I&rsquo;ll be in touch to scope it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PaystackDepositButton amountZar={TOOL_SETUP_DEPOSIT_ZAR} item={`workshop-setup:${tool.slug}`} />
              <Link href="/services" className="text-[12px] text-grey underline-offset-4 hover:text-signal hover:underline">
                Fixed-price services →
              </Link>
            </div>
          </div>
          {gumroad && (
            <p className="mx-auto mt-4 max-w-[860px] text-[12px] text-grey">
              Get the full version:{" "}
              <a
                href={`${GUMROAD_BASE}${gumroad.slug}`}
                target="_blank"
                rel="noopener"
                className="text-signal underline-offset-4 hover:underline"
              >
                {gumroad.title} →
              </a>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
