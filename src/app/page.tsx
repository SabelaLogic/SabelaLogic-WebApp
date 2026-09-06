import { Nav } from "@/components/marketing/Nav";
import { SectionRail } from "@/components/marketing/SectionRail";
import { Hero } from "@/components/marketing/Hero";
import { TechMarquee } from "@/components/marketing/TechMarquee";
import { BrandShowcase } from "@/components/marketing/BrandShowcase";
import { TurnaroundSection } from "@/components/marketing/TurnaroundSection";
import { WorkSection } from "@/components/marketing/WorkSection";
import { ProofSection } from "@/components/marketing/ProofSection";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { BuildLogSection } from "@/components/marketing/BuildLogSection";
import { GeneratorSection } from "@/components/marketing/GeneratorSection";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { ContactSection } from "@/components/marketing/ContactSection";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="max-w-full overflow-x-hidden bg-ink font-mono">
      <Nav />
      <SectionRail />
      <main id="main-content">
        <Hero />
        <TechMarquee />
        <BrandShowcase />
        <TurnaroundSection />
        <WorkSection />
        <ProofSection />
        <ProcessSection />
        <BuildLogSection />
        <GeneratorSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
