import type {
  CaseStudy,
  FlowNode,
  EngineeringNote,
  ProcessPhase,
  BuildLogEntry,
  ServiceItem,
  FooterColumn,
} from "@/lib/types";

export const HERO_STATS = [
  { v: "12", k: "PROJECTS IN THE ESTATE" },
  { v: "48h", k: "LANDING PAGE, LIVE" },
  { v: "10", k: "DAYS TO A WORKING MVP" },
  { v: "1", k: "PERSON YOU DEAL WITH" },
];

export const SLA = [
  {
    time: "48 hours",
    what: "Landing page",
    note: "Copy, build, domain, analytics — live and taking enquiries.",
  },
  {
    time: "7 days",
    what: "Full website",
    note: "Multi-page, CMS-backed where it needs to be, on your own domain.",
  },
  {
    time: "10 days",
    what: "Web app MVP",
    note: "Auth, database, payments, admin view. Deployed, not demoed.",
  },
  {
    time: "Same day",
    what: "Bug fixes",
    note: "Reported before close of business, fixed before close of business.",
  },
];

export const CASES: CaseStudy[] = [
  {
    no: "CASE 01",
    name: "AutoShow Dealer OS",
    status: "LIVE",
    tone: "#e04a3a",
    problem:
      "A working dealership was running its inventory the way most small lots do — a static presence, photos hosted wherever was convenient, no pipeline for updating stock.",
    build:
      "Migrated the storefront to Cloudflare Workers, with D1 for inventory and R2 for vehicle photo storage. GitHub Actions deploys on every push — no manual step between a commit and the live site.",
    result:
      "Real stock, real prices, real lot — six vehicles, each with a photo taken on-site rather than stock imagery. The site can be updated from a phone.",
    href: "https://autoshowbloemfontein.co.za",
    cta: "VIEW THE LIVE SITE",
    href2: "/autoshow-live-build.html",
    cta2: "WALK THE BUILD",
  },
  {
    no: "CASE 02",
    name: "Sabela Estates — The Founding Twenty",
    status: "IN BUILD",
    tone: "#f2a93b",
    problem:
      "Estate agent recruitment in South Africa runs on referral, but most referral structures either pay too little to matter or tip into multi-level compensation risk the moment they scale.",
    build:
      "A single-tier override architecture: a flat referral fee for each of the first nineteen agents brought in, then a retroactive percentage override across the full book once twenty active, tour-publishing agents vest. No downstream tiers, no recruits-of-recruits — deliberately structured to stay outside multi-level compensation law.",
    result:
      "A recruitment instrument rather than a spreadsheet. Milestone bonuses at five and ten referrals close the drop-off gap most referral programmes lose people to, paired with a property command centre and 360° tour viewer agents use day to day. Mid-build, and said so.",
  },
  {
    no: "CASE 03",
    name: "Redeemed & Rising Awards",
    status: "SHIPPING",
    tone: "#f2a93b",
    problem:
      "A conference needed a nomination-to-vote pipeline for its annual awards — something that could go from brief to a working, votable system before the event, not after it.",
    build:
      "Nomination intake through to a live voting platform: SMS one-time PIN verification, per-conference ballots, per-vote payment through PayFast, and a password-gated dashboard showing live tallies and the revenue split.",
    result:
      "A real event ran on it. Not a demo — the actual mechanism people used to nominate, pay and vote, across seven conferences and twelve categories.",
  },
];

export const RR_SCREENS = [
  {
    src: "/brand/rr-flow-screens.webp",
    alt: "Redeemed & Rising Awards — scan, verify, vote, pay and confirm screens",
    caption: "The full attendee flow — scan to confirmed vote, five screens.",
  },
  {
    src: "/brand/rr-landing-page.webp",
    alt: "Redeemed & Rising Awards marketing landing page",
    caption: "The event landing page — how it works, built for the room.",
  },
  {
    src: "/brand/rr-admin-dashboard.webp",
    alt: "Redeemed & Rising Awards live admin dashboard showing tallies and revenue split",
    caption: "The private admin dashboard — live tallies, revenue split, refreshing every 15s.",
  },
];

