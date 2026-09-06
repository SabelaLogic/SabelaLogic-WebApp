import type { Project, ProjectStatus } from "@/lib/types";

export const TONE: Record<ProjectStatus, string> = {
  LIVE: "#e04a3a",
  SHIPPING: "#f2a93b",
  "R&D": "#8ab4f8",
  CONCEPT: "#8a857f",
  ARCHIVED: "#747976",
};

export const FILTERS: Array<ProjectStatus | "ALL"> = [
  "ALL",
  "LIVE",
  "SHIPPING",
  "R&D",
  "CONCEPT",
  "ARCHIVED",
];

export const PROJECTS: Project[] = [
  {
    name: "Redeemed & Rising Awards",
    kind: "Voting & payments platform",
    status: "SHIPPING",
    summary:
      "Attendees scan a QR, verify by SMS one-time PIN, vote across 12 categories for their conference, pay per vote through PayFast and get an SMS receipt. A password-gated dashboard shows live tallies and the revenue split.",
    stack: ["Next.js", "Supabase / Postgres", "PayFast ITN", "BulkSMS", "Vercel"],
    image: "/brand/redeemed-rising-ballot.webp",
    flag: true,
  },
  {
    name: "AutoShow Dealer OS",
    kind: "Dealership storefront & inventory",
    status: "LIVE",
    summary:
      "Vehicle inventory and showroom site for a working Bloemfontein dealership, served from a Cloudflare Worker with listings in D1 and photography in R2 object storage. Every push to main auto-deploys through GitHub Actions — stock can be updated from a phone.",
    stack: ["Cloudflare Workers", "D1", "R2", "GitHub Actions"],
    href: "https://autoshowbloemfontein.co.za",
    hrefLabel: "autoshowbloemfontein.co.za",
    href2: "/autoshow-live-build.html",
    href2Label: "WALK THE BUILD",
    image: "/brand/autoshow-live-trim.webp",
    slotHint: "Drop an AutoShow showroom screenshot",
    flag: true,
  },
  {
    name: "AWM Leadership Companion",
    kind: "Leadership development app",
    status: "LIVE",
    summary:
      "Companion application for AWM leadership programmes, deployed to Firebase hosting in March 2026 and serving live.",
    stack: ["React", "Firebase Hosting"],
    href: "https://awm-leadership-companion.web.app",
    hrefLabel: "awm-leadership-companion.web.app",
    image: "/brand/awm-leadership-companion.webp",
    flag: true,
  },
  {
    name: "Sabela Estates",
    kind: "Estate agency platform",
    status: "SHIPPING",
    summary:
      "Agent recruitment and property platform built on a single-tier override structure, with a property command centre and 360° tour viewer. Mid-build.",
    stack: ["Next.js", "Postgres", "360° tours"],
  },
  {
    name: "Sabela Guardian",
    kind: "Personal security mesh",
    status: "R&D",
    summary:
      "Three-node security platform — desktop core engine, mobile field sensor and biometric smartwatch node — with a five-tier multilingual alert framework. Provisional-patent concept documented June 2026, currently at v5.6.0.",
    stack: ["TypeScript", "Vite", "PWA", "Termux"],
  },
  {
    name: "Floorboard",
    kind: "Automotive sales cockpit (Android)",
    status: "SHIPPING",
    summary:
      "Native Android cockpit for vehicle sales: lead intelligence qualifier, deal pipeline and performance gauges, wired to Gemini server-side for lead scoring.",
    stack: ["Kotlin", "Jetpack Compose", "Room", "Gemini API"],
  },
  {
    name: "Tender Response Assistant",
    kind: "Retrieval-augmented drafting",
    status: "SHIPPING",
    summary:
      "Feeds B-BBEE certificates, compliance documents and past tender responses into a local vector index, then drafts answers grounded in those documents with citations — no invented facts.",
    stack: ["Python", "Qdrant", "sentence-transformers", "Claude", "Flask"],
  },
  {
    name: "QR Scan Tracker",
    kind: "Print attribution service",
    status: "SHIPPING",
    summary:
      "One QR code across every printed flyer, with each scan logged to an edge database by timestamp, device and country. A stats endpoint returns running totals without the code ever changing.",
    stack: ["Cloudflare Workers", "D1", "TypeScript"],
  },
  {
    name: "WhatsApp Automation Pipelines",
    kind: "On-device AI operations",
    status: "R&D",
    summary:
      "Voice notes transcribed and turned into action items, B2B lead sourcing with paced outreach, and tender-alert monitoring — all running on a headless Android server with quantised local models.",
    stack: ["Termux", "whisper.cpp", "llama.cpp", "FastAPI"],
  },
  {
    name: "Sabela Market",
    kind: "Marketplace",
    status: "CONCEPT",
    summary:
      "Marketplace concept preview running on sample listings. Not open to sellers — published to test the model before any of it is built for real.",
    stack: ["Firebase Hosting"],
  },
  {
    name: "BIITEOTB",
    kind: "Streetwear commerce",
    status: "ARCHIVED",
    summary:
      "Storefront build, shelved. Kept on the roster because a portfolio that only shows wins is not a portfolio.",
    stack: ["Firebase"],
  },
];
