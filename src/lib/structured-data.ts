import type { ToolFaq } from "@/lib/data/workshop-content";

/** FAQPage JSON-LD for the questions rendered visibly under a tool. */
export function faqJsonLd(faqs: ToolFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
