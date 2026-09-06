import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { GeneratorSection } from "@/components/marketing/GeneratorSection";
import { ContactSection } from "@/components/marketing/ContactSection";
import { AccentText } from "@/components/marketing/AccentText";

export const metadata: Metadata = {
  title: "Start a Build — Sabela Logic",
  description:
    "Describe what you want built, get an instant architecture plan, then send the brief straight through for a fixed quote.",
};

export default function StartABuildPage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono text-bone">
      <Nav />
      <main id="main-content">
        <section className="border-b border-hairline px-[clamp(16px,4vw,48px)] py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-3.5 text-[11px] tracking-[0.22em] text-signal">START A BUILD</div>
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
      </main>
      <Footer />
    </div>
  );
}
