import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ImageToPdfTool } from "@/components/workshop/ImageToPdfTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("image-to-pdf")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageToPdfPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <ImageToPdfTool />
    </WorkshopToolShell>
  );
}
