# Handover — working notes for the next agent

Written 7 Sep 2026. Covers how this repo is worked on, what's actually live
vs. stubbed, and the environment traps that cost time to discover.

---

## 1. Branch and deploy workflow

Two branches are kept identical, and **both** are pushed on every change:

- `claude/supabase-url-env-var-bujtdc` — the designated dev branch, work here
- `claude/new-session-lop9ib` — the repo's effective default branch

After committing on the dev branch:

```bash
git push -u origin claude/supabase-url-env-var-bujtdc
git fetch origin claude/new-session-lop9ib
git checkout claude/new-session-lop9ib
git merge --ff-only claude/supabase-url-env-var-bujtdc
git push -u origin claude/new-session-lop9ib
git checkout claude/supabase-url-env-var-bujtdc   # always return to dev
```

Deploys are **manual** — pushing to GitHub does *not* deploy. The Cloudflare
Workers Build integration described in `README.md` was never actually
connected. To ship:

```bash
CLOUDFLARE_API_TOKEN="<token>" npm run deploy
```

Live at **https://sabelalogic-webapp.sabelalogic.workers.dev**. The token is
not stored anywhere in the repo — ask the user for one (Cloudflare dashboard →
My Profile → API Tokens → "Edit Cloudflare Workers" template). Two policies
from that template are sufficient; no third policy is needed.

## 2. Verification pipeline — run all of it before committing

```bash
npx tsc --noEmit          # must be silent
npm run lint              # must be silent
npm run build             # must reach the route table
```

Then serve and drive it in a real browser before claiming it works:

```bash
nohup env PORT=31xx npm run start > /tmp/.../server.log 2>&1 & disown
```

Playwright is **not** a project dependency — use the global install:
`require('/opt/node22/lib/node_modules/playwright')`, launched with
`executablePath: '/opt/pw-browsers/chromium'` and `args: ['--headless=new']`.

Several real bugs this session were caught by this step and *not* reported by
the user (an image compressor that made files bigger, a PDF format-detection
bug). Do not skip it.

## 3. Environment traps

- **ffmpeg**: the only preinstalled binary is Playwright's
  (`/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux`), built with
  `--disable-everything`. It has **no MP4 demuxer** — it cannot even open an
  `.mp4`, let alone transcode. `apt-get install ffmpeg` fails (dependency
  404s). What works: `npm install @ffmpeg-installer/ffmpeg`, which ships a
  full static build as package content. Direct binary downloads
  (johnvansickle.com etc.) are blocked by the egress proxy.
- **Playwright vs. the production domain**: Chromium through the agent proxy
  repeatedly failed with `net::ERR_CONNECTION_RESET` against
  `sabelalogic-webapp.sabelalogic.workers.dev`, while `curl` to the same URL
  worked fine every time. For production verification, prefer `curl` with a
  cookie jar (`-c`/`-b`) — it can exercise the whole auth flow. Test in a real
  browser against `localhost` instead.
- **Headless Chromium cannot decode video or audio** here. A `<video>` will
  sit at `readyState: 0` forever. Verify media by checking the element exists
  and the asset returns 200, not by expecting playback.
- **`cloudflare-env.d.ts` is gitignored** and required for typecheck. On a
  fresh clone run `npm run cf-typegen` (needs `CLOUDFLARE_API_TOKEN`) or
  `env.DB` will be untyped and `tsc` will fail.
- Beware: generating that file pulls in wrangler's Workers runtime types,
  which narrow global `Response.json()` from `any` to `unknown`. That surfaced
  type errors in four pre-existing files. Cast at the call site:
  `const data = (await res.json()) as { ... }`.

## 4. Architecture notes worth knowing

- **D1 is the only backend.** Database `sabela_client_portal`
  (`a8de53e2-3a49-4ee9-8b34-70663ff629fe`), bound as `env.DB` in
  `wrangler.jsonc`. Schema lives in `d1/schema.sql` — keep it in sync by hand;
  it is documentation, not a migration runner. Access it via
  `getDb()` in `src/lib/db.ts` (wraps `getCloudflareContext`).
