import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { WordCounterTool } from "@/components/workshop/WordCounterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";

export const metadata: Metadata = {
  title: "Word Counter — Sabela Logic Workshop",
  description: "Free word, character and reading-time counter. Runs entirely in your browser.",
};

export default function WordCounterPage() {
  const tool = getWorkshopTool("word-counter")!;
  return (
    <WorkshopToolShell tool={tool}>
      <WordCounterTool />
    </WorkshopToolShell>
  );
}
