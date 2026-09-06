import type { Metadata } from "next";
import { WorkshopToolShell } from "@/components/workshop/WorkshopToolShell";
import { ImageToPdfTool } from "@/components/workshop/ImageToPdfTool";
import { getWorkshopTool } from "@/lib/data/workshop-tools";

export const metadata: Metadata = {
  title: "Image to PDF — Sabela Logic Workshop",
  description: "Free image-to-PDF converter. Runs entirely in your browser.",
};

export default function ImageToPdfPage() {
  const tool = getWorkshopTool("image-to-pdf")!;
  return (
    <WorkshopToolShell tool={tool}>
      <ImageToPdfTool />
    </WorkshopToolShell>
  );
}
