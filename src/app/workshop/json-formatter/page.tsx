import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { JsonFormatterTool } from "@/components/workshop/JsonFormatterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("json-formatter")!;

export const metadata: Metadata = toolMetadata(tool);

export default function JsonFormatterPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <JsonFormatterTool />
    </WorkshopToolShell>
  );
}
