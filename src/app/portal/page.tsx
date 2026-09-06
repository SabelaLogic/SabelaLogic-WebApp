import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JourneyVisualizer } from "@/components/visualizer/JourneyVisualizer";
import { getDb } from "@/lib/db";
import { getCustomerFromSession, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Build Tracker — Sabela Logic Client Portal",
};

interface ProjectRow {
  name: string;
  current_stage: number;
}

export default async function PortalPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const db = await getDb();
  const customer = await getCustomerFromSession(db, token);

  if (!customer) redirect("/login");
  if (!customer.onboarding_accepted) redirect("/acceptance");

  const project = await db
    .prepare("SELECT name, current_stage FROM projects WHERE customer_id = ? ORDER BY created_at DESC LIMIT 1")
    .bind(customer.id)
    .first<ProjectRow>();

  // NARRATION INTEGRATION POINT — pass onNarration to play a per-stage voiceover
  // clip once data-narration-src is populated. No audio exists yet.
  return (
    <JourneyVisualizer
      clientName={customer.name ?? undefined}
      projectName={project?.name}
      currentStage={(project?.current_stage as 1 | 2 | 3 | 4 | 5 | undefined) ?? undefined}
    />
  );
}
