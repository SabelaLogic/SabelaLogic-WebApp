export const SESSION_COOKIE = "sl_session";
const SESSION_DAYS = 30;

export interface Customer {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  onboarding_accepted: number;
  onboarding_accepted_at: string | null;
  created_at: string;
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSession(db: D1Database, customerId: string): Promise<{ token: string; expiresAt: string }> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.prepare("INSERT INTO sessions (token, customer_id, expires_at) VALUES (?, ?, ?)").bind(token, customerId, expiresAt).run();
  return { token, expiresAt };
}

export async function getCustomerFromSession(db: D1Database, token: string | undefined): Promise<Customer | null> {
  if (!token) return null;
  const session = await db.prepare("SELECT customer_id, expires_at FROM sessions WHERE token = ?").bind(token).first<{
    customer_id: string;
    expires_at: string;
  }>();
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return null;
  }
  const customer = await db.prepare("SELECT * FROM customers WHERE id = ?").bind(session.customer_id).first<Customer>();
  return customer ?? null;
}

export async function deleteSession(db: D1Database, token: string | undefined): Promise<void> {
  if (!token) return;
  await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}
