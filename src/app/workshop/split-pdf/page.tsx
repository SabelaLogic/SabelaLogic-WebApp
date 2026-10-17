import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { SplitPdfTool } from "@/components/workshop/SplitPdfTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("split-pdf")!;

export const metadata: Metadata = toolMetadata(tool);

export default function SplitPdfPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <SplitPdfTool />
    </WorkshopToolShell>
  );
}
