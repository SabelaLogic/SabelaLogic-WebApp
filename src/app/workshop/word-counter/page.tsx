import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { WordCounterTool } from "@/components/workshop/WordCounterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("word-counter")!;

export const metadata: Metadata = toolMetadata(tool);

export default function WordCounterPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <WordCounterTool />
    </WorkshopToolShell>
  );
}
