import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { GeneratorSection } from "@/components/marketing/GeneratorSection";
import { ContactSection } from "@/components/marketing/ContactSection";
import { AccentText } from "@/components/marketing/AccentText";
import { LiveDot } from "@/components/marketing/LiveDot";
import Link from "next/link";
import { FaqList, StepList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/structured-data";
import { START_A_BUILD_FAQS, START_A_BUILD_STEPS } from "@/lib/data/page-content";
import { SERVICES, SLA } from "@/lib/data/site-content";

export const metadata: Metadata = pageMetadata({
  title: "Start a Build: Get a Fixed Quote in 24 Hours — Sabela Logic",
  description:
    "Describe what you want built, get an instant architecture plan, then send the brief for a fixed quote and delivery date within 24 hours.",
  path: "/start-a-build",
});

export default function StartABuildPage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <JsonLd data={faqJsonLd(START_A_BUILD_FAQS)} />
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-3.5 flex items-center gap-2 text-[11px] tracking-[0.22em] text-signal">
              <LiveDot />
              START A BUILD
            </div>
            <h1 className="mb-5 max-w-[24ch] font-display text-[clamp(30px,4.8vw,56px)] font-extrabold leading-[1.04] tracking-[-0.025em]">
              <AccentText text="Two steps. Leave with a plan and a quote in motion." />
            </h1>
            <p className="max-w-[62ch] text-[14px] leading-[1.75] text-bone-dim" style={{ textWrap: "pretty" }}>
              Describe it below and get an instant architecture plan — stack, data model, risky parts, schedule.
              Then send the brief through and you&rsquo;ll have a fixed quote and delivery date back within 24
              hours.
            </p>
          </div>
        </section>
        <GeneratorSection eyebrow="STEP 1 / DESCRIBE IT" />
        <ContactSection eyebrow="STEP 2 / SEND THE BRIEF" />

        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(40px,5vw,64px)]">
          <div className="mx-auto flex max-w-[1000px] flex-col gap-12">
            <div>
              <h2 className="mb-5 font-display text-[clamp(20px,2.6vw,26px)] font-semibold tracking-[-0.01em]">
                What happens after you send the brief
              </h2>
              <StepList steps={START_A_BUILD_STEPS} />
            </div>

            <div>
              <h2 className="mb-5 font-display text-[clamp(20px,2.6vw,26px)] font-semibold tracking-[-0.01em]">
                Typical scopes, turnaround and starting prices
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13px] text-bone-dim">
                  <thead>
                    <tr className="border-b border-hairline text-[11px] tracking-[0.14em] text-grey">
                      <th className="py-2.5 pr-4 font-normal">BUILD</th>
                      <th className="py-2.5 pr-4 font-normal">TURNAROUND</th>
                      <th className="py-2.5 font-normal">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES.map((s) => (
                      <tr key={s.name} className="border-b border-hairline align-top">
                        <td className="py-3 pr-4">
                          <span className="font-semibold text-bone">{s.name}</span>
                          <br />
                          <span className="text-[12px]">{s.body}</span>
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">{s.time}</td>
                        <td className="py-3 whitespace-nowrap">{s.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 mb-0 text-[12px] text-grey">
                Turnaround is quoted from brief acceptance.{" "}
                {SLA.filter((s) => s.what === "Bug fixes").map((s) => `${s.what}: ${s.time.toLowerCase()} — ${s.note}`)}
              </p>
            </div>

            <FaqList faqs={START_A_BUILD_FAQS} />

            <p className="m-0 text-[12px] text-grey">
              Need a small, defined setup instead?{" "}
              <Link href="/services" className="text-signal underline-offset-4 hover:underline">
                See the fixed-price services →
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
