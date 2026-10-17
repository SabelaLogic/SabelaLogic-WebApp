import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { CsvJsonTool } from "@/components/workshop/CsvJsonTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("csv-to-json")!;

export const metadata: Metadata = toolMetadata(tool);

export default function CsvJsonPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <CsvJsonTool />
    </WorkshopToolShell>
  );
}
