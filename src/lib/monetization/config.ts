/**
 * Monetization config — single source of truth for prices and product links.
 *
 * ⚠️ PLACEHOLDER PRICES: every amount marked PLACEHOLDER below must be
 * confirmed by Lunga before this ships. Amounts are in ZAR (whole rand);
 * Paystack is charged in kobo/cents (rand × 100).
 */

/** Public key — safe client-side. Override with NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY. */
export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_fd069e0542040895963a597ca1f70baafaccaba4";

export const PAYSTACK_CURRENCY = "ZAR";

/** PLACEHOLDER: deposit for the "Set it up for me" button on Workshop tool pages. */
export const TOOL_SETUP_DEPOSIT_ZAR = 500;

export const GUMROAD_BASE = "https://[REDACTED].gumroad.com/l/";

/** Workshop tool slug → Gumroad product. Tools not listed are GAPs (no link). See research/yt-monetization/tool-gumroad-map.md. */
export const TOOL_GUMROAD: Record<string, { slug: string; title: string }> = {
  "ux-analyzer": { slug: "xkpfxn", title: "Audit Pitch Swipe File for Developers" },
};

export interface ServiceOffer {
  id: string;
  name: string;
  summary: string;
  includes: string[];
  /** PLACEHOLDER: full fixed price in ZAR. */
  priceZar: number;
  /** PLACEHOLDER: deposit paid up front in ZAR. */
  depositZar: number;
  gumroadSlug?: string;
}

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    id: "wp-whatsapp-paystack",
    name: "WhatsApp booking + Paystack on WordPress",
    summary:
      "A booking flow on your existing WordPress site: customers pick a slot, pay a deposit through Paystack, and get a WhatsApp confirmation link.",
    includes: [
      "Booking form on one page of your site",
      "Paystack deposit checkout",
      "WhatsApp click-to-chat confirmation",
      "Handover notes for managing it yourself",
    ],
    priceZar: 4500, // PLACEHOLDER
    depositZar: 1500, // PLACEHOLDER
    gumroadSlug: "efgvub",
  },
  {
    id: "n8n-lead-follow-up",
    name: "n8n lead follow-up setup",
    summary:
      "An n8n workflow that captures new leads from your form, stores them, and sends a timed follow-up sequence so no enquiry is left waiting.",
    includes: [
      "One lead source connected (form, email or webhook)",
      "Lead stored in a sheet or database you own",
      "Follow-up email sequence",
      "Workflow export plus a walkthrough",
    ],
    priceZar: 3500, // PLACEHOLDER
    depositZar: 1000, // PLACEHOLDER
    gumroadSlug: "tuvtes",
  },
  {
    id: "nextjs-paystack",
    name: "Next.js + Paystack integration",
    summary:
      "Paystack checkout added to your Next.js app, with a server-side verification route so orders are only marked paid once Paystack confirms them.",
    includes: [
      "Inline or redirect checkout",
      "Server-side transaction verification",
      "Webhook handler for payment events",
      "Pull request into your repo with notes",
    ],
    priceZar: 6000, // PLACEHOLDER
    depositZar: 2000, // PLACEHOLDER
    gumroadSlug: "zmbcgg",
  },
];
