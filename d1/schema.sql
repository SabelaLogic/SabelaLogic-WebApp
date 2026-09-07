-- Client portal database (D1: sabela_client_portal).
-- Source of truth for the schema — run against a fresh D1 database with:
--   wrangler d1 execute sabela_client_portal --remote --file=d1/schema.sql

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  onboarding_accepted INTEGER NOT NULL DEFAULT 0,
  onboarding_accepted_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id),
  name TEXT NOT NULL,
  current_stage INTEGER DEFAULT 1,
  overall_percent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workstreams (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  name TEXT,
  status TEXT,
  percent_complete INTEGER DEFAULT 0,
  stage_date TEXT
);

-- token is a random 256-bit value, not a JWT — expiry is checked on every read
-- rather than trusted from the token itself.
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id),
  expires_at TEXT NOT NULL
);

-- Newsletter signups. This is the source of truth; NEWSLETTER_WEBHOOK_URL
-- forwarding (Zapier etc.) is optional on top, and `forwarded` records whether
-- that forward succeeded so failed ones can be replayed.
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT,
  forwarded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signups(email);
