import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ImageConverterTool } from "@/components/workshop/ImageConverterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("image-converter")!;

export const metadata: Metadata = toolMetadata(tool);

export default function ImageConverterPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <ImageConverterTool />
    </WorkshopToolShell>
  );
}
