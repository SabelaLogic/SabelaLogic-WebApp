import type { Metadata } from "next";
import { JourneyVisualizer } from "@/components/visualizer/JourneyVisualizer";

export const metadata: Metadata = {
  title: "Build Tracker — Sabela Logic Client Portal",
};

export default function PortalPage() {
  // NARRATION INTEGRATION POINT — pass onNarration to play a per-stage voiceover
  // clip once data-narration-src is populated. No audio exists yet.
  return <JourneyVisualizer />;
}
