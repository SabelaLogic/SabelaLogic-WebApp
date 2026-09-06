export interface Contributor {
  slug: string;
  name: string;
  role: string;
  email: string;
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
];