- **Auth is real now.** PBKDF2 via Web Crypto (`src/lib/password.ts`, no
  dependency), random session tokens in the `sessions` table
  (`src/lib/auth.ts`) — not JWTs, expiry is checked server-side on every read.
  `/portal` and `/acceptance` are async server components that read the
  session cookie directly and redirect.
- **Internal links must use `next/link`.** Plain `<a href="/...">` triggers a
  full page reload, which resets the persistent ambient audio in the root
  layout (and everything else). The two genuine exceptions are
  `/sabelalogicai.html` and `/autoshow-live-build.html` — static files, not
  Next routes, so `<Link>` cannot resolve them and a real navigation is
  correct.
- **Anchor links need the leading slash**: `/#work`, never `#work`. Bare
  fragments silently do nothing from any page other than `/`.
- **Ambient audio lives in the root layout** (`AmbientAudio.tsx`), mounted
  once so it survives navigation. Don't move it back into a page component.
- Styled-jsx CSS (used in `AcceptanceForm.tsx`) is compiled into a JS chunk
  and injected on hydration — it will **not** appear in `curl`'d HTML. That is
  normal, not a bug.

## 5. State of the integrations

| Integration | Status |
|---|---|
| Client login / portal gating | **Live.** D1-backed, tested end to end |
| Newsletter signup | **Live.** Stored in D1 `newsletter_signups`; forwards to `NEWSLETTER_WEBHOOK_URL` if set |
| Architecture generator | Needs `ANTHROPIC_API_KEY` secret; graceful fallback without it |
| Contact form | Needs `CONTACT_WEBHOOK_URL`; falls back to WhatsApp compose |
| Ayaan-Tinashe legal record | Placeholder Supabase creds in `AcceptanceForm.tsx` — see below |

### Open items

1. **Zapier Catch Hook** — cannot be created programmatically. Zapier's MCP
   surface only exposes *outbound* webhook actions (`post`, `get`, `put`,
   `custom`); a Catch Hook is a Zap **trigger**, which only exists inside a Zap
   built in Zapier's editor. Signups are safe in D1 regardless. To connect it:
   create a Zap → trigger "Webhooks by Zapier → Catch Hook" → copy the URL →
   `npx wrangler secret put NEWSLETTER_WEBHOOK_URL`. No code change needed.
2. **Ayaan-Tinashe Supabase project** doesn't exist yet. Swap the two
   placeholder constants at the top of
   `src/components/acceptance/AcceptanceForm.tsx` once it does, and run the
   `agreement_acknowledgements` table + insert-only RLS policy in it. The
   acceptance flow works today without it — that write is best-effort and is
   skipped while the URL is a placeholder.
3. **Ayaan-Tinashe portal login** is seeded with the placeholder email
   `ayaan.tinashe@example.com`. Update it to their real address before handing
   credentials over.
4. `/portal` still renders mock stages/workstreams from
   `visualizer-defaults.ts`. Only `clientName`, `projectName` and
   `currentStage` come from D1. Wiring the `projects`/`workstreams` tables
   through is the obvious next step.

## 6. Conventions

- Commit messages: subject line, then prose explaining *why*, wrapped ~72
  chars. No bullet-point-only messages.
- Every commit ends with the `Co-Authored-By:` and `Claude-Session:` trailers.
- Data lives in `src/lib/data/*.ts` as typed arrays — add to those rather than
  hardcoding content in components (see `contributors.ts`, `workshop-tools.ts`).
- Small shared UI primitives go in `src/components/marketing/` as single-export
  files (`LiveDot.tsx`, `AccentText.tsx`, `Spinner.tsx`).
- Site-wide motion is deliberately slow and non-flashing — the accent-letter
  glow and live-dot pulses are kept well under the WCAG 3-flashes/second
  threshold, and a global `prefers-reduced-motion` rule in `globals.css`
  disables all animation. Keep new motion inside that envelope.