export const FLOW: FlowNode[] = [
  { tag: "01", tone: "#e04a3a", title: "QR scan", detail: "Printed code lands the attendee on the ballot." },
  { tag: "02", tone: "#e04a3a", title: "Phone number", detail: "Identity is the handset, not an account." },
  {
    tag: "03",
    tone: "#f2a93b",
    title: "SMS one-time PIN",
    detail: "Gateway sends, server verifies, one vote per number.",
  },
  {
    tag: "04",
    tone: "#e04a3a",
    title: "Conference pick",
    detail: "Ballot filters to that conference’s nominees only.",
  },
  { tag: "05", tone: "#e04a3a", title: "Cart review", detail: "Twelve categories, priced per vote, totalled." },
  { tag: "06", tone: "#f2a93b", title: "PayFast redirect", detail: "Money never touches the app server." },
  {
    tag: "07",
    tone: "#f2a93b",
    title: "Signed webhook",
    detail: "Only the gateway callback can record a paid vote.",
  },
];

export const HARDENING = [
  "Votes are written on the payment notification, never on the browser returning — a closed tab cannot lose a paid vote.",
  "Empty categories degrade gracefully: a conference with no nominee shows a plain message and the voter moves on.",
  "Duplicate and misspelled nominee submissions are merged before wiring, so one person cannot split their own vote.",
];

export const ENGINEERING: EngineeringNote[] = [
  {
    head: "THE DATA IS THE CONFIGURATION",
    body: "Adding an eighth conference means adding one entry and tagging its nominees. No code changes, no redeploy logic, no developer needed at the event.",
  },
  {
    head: "NOTHING COSTS UNTIL IT EARNS",
    body: "Payments and SMS are the only paid components and both bill per transaction. Hosting and database sit on free tiers sized well past the event. The platform costs nothing until somebody votes.",
  },
  {
    head: "TESTABLE WITHOUT SPENDING",
    body: "Sandbox payment credentials and console-logged SMS let the entire flow be rehearsed end to end before a cent moves — which is how you find the broken step, not on the night.",
  },
];

export const PHASES: ProcessPhase[] = [
  {
    day: "DAY 0",
    title: "Brief and architecture",
    body: "A call, then a written specification: what it does, what it explicitly does not do, the data model and the stack. You approve this before anything is built, and the fixed price is set here.",
    out: "Written spec and fixed quote",
  },
  {
    day: "DAY 1-2",
    title: "Skeleton in production",
    body: "Repository, database schema, authentication and the deploy pipeline — all live on a real URL by the end of day two. From here every change you approve is visible within minutes.",
    out: "Live URL, auto-deploying",
  },
  {
    day: "DAY 3-6",
    title: "Core flows",
    body: "The screens that carry the actual work of the product, built against real data rather than placeholder content. Daily builds you can open on your phone and react to.",
    out: "Working primary journey",
  },
  {
    day: "DAY 7-8",
    title: "Integrations and hardening",
    body: "Payments, SMS, email, third-party APIs — plus the failure cases: retries, webhook signature checks, duplicate protection, and what the user sees when something goes wrong.",
    out: "Integrated and failure-tested",
  },
  {
    day: "DAY 9",
    title: "Polish and instrumentation",
    body: "The aesthetic pass — type, spacing, motion, empty states, mobile — alongside analytics and error reporting so you can see what people actually do.",
    out: "Design pass and analytics",
  },
  {
    day: "DAY 10",
    title: "Handover",
    body: "Your own accounts, your own repository, admin walkthrough and a written operations note. You own everything outright. Nothing stays locked to me.",
    out: "Full ownership transfer",
  },
];

