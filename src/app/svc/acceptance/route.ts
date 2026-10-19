import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { getCustomerFromSession, SESSION_COOKIE } from "@/lib/auth";

// Marks the signed-in client's onboarding as accepted, gating their access to
// /portal. The acceptance page also writes the signed SLA/privacy-policy
// acknowledgement to the client's own Supabase project (see AcceptanceForm) —
// that's the legal record; this is only the yes/no gate SabelaLogic checks.
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  try {
    const db = await getDb();
    const customer = await getCustomerFromSession(db, token);
    if (!customer) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    await db
      .prepare("UPDATE customers SET onboarding_accepted = 1, onboarding_accepted_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), customer.id)
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not record your acceptance just now — try again shortly." }, { status: 502 });
  }
}
