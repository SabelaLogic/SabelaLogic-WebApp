import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { DiffCheckerTool } from "@/components/workshop/DiffCheckerTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("diff-checker")!;

export const metadata: Metadata = toolMetadata(tool);

export default function DiffCheckerPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <DiffCheckerTool />
    </WorkshopToolShell>
  );
}
