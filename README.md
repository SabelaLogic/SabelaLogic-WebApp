# Sabela Logic — Web App

Marketing site, client login and Project Journey Visualizer for Sabela Logic, a
one-person systems/software/AI studio based in South Africa. Built with
Next.js (App Router), React and Tailwind CSS.

Ported from a high-fidelity design handoff (`.dc.html` prototypes) into
production React components. Design tokens, motion and copy were carried
over verbatim; the prototype's custom template runtime was not — everything
here is plain React/Tailwind.

## Routes

- `/` — marketing site: hero, project roster, case studies, process, build
  log, architecture generator, services, contact.
- `/login` — client portal sign-in.
- `/portal` — Project Journey Visualizer, the post-login build tracker.
  Reusable via the `JourneyVisualizer` component (`clientName`, `projectName`,
  `reference`, `currentStage`, `accent`, `workstreams`, `stages`,
  `onNarration` props).
- `/autoshow-live-build.html` — static AutoShow Dealer OS case-study page,
  supplied as-is and served verbatim (reference material, not a pattern to
  follow).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Integration points

See `HANDOVER.md` for the full current state, environment traps and workflow.

Live and backed by D1 (`sabela_client_portal`, bound as `env.DB`):

- **Client login and portal gating** — `/login` authenticates against the
  `customers` table (PBKDF2 + server-side sessions), then gates `/portal`
  behind the SLA/privacy acceptance step at `/acceptance`.
- **Newsletter signup** (`src/app/api/newsletter/route.ts`) — stored in
  `newsletter_signups`. Optionally forwards to `NEWSLETTER_WEBHOOK_URL`
  (Zapier Catch Hook, Mailchimp, etc.) when that secret is set.

Still stubbed, each marked in code:

1. **Narration** (`src/components/visualizer/JourneyVisualizer.tsx`) — each
   stage fires `onNarration({ stage, src, el })` once, on first scroll into
   view. No audio clips exist yet.
2. **Architecture generator** (`src/app/api/generate/route.ts`) — set
   `ANTHROPIC_API_KEY` to enable live generation; without it the UI shows a
   graceful fallback.
3. **Contact form** (`src/app/api/contact/route.ts`) — set
   `CONTACT_WEBHOOK_URL` to a real inbox/webhook; without it the form falls
   back to opening WhatsApp with the brief pre-composed.
4. **Portal build data** — `/portal` reads the client and project name from
   D1 but still renders mock stages/workstreams from `visualizer-defaults.ts`.

## Assets

Brand assets (monogram, stacked logo, AutoShow screenshot) live in
`public/brand/`. The four hero background images, the operator portrait and
the ambient audio track are still hotlinked from
`sabelalogic26.firebaseapp.com` — move these into `public/` once the source
files are available.

## Deploying to Cloudflare Workers

This app deploys to Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare),
matching the existing Sabela Logic estate (`autoshow-dealer-os`,
`sabelalogic-qr-tracker`). Cloudflare's Next.js-on-Pages path only supports
static export, which can't serve this app's API routes — Workers is the
correct target for the full app. The `wrangler.jsonc` / `open-next.config.ts`
config in this repo has been built and smoke-tested locally (`npx wrangler
dev`) against the real Workers runtime.

**One-time setup — connect the repo for automatic deploys:**

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Import a
   repository**, and authorize/select the `sabelalogic/sabelalogic-webapp`
   GitHub repo.
2. Cloudflare will detect the existing `wrangler.jsonc` and skip
   autoconfiguration — confirm the branch to deploy from (`claude/new-session-lop9ib`
   for now, or `main` once this is merged).
3. Under **Build configuration**, the build command should be `npm run deploy`
   (falls back automatically to `opennextjs-cloudflare build && opennextjs-cloudflare deploy`
   per the `package.json` scripts) — Workers Builds will detect this from
   `package.json` if left on auto.
4. Add environment variables/secrets if you want the stubbed integrations
   live: `ANTHROPIC_API_KEY` (architecture generator) and
   `CONTACT_WEBHOOK_URL` (contact form).
5. Save and deploy. Every push to the connected branch redeploys
   automatically, and you'll get a `*.workers.dev` URL immediately, with a
   custom domain attachable afterward from the same project settings.

**Manual one-off deploy** (needs `wrangler login` or a `CLOUDFLARE_API_TOKEN`
first):

```bash
npm run deploy
```

**Local Workers-runtime preview** (no deploy):

```bash
npx opennextjs-cloudflare build
npx wrangler dev
```
