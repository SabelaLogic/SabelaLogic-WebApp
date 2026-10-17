import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { MergePdfTool } from "@/components/workshop/MergePdfTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("merge-pdf")!;

export const metadata: Metadata = toolMetadata(tool);

export default function MergePdfPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <MergePdfTool />
    </WorkshopToolShell>
  );
}
