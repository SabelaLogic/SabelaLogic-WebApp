import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ImageCompressorTool } from "@/components/workshop/ImageCompressorTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";

export const metadata: Metadata = {
  title: "Image Compressor — Sabela Logic Workshop",
  description: "Free image compressor. Runs entirely in your browser — nothing is uploaded.",
};

export default function ImageCompressorPage() {
  const tool = getWorkshopTool("image-compressor")!;
  return (
    <WorkshopToolShell tool={tool}>
      <ImageCompressorTool />
    </WorkshopToolShell>
  );
}
