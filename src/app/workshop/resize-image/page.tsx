import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ResizeImageTool } from "@/components/workshop/ResizeImageTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("resize-image")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ResizeImagePage() {
  return (
    <WorkshopToolShell tool={tool}>
      <ResizeImageTool />
    </WorkshopToolShell>
  );
}
