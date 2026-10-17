import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ImageCompressorTool } from "@/components/workshop/ImageCompressorTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("image-compressor")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageCompressorPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <ImageCompressorTool />
    </WorkshopToolShell>
  );
}
