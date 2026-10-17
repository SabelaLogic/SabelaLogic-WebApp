import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { CaseConverterTool } from "@/components/workshop/CaseConverterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("case-converter")!;

export const metadata: Metadata = toolMetadata(tool);

export default function CaseConverterPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <CaseConverterTool />
    </WorkshopToolShell>
  );
}
