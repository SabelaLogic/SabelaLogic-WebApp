import type { Workstream, JourneyStage } from "@/lib/types";

export const GREY = "#6b7076";
export const DONE = "#34d399";

export const DEFAULT_WORKSTREAMS: Workstream[] = [
  { name: "Admissions System", status: "complete", pct: 100, phase: "Handover", milestone: "Live 14 Jul" },
  { name: "Government CRM", status: "active", pct: 64, phase: "Integration", milestone: "UAT 09 Sep" },
  { name: "Education Platform", status: "queued", pct: 12, phase: "Discovery", milestone: "Kickoff 22 Sep" },
];

export const DEFAULT_STAGES: JourneyStage[] = [
  {
    date: "14 MAR 2026",
    timing: "Same day. The queue slot is held the moment payment clears.",
    includes: [
      "Deposit receipt and tax invoice",
      "Build slot reserved against a named start date",
      "Scope summary as quoted, in writing",
      "A single point of contact for the whole engagement",
    ],
    faq: [
      {
        q: "Is the deposit refundable?",
        a: "Up to the onboarding signature, yes — in full. After signature it converts to work already scheduled and becomes non-refundable.",
      },
      {
        q: "What does the deposit cover?",
        a: "It reserves capacity and covers discovery. It is credited against the total, not charged on top of it.",
      },
    ],
  },
  {
    date: "19 MAR 2026",
    timing: "One session, 60–90 minutes, plus a day for the profile to be provisioned.",
    includes: [
      "Intake form covering systems, users and data sources",
      "Scope disclaimer setting what is and is not in the build",
      "Digital signature on the engagement terms",
      "Client profile and portal access provisioned",
    ],
    faq: [
      {
        q: "Why a disclaimer?",
        a: "So that both sides can point at one document later. It records what was agreed, what was excluded, and how changes get priced.",
      },
      {
        q: "Can scope change after signing?",
        a: "Yes, through a written change note. Anything that moves a milestone date is flagged before it is started, never after.",
      },
    ],
  },
  {
    date: "IN PROGRESS",
    timing: "Milestone-based rather than date-based. Each workstream reports its own percentage.",
    includes: [
      "Parallel workstreams, each with independent milestones",
      "Weekly written progress note — no status meeting required",
      "Staging environment available throughout",
      "Every commit deployed through CI, not from a laptop",
    ],
    faq: [
      {
        q: "Where do these percentages come from?",
        a: "The build tracker, wired to the repositories behind each workstream. They move when work merges, not when someone reports it.",
      },
      {
        q: "What if a workstream stalls?",
        a: "It is marked blocked here with the reason. A blocked stream does not hold up the others — they run on separate tracks by design.",
      },
    ],
  },
  {
    date: "OCT 2026",
    timing: "Per system. Each go-live is a separate sign-off, typically two weeks apart.",
    includes: [
      "Pre-launch checklist and load sanity pass",
      "Staged cutover with rollback ready",
      "Handover session and written operating notes",
      "Two weeks of hypercare per launched system",
    ],
    faq: [
      {
        q: "Does everything launch at once?",
        a: "No. Systems go live sequentially so that a problem in one never takes the others down with it.",
      },
      {
        q: "Who signs off a go-live?",
        a: "Your named contact, against the checklist. Nothing is declared live on our word alone.",
      },
    ],
  },
  {
    date: "ONGOING",
    timing: "Monthly, continuous, no fixed end date. Thirty days notice either way.",
    includes: [
      "Uptime and error monitoring with alerting",
      "Security patches and dependency upkeep",
      "A standing monthly window for small changes",
      "Quarterly review of what the system should do next",
    ],
    faq: [
      {
        q: "How is the retainer different from the build?",
        a: "The build has an end. The retainer is capacity you hold each month — it covers care and small changes, not the next major system.",
      },
      {
        q: "Can we pause it?",
        a: "Yes, with thirty days notice. Monitoring stays on during a pause; changes queue until it resumes.",
      },
    ],
  },
];

export const RAIL = [
  { no: "01", short: "DEPOSIT" },
  { no: "02", short: "ONBOARDING" },
  { no: "03", short: "BUILD" },
  { no: "04", short: "GO-LIVE" },
  { no: "05", short: "RETAINER" },
];

export const STAGE_KEYS = [
  "stage-1-deposit",
  "stage-2-onboarding",
  "stage-3-build",
  "stage-4-golive",
  "stage-5-retainer",
] as const;

export const STAGE_LABELS = [
  "DEPOSIT CONFIRMED",
  "ONBOARDING",
  "BUILD IN PROGRESS",
  "MILESTONE / GO-LIVE",
  "ONGOING RETAINER",
];
