import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { JsonFormatterTool } from "@/components/workshop/JsonFormatterTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";

export const metadata: Metadata = {
  title: "JSON Formatter — Sabela Logic Workshop",
  description: "Free JSON formatter, validator and minifier. Runs entirely in your browser.",
};

export default function JsonFormatterPage() {
  const tool = getWorkshopTool("json-formatter")!;
  return (
    <WorkshopToolShell tool={tool}>
      <JsonFormatterTool />
    </WorkshopToolShell>
  );
}
