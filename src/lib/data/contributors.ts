export interface Contributor {
  slug: string;
  name: string;
  role: string;
  email?: string;
  image: string;
  bio: string;
}

export const CONTRIBUTORS: Contributor[] = [
  {
    slug: "dominique-van-de-heuwel",
    name: "Dominique Van De Heuwel",
    role: "BPO Specialist & Digital Systems Architect",
    email: "dominiquevandeheuwel@live.com",
    image: "/team/dominique-portrait.webp",
    bio: "Brought in on builds that need process outsourcing expertise alongside the systems work — bridging how a business actually runs day to day with the software built around it.",
  },
  {
    slug: "grant-sepeesa",
    name: "Grant Sepeesa",
    role: "Strategic Business Development Partner",
    email: "mrgrantkeith@gmail.com",
    image: "/team/grant-portrait.webp",
    bio: "Opens the doors the code can't — sourcing and shaping the partnerships and client relationships that turn a build into an ongoing account.",
  },
  {
    slug: "tebogo-mosiane",
    name: "Tebogo Mosiane",
    role: "Lead Account Solutions Architect",
    image: "/team/tebogo-portrait.webp",
    bio: "Owns the handover from signed brief to running system — the account-level architecture that keeps a build serving the business long after launch.",
  },
];
