import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getCustomerFromSession, SESSION_COOKIE } from "@/lib/auth";
import { AcceptanceForm } from "@/components/acceptance/AcceptanceForm";

export const metadata: Metadata = {
  title: "Acceptance of Agreement — Sabela Logic",
};

export default async function AcceptancePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const db = await getDb();
  const customer = await getCustomerFromSession(db, token);

  if (!customer) redirect("/login");
  if (customer.onboarding_accepted) redirect("/portal");

  return <AcceptanceForm clientName={customer.name ?? "Client"} />;
}
