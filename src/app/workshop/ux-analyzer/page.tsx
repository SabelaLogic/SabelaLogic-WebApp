import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { UxAnalyzerTool } from "@/components/workshop/UxAnalyzerTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("ux-analyzer")!;

export const metadata: Metadata = toolMetadata(tool);

export default function UxAnalyzerPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <UxAnalyzerTool />
    </WorkshopToolShell>
  );
}
