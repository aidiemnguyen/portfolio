import type { RoadStopId } from "@/data/road-stops";

export type EraAccent = "teal" | "purple";

export type DemoAnimationType = "video-call" | "design-system" | "ai-stream";

export interface EraDetail {
  role: string;
  team: string;
  technologies: string[];
  demo: {
    title: string;
    steps: string[];
  };
  demoType: DemoAnimationType;
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
    stack: string;
    contact: string;
    mainNav: string;
    resume: string;
    resumePrint: string;
  };
  hero: {
    displayName: string;
    titleLine1: string;
    titleLine2: string;
  };
  mission: {
    lines: string[];
    highlights: string[];
    withLabel: string;
    pills: string[];
  };
  about: {
    stats: { value: string; label: string }[];
    bio: string;
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
    manifestTitle: string;
    manifestHint: string;
    groups: {
      label: string;
      featured?: boolean;
      items: {
        label: string;
        eraTag?: { text: string; chapterIndex: number };
      }[];
    }[];
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
  resume: {
    pageTitle: string;
    printAction: string;
    backToSite: string;
    downloadPdf: string;
    downloadDocx: string;
  };
  voice: {
    fabAria: string;
    dialogAria: string;
    close: string;
    closeAria: string;
    typeQuestion: string;
    speakHint: string;
    thinking: string;
    micUnavailable: string;
    inputPlaceholder: string;
    inputAria: string;
    send: string;
    offline: string;
    apiError: string;
    welcome: {
      badge: string;
      title: string;
      description: string;
      highlight: string;
      hint: string;
      example: string;
      tryCta: string;
      skipCta: string;
      closeAria: string;
    };
  };
}