export const BUILD_LOG: BuildLogEntry[] = [
  {
    repo: "Redeemed & Rising",
    when: "AUG 2026",
    what: "Scaled the ballot from one conference to seven, with per-conference nominee filtering and automatic handling of categories nobody nominated for.",
  },
  {
    repo: "AutoShow Dealer OS",
    when: "AUG 2026",
    what: "Moved deployment to GitHub Actions so releases run on CI rather than a local machine — the site can now be updated from a phone.",
  },
  {
    repo: "Sabela Guardian",
    when: "JUN 2026",
    what: "Invention concept and proprietary claims documented for provisional patent filing, covering the five-tier multilingual alert framework.",
  },
  { repo: "Sabela Guardian", when: "MAY 2026", what: "Repository opened; build now at v5.6.0." },
  {
    repo: "AWM Leadership Companion",
    when: "MAR 2026",
    what: "Deployed to Firebase hosting and serving live traffic.",
  },
  {
    repo: "Tender Response Assistant",
    when: "ONGOING",
    what: "Retrieval pipeline running on local embeddings, so indexing your documents costs nothing and only the final drafting call bills.",
  },
];

export const TICKER_ITEMS = [
  "Payments that clear",
  "One-time PINs that arrive",
  "Databases at the edge",
  "Signed webhooks, not trust",
  "Deploys that run without me",
  "Admin views you can actually run",
  "Shipped, not demoed",
  "Owned outright on handover",
];

export const SERVICES: ServiceItem[] = [
  {
    name: "Landing page",
    time: "48 HOURS",
    price: "From R6 500",
    body: "One page that has to convert. Written, built, deployed and measured.",
    items: [
      "Copy written with you, not filled in around a template",
      "Your domain, SSL and analytics configured",
      "Mobile-first, tested on real handsets",
    ],
  },
  {
    name: "Full website",
    time: "7 DAYS",
    price: "From R18 000",
    body: "A complete site for a business that has outgrown a social profile.",
    items: [
      "Multi-page structure with a content model you can edit",
      "Search fundamentals and performance budget",
      "Contact routing to email and WhatsApp",
    ],
  },
  {
    name: "Web app MVP",
    time: "10 DAYS",
    price: "From R45 000",
    body: "A real product: accounts, a database, money moving, an admin view.",
    items: [
      "Authentication and role-based access",
      "Payments — PayFast, Stripe or Yoco",
      "Admin dashboard so you can run it without me",
    ],
  },
  {
    name: "Automation & AI",
    time: "SCOPED PER JOB",
    price: "From R7 500",
    body: "The repetitive work in your business, handed to software that does not forget.",
    items: [
      "Document retrieval and grounded drafting",
      "WhatsApp and messaging pipelines",
      "Scheduled monitoring and alerting",
    ],
  },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    head: "LIVE BUILDS",
    links: [
      { label: "AWM Leadership Companion", href: "https://awm-leadership-companion.web.app" },
      { label: "AutoShow Dealer OS", href: "https://autoshowbloemfontein.co.za" },
      { label: "SabelaLogicAI", href: "/sabelalogicai.html" },
    ],
  },
  {
    head: "SITE",
    links: [
      { label: "Work", href: "/#work" },
      { label: "Case study", href: "/#proof" },
      { label: "Process", href: "/#process" },
      { label: "Architecture generator", href: "/#generator" },
      { label: "Blog", href: "/blog" },
      { label: "Workshop tools", href: "/workshop" },
      { label: "Team", href: "/team" },
      { label: "Start a build", href: "/start-a-build" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

export const KINDS = ["Landing page", "Full website", "Web app MVP", "Automation"];
export const NEED_OPTIONS = ["Landing page", "Full website", "Web app MVP", "Automation & AI", "Not sure yet"];
export const WHEN_OPTIONS = ["As soon as possible", "Within two weeks", "Within a month", "Just exploring"];

export const CONTACT = {
  whatsappNumber: "27661472774",
  email: "lunga@sabelalogic.co.za",
};
