import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSession, SESSION_COOKIE, type Customer } from "@/lib/auth";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import { isValidEmail, MAX_LENGTHS, withinMax } from "@/lib/validation";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!withinMax(email, MAX_LENGTHS.email) || !isValidEmail(email) || !password) {
    return NextResponse.json({ error: "Enter both your email and password." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const customer = await db.prepare("SELECT * FROM customers WHERE email = ?").bind(email).first<Customer>();

    // Run a verify even on a miss so a wrong email and a wrong password take the same time.
    const validPassword = await verifyPassword(password, customer?.password_hash ?? DUMMY_HASH);
    if (!customer || !validPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const { token, expiresAt } = await createSession(db, customer.id);
    const response = NextResponse.json({ ok: true, accepted: Boolean(customer.onboarding_accepted) });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(expiresAt),
    });
    return response;
  } catch {
    return NextResponse.json({ error: "The portal could not be reached just now." }, { status: 502 });
  }
}
