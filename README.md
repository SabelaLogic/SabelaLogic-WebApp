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

Four things are deliberately stubbed, each marked in code:

1. **Login authentication** (`src/components/login/LoginForm.tsx`) — wire to
   the portal's real auth endpoint, then route to `/portal` for that client.
2. **Narration** (`src/components/visualizer/JourneyVisualizer.tsx`) — each
   stage fires `onNarration({ stage, src, el })` once, on first scroll into
   view. No audio clips exist yet.
3. **Architecture generator** (`src/app/api/generate/route.ts`) — set
   `ANTHROPIC_API_KEY` to enable live generation; without it the UI shows a
   graceful fallback.
4. **Contact form** (`src/app/api/contact/route.ts`) — set
   `CONTACT_WEBHOOK_URL` to a real inbox/webhook; without it the form falls
   back to opening WhatsApp with the brief pre-composed.

## Assets

Brand assets (monogram, stacked logo, AutoShow screenshot) live in
`public/brand/`. The four hero background images, the operator portrait and
the ambient audio track are still hotlinked from
`sabelalogic26.firebaseapp.com` — move these into `public/` once the source
files are available.
