import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { UxAnalyzerTool } from "@/components/workshop/UxAnalyzerTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";

export const metadata: Metadata = {
  title: "Website UX Analyzer — Sabela Logic Workshop",
  description: "Free instant structural scan of any website across simplicity, navigation, performance and accessibility.",
};

export default function UxAnalyzerPage() {
  const tool = getWorkshopTool("ux-analyzer")!;
  return (
    <WorkshopToolShell tool={tool}>
      <UxAnalyzerTool />
    </WorkshopToolShell>
  );
}
