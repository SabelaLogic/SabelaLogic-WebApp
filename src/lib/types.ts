export type ProjectStatus = "LIVE" | "SHIPPING" | "R&D" | "CONCEPT" | "ARCHIVED";

export interface Project {
  name: string;
  kind: string;
  status: ProjectStatus;
  summary: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
  href2?: string;
  href2Label?: string;
  image?: string;
  slotHint?: string;
  flag?: boolean;
}

export interface CaseStudy {
  no: string;
  name: string;
  status: string;
  tone: string;
  problem: string;
  build: string;
  result: string;
  href?: string;
  cta?: string;
  href2?: string;
  cta2?: string;
}

export interface FlowNode {
  tag: string;
  tone: string;
  title: string;
  detail: string;
}

export interface EngineeringNote {
  head: string;
  body: string;
}

export interface ProcessPhase {
  day: string;
  title: string;
  body: string;
  out: string;
}

export interface BuildLogEntry {
  repo: string;
  when: string;
  what: string;
}

export interface ServiceItem {
  name: string;
  time: string;
  price: string;
  body: string;
  items: string[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  head: string;
  links: FooterLink[];
}

export type WorkstreamStatus = "complete" | "active" | "queued" | "blocked";

export interface Workstream {
  name: string;
  status: WorkstreamStatus;
  pct: number;
  phase?: string;
  milestone?: string;
}

export interface StageFaq {
  q: string;
  a: string;
}

export interface JourneyStage {
  date: string;
  timing: string;
  includes: string[];
  faq: StageFaq[];
}

export interface NarrationEvent {
  stage: string;
  src: string | null;
  el: HTMLElement;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  body: string[];
}
