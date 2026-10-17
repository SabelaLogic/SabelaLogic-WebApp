import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { PasswordGeneratorTool } from "@/components/workshop/PasswordGeneratorTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("password-generator")!;

export const metadata: Metadata = toolMetadata(tool);

export default function PasswordGeneratorPage() {
  return (
    <WorkshopToolShell tool={tool}>
      <PasswordGeneratorTool />
    </WorkshopToolShell>
  );
}
