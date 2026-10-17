import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { QrCodeTool } from "@/components/workshop/QrCodeTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";
import { toolMetadata } from "@/lib/seo";

const tool = getWorkshopTool("qr-code-generator")!;

export const metadata: Metadata = toolMetadata(tool);

export default function QrCodePage() {
  return (
    <WorkshopToolShell tool={tool}>
      <QrCodeTool />
    </WorkshopToolShell>
  );
}
