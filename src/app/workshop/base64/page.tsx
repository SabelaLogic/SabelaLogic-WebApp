import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { Base64Tool } from "@/components/workshop/Base64Tool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("base64")!;

export const metadata: Metadata = toolMetadata(tool);

export default function Base64Page() {
  return (
    <WorkshopToolShell tool={tool}>
      <Base64Tool />
    </WorkshopToolShell>
  );
}
