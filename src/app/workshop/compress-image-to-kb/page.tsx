import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { CompressToKbTool } from "@/components/workshop/CompressToKbTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("compress-image-to-kb")!;

export const metadata: Metadata = toolMetadata(tool);

export default function CompressToKbPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <CompressToKbTool />
    </WorkshopToolShell>
  );
}
