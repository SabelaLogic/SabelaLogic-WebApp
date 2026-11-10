import type { ToolFaq } from "@/lib/data/workshop-content";

/*
 * Extra on-page copy for /services and /start-a-build. Every statement here
 * restates something the site already commits to elsewhere (the services
 * cards, the turnaround table, the 10-day process, the footer ownership line)
 * — no new promises, no invented numbers. Keep it that way when editing.
 */

export const SERVICES_STEPS: string[] = [
  "Pick the setup that matches what you need and pay its deposit through Paystack. The full price and the deposit are shown on each card.",
  "I email you to collect the access details the setup needs (for example your WordPress admin, n8n instance or repository) and we agree a start date.",
  "I build the setup inside the scope listed on the card.",
  "You get the handover notes, workflow export or pull request listed on the card, and the balance is due on handover.",
];

export const SERVICES_FAQS: ToolFaq[] = [
  {
    q: "What does the deposit cover?",
    a: "The deposit books the work in. Once it's paid I contact you by email to collect access details and agree a start date. The rest of the fixed price is due on handover.",
  },
  {
    q: "Can I pay from outside South Africa?",
    a: "Yes. Prices are in South African rand and Paystack converts the amount for international cards at checkout.",
  },
  {
    q: "What if my project doesn't fit one of these scopes?",
    a: "Use Start a build instead. Describe what you need, get an instant architecture plan, and send the brief for a fixed quote and delivery date within 24 hours.",
  },
  {
    q: "Who owns the finished setup?",
    a: "You do. All builds are owned outright by the client on final payment.",
  },
  {
    q: "Can I set it up myself instead?",
    a: "Where a do-it-yourself guide exists for a setup, the card links to it under \u201cPrefer to do it yourself?\u201d.",
  },
];

export const START_A_BUILD_STEPS: string[] = [
  "Describe what you want built in the generator below. It returns a suggested stack, data model, the risky parts and a day-by-day schedule.",
  "Send the brief with the contact form. You'll get a fixed quote and a delivery date back within 24 hours, or a quick, honest answer if it isn't a fit.",
  "If you go ahead, the work starts with a written specification: what the build does, what it explicitly does not do, the data model and the stack. You approve it before anything is built, and the fixed price is set there.",
  "Delivery times are counted from brief acceptance. At handover you own everything outright: for a web app MVP that means your own accounts, your own repository, an admin walkthrough and a written operations note.",
];

export const START_A_BUILD_FAQS: ToolFaq[] = [
  {
    q: "How quickly will I get a quote?",
    a: "Within 24 hours of sending the brief, you'll have a fixed quote and a delivery date. If the project isn't a fit, I'll say so quickly and point you somewhere better.",
  },
  {
    q: "Is the architecture plan a quote?",
    a: "No. The generator gives you an instant starting plan so the brief you send is clearer. The fixed price is set after we agree a written specification.",
  },
  {
    q: "Who will I be working with?",
    a: "One person: Lunga Xhamela, the sole architect and engineer. There is no account manager in between and the work isn't passed to someone you haven't met.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Builds are owned outright by the client on final payment, and the handover moves everything to your own accounts and repository.",
  },
  {
    q: "I only need a small, fixed setup. Is there a faster route?",
    a: "Yes. The fixed-price services page has defined-scope setups you can book directly with a deposit.",
  },
];
