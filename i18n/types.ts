import type { EraAccent } from "@/data/eras";
import type { RoadStopId } from "@/data/road-stops";

export type DemoAnimationType =
  | "video-call"
  | "design-system"
  | "ai-stream"
  | "relocation";

export interface EraDetail {
  role: string;
  team: string;
  technologies: string[];
  demo: {
    title: string;
    steps: string[];
  };
  demoType: DemoAnimationType;
  links?: { label: string; href: string }[];
  company?: string;
}

export interface EraTranslation {
  year: number;
  slug: string;
  context: string;
  project: string;
  description: string;
  insight: string;
  tags: string[];
  accent: EraAccent;
  detail: EraDetail;
}

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  road: {
    eyebrow: string;
    title: string;
    subtitle: string;
    back: string;
    mapAria: string;
    stops: Record<RoadStopId, { district: string; hint: string }>;
  };
  nav: {
    logo: string;
    themeLight: string;
    themeDark: string;
    language: string;
    skipToContent: string;
    about: string;
    projects: string;
    approach: string;
    stack: string;
    contact: string;
    mainNav: string;
  };
  hero: {
    displayName: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaWork: string;
    ctaCv: string;
    scrollToWork: string;
    originLabel: string;
    originValue: string;
    nowLabel: string;
    nowValue: string;
    focusLabel: string;
    focusValue: string;
  };
  mission: {
    eyebrow: string;
    lines: string[];
    highlights: string[];
    withLabel: string;
    pills: string[];
  };
  about: {
    title: string;
    stats: { value: string; label: string }[];
    skillGroups: { label: string; items: string[] }[];
    bio: string;
  };
  approach: {
    title: string;
    introLabel: string;
    intro: string;
    subintro: string;
    meTitle: string;
    otherTitle: string;
    me: string[];
    other: string[];
  };
  timeline: {
    heading: string;
    subheading: string;
    openChapter: string;
  };
  chapter: {
    label: string;
    demo: string;
    backToTimeline: string;
    company: string;
    role: string;
    team: string;
    technologies: string;
  };
  eras: EraTranslation[];
  stack: {
    heading: string;
    tools: { label: string; symbol: string }[];
  };
  contact: {
    greetBefore: string;
    namePlaceholder: string;
    greetMid: string;
    countryPlaceholder: string;
    topicBefore: string;
    topics: { id: string; label: string }[];
    emailBefore: string;
    sendLabel: string;
    socialBefore: string;
    linkedIn: string;
    github: string;
    email: string;
    footer: string;
    formAriaLabel: string;
  };
}
