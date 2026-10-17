import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { HeicToJpgTool } from "@/components/workshop/HeicToJpgTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("heic-to-jpg")!;

export const metadata: Metadata = toolMetadata(tool);

export default function HeicToJpgPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <HeicToJpgTool />
    </WorkshopToolShell>
  );
}
