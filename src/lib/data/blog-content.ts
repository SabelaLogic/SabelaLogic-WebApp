import type { BlogPost } from "@/lib/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cost-of-the-paper-sign-in-book",
    title: "The Cost of Not Digitising: What a Paper Sign-In Book Really Costs You",
    excerpt:
      "A visitor book feels free. It isn't — it's a slow leak of time, leads and trust that most businesses only notice once someone else has already fixed it.",
    date: "2 SEP 2026",
    readTime: "4 MIN READ",
    tag: "CASE STUDY",
    body: [
      "Walk into most South African offices, estates or events and you'll still find the same object at the front desk: a ring-bound book, a pen on a string, and a queue of people writing their name and cellphone number by hand. It costs nothing to buy. It is not free to run.",
      "Every entry in that book is data nobody can use. A name and a number on paper cannot trigger a notification, cannot be searched when there's an incident, and cannot tell you how many people actually came through the door last month. The cost isn't the book — it's everything the book fails to do.",
      "We saw this pattern clearly on a recent build: a visitor management platform serving more than fifty buildings was still handling opt-in confirmations and entry notifications in weekly or monthly batches. Messages that should have reached a person in seconds arrived days later. Leads went cold because nobody found out in time that they'd shown interest. Staff spent hours each week manually tracking who had opted in and chasing down errors that a digital system would never have allowed in the first place.",
      "The fix wasn't a large rebuild. It was replacing one weak link — batch, manual communication — with an SMS gateway that could confirm and notify instantly, automatically, at the volume the business actually operated at. The book became a screen. The queue became a scan. And the data that used to die on a page started feeding back into decisions the business could actually make.",
      "If any part of your business still runs on a paper trail — sign-in sheets, order books, manual follow-up lists — the question worth asking isn't whether digitising is worth the cost. It's how much you're already paying, in slow leads and invisible drop-off, to keep not doing it.",
    ],
  },
  {
    slug: "why-your-business-needs-otp-not-just-a-password",
    title: "Why Your Business Needs an SMS One-Time PIN, Not Just a Password",
    excerpt:
      "Passwords protect accounts nobody wanted to create in the first place. An OTP protects the one thing your customer actually cares about: that it's really them.",
    date: "18 AUG 2026",
    readTime: "3 MIN READ",
    tag: "SECURITY",
    body: [
      "Most small businesses building their first online form default to the same pattern: get an email, get a password, make an account. It's familiar, it's what every SaaS product does, and it is very often the wrong tool for the job.",
      "A password is built for a person who's coming back — someone with a reason to remember a login and a stake in protecting it. Most of your customers aren't that. They're voting once, claiming a coupon once, checking in once. Asking them to create and remember a password for a single interaction is friction with no payoff — for them or for you.",
      "A one-time PIN sent by SMS solves a different, more honest problem: not \"who are you,\" but \"is this the same phone that started this.\" No account to create, no password to forget, no support ticket three weeks later asking to reset it. The phone number itself becomes the identity, verified in the moment it matters.",
      "We built exactly this for a recent awards voting platform: a phone number in, an SMS code out, one vote per verified number, no account layer in between. The entire flow — scan, enter number, enter code, vote — took under a minute per voter, at events running into the hundreds of participants, with no password-reset queue and no fake-account problem to police afterward.",
      "If your business is asking customers to create an account just to do something they'll only do once or twice, you're very likely paying for security you don't need and losing customers to friction you didn't have to add. An OTP is often the leaner, more honest fit.",
    ],
  },
  {
    slug: "automating-the-boring-20-percent",
    title: "Automating the Boring 20%: Where AI Actually Pays for Itself",
    excerpt:
      "Not every task in your business deserves an AI pilot project. A handful of them absolutely do — and they're usually the ones nobody enjoys doing anyway.",
    date: "5 AUG 2026",
    readTime: "4 MIN READ",
    tag: "AI & AUTOMATION",
    body: [
      "There's a lot of noise right now about AI \"transforming\" business, and most of it is aimed at enterprises with data teams and budgets most South African SMEs don't have. That noise obscures a much smaller, much more useful truth: a handful of specific, repetitive tasks in almost every business are ready to be automated today, cheaply, without a data science team.",
      "The pattern we look for is simple: work that is repetitive, rule-based or document-heavy, that a person currently has to do by hand, and that doesn't require judgement calls a machine shouldn't be making. Reading incoming documents and drafting a first-pass response. Answering the same five questions on WhatsApp all day. Checking a schedule and sending a reminder before something is missed.",
      "One build we run handles exactly this for tender responses: a retrieval pipeline reads a company's own documents using local embeddings, so indexing costs nothing, and only the final drafting call — the part that actually needs a capable model — bills anything at all. The business gets a grounded first draft in minutes instead of a afternoon of manual cross-referencing, and only pays for the expensive part of the job.",
      "That's the shape worth looking for in your own operation: find the 20% of work that is boring, repeatable and currently eating someone's afternoon, and automate only that. Not the whole business. Not a chatbot for everything. The specific, unglamorous task that's costing you hours every week for no reason other than nobody's built the small tool that would remove it.",
      "If you're not sure which 20% that is in your business, that's usually the first, cheapest conversation worth having — before any build gets scoped at all.",
    ],
  },
  {
    slug: "inside-sabela-logic-ten-days-not-ten-weeks",
    title: "Inside Sabela Logic: Why We Build in 10 Days, Not 10 Weeks",
    excerpt:
      "Most software timelines are padded for a team that doesn't exist on your project. Ours are set by what a working MVP genuinely takes to build properly, once.",
    date: "22 JUL 2026",
    readTime: "3 MIN READ",
    tag: "SABELA LOGIC",
    body: [
      "Ask most agencies for a web app and you'll get a quote with a ten-to-twelve week timeline attached, padded for handoffs between a project manager, a designer, a backend developer and a frontend developer who may never speak to each other directly. That padding isn't dishonesty — it's the real cost of coordinating a team. It's also a cost you shouldn't have to pay for a first version of your product.",
      "Sabela Logic's ten-day MVP timeline isn't a marketing number. It's what's actually achievable when one person owns the architecture, the build and the deploy pipeline end to end, with no translation layer between your brief and the code. Day zero is a written specification and a fixed quote you approve before anything is built. By day two, there's a live URL — not a mockup, a real repository with authentication and a database schema already running in production. Every day after that is a build you can open on your phone and react to.",
      "This isn't a claim that speed beats quality — it's the opposite. The tightness of the timeline is what forces the scope to stay honest: the primary journey gets built first and built properly, integrations and failure cases get hardened in days seven and eight specifically so they aren't skipped, and day ten is a full handover — your own accounts, your own repository, nothing left locked to me.",
      "We say this openly because it's a genuine constraint we work inside, not a guarantee that anything can be built in ten days. Some things can't, and we'll say so at day zero rather than after you've paid for week six. But for the landing page, the full website and the working MVP — the three things most South African businesses actually need first — ten days is a real number, not an aspirational one.",
    ],
  },
  {
    slug: "no-account-managers-solo-operator-model",
    title: "Meet the Builder: Why Sabela Logic Has No Account Managers",
    excerpt:
      "Every layer between you and the person writing your code is a place your requirements can get lost. We removed the layers instead of hiring around the problem.",
    date: "9 JUL 2026",
    readTime: "3 MIN READ",
    tag: "SABELA LOGIC",
    body: [
      "There's a version of this business that scales the conventional way: hire an account manager to take the brief, hire developers to build it, hire a project manager to keep the two talking to each other. It's a proven model. It's also the reason so many small businesses end up with a product that technically matches the brief and still isn't what they actually needed.",
      "Sabela Logic runs differently, by design rather than by necessity. You brief the person who architects the system. That same person writes the code, deploys it, and hands it to you at the end. There's no requirements document translated twice before it reaches an engineer, no account manager relaying a change request they don't fully understand. When something in the brief is ambiguous, the person who'll actually build it is the one asking the clarifying question — on day zero, not day thirty.",
      "This shows up in small, practical ways across every build: a client can message directly and get an answer from the person who knows exactly why a decision was made, not a summary passed along a chain. A bug reported before close of business gets fixed the same day, because there's no ticket queue between the report and the fix — there's one person who already understands the codebase.",
      "It also means being honest about scale: this model works because it stays deliberately small. It's why the fixed-price model exists, why timelines are set at ten days rather than stretched to fill a team's capacity, and why every case study on this site is a system one person actually built, end to end, rather than a portfolio piece assembled by a team you'd never meet.",
      "If you've been burned before by a brief that arrived at the developer's desk looking nothing like what you asked for, that's the specific problem this model is built to remove.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
