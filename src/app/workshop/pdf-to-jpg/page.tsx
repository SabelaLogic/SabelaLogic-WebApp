import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { PdfToJpgTool } from "@/components/workshop/PdfToJpgTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("pdf-to-jpg")!;

export const metadata: Metadata = toolMetadata(tool);

export default function PdfToJpgPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <PdfToJpgTool />
    </WorkshopToolShell>
  );
}
