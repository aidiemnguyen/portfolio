import type { Dictionary } from "@/i18n/types";

const en: Dictionary = {
  metadata: {
    title: "AI Diem — Built through history",
    description:
      "Senior Frontend Engineer portfolio — WebRTC, SaaS migration, and AI chat interfaces.",
  },
  road: {
    eyebrow: "My road",
    title: "Pick a stop",
    subtitle: "One road · four chapters · tap a pin to open it full screen.",
    mapAria: "Portfolio road map — choose a category",
    stops: {
      about: {
        district: "District I",
        hint: "Mission & bio",
      },
      projects: {
        district: "District II",
        hint: "Work through time",
      },
      stack: {
        district: "District III",
        hint: "Tools I reach for",
      },
      contact: {
        district: "Final stop",
        hint: "Say hello",
      },
    },
  },
  nav: {
    logo: "AI Diem.",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    language: "Language",
    skipToContent: "Skip to main content",
    about: "about",
    projects: "projects",
    stack: "stack",
    contact: "contact",
    mainNav: "Main navigation",
  },
  hero: {
    displayName: "frontend engineer",
    titleLine1: "built through",
    titleLine2: "history.",
  },
  mission: {
    lines: ["I build", "through", "real"],
    highlights: ["moments.", "not", "slides."],
    withLabel: "built with",
    pills: ["TypeScript", "WEBRTC", "Product sense"],
  },
  about: {
    stats: [
      { value: "7+", label: "Years shipping real products" },
      { value: "3", label: "Shipped project chapters" },
      { value: "50+", label: "Engineers using my design system" },
      { value: "3", label: "Products sharing 1 shared module system" },
    ],
    bio: "I ♡ clean code, honest feedback & knowing why we're building this in the first place.",
  },
  timeline: {
    heading: "projects",
    subheading: "Three shipped chapters — WebRTC, SaaS migration, and AI chat.",
    openChapter: "Open chapter",
  },
  chapter: {
    label: "Chapter",
    demo: "In motion",
    backToTimeline: "Back to timeline",
    company: "Company",
    role: "Role",
    team: "Team",
    technologies: "Technologies",
  },
  eras: [
    {
      year: 2020,
      slug: "webrtc-video",
      context:
        "The world went home. Screens became the only way to see each other.",
      project: "WebRTC Video Calling",
      description:
        "Extended WebRTC open source to build 1-1 and group video calls — managing media streams and bandwidth dynamically under real load. Stress-tested with 50+ concurrent users in a single meeting.",
      insight:
        "The best infrastructure is the kind people don't notice — until it's gone.",
      tags: ["WebRTC", "React", "TypeScript", "Node.js"],
      accent: "teal",
      detail: {
        company: "Lecle Vietnam",
        role: "Frontend Engineer",
        team: "4 engineers · 1 designer · shared ownership of media layer",
        technologies: ["WebRTC", "React", "TypeScript", "Node.js", "Socket.io"],
        demoType: "video-call",
        demo: {
          title: "Group call under load",
          steps: [
            "Peer connects to signaling server",
            "Media streams negotiated (50+ participants)",
            "Bandwidth adapts per connection",
            "Call stable — no dropped frames",
          ],
        },
      },
    },
    {
      year: 2022,
      slug: "joblogic-migration",
      context:
        "The world reopened. Field workers needed software that worked as hard as they did.",
      project: "SaaS Migration at Joblogic",
      description:
        "Led a jQuery → Vue.js migration for a UK SaaS platform used by field service companies. Built a shared design system in Storybook used by 50+ engineers.",
      insight:
        "Rewriting code is easy. Changing how a team thinks about building UI — that takes longer.",
      tags: ["Vue.js", "Storybook", "jQuery", "Design System"],
      accent: "purple",
      detail: {
        company: "Joblogic · Birmingham, UK (remote)",
        role: "Senior Frontend Engineer",
        team: "Platform squad · 50+ engineers across product teams",
        technologies: [
          "Vue.js 3",
          "Storybook",
          "Design tokens",
          "jQuery (legacy)",
          "Jest",
          "SCSS",
        ],
        demoType: "design-system",
        demo: {
          title: "Design system rollout",
          steps: [
            "Token defined once in Storybook",
            "Button component published",
            "Field teams adopt shared UI",
            "Legacy jQuery screens phased out",
          ],
        },
      },
    },
    {
      year: 2024,
      slug: "ai-chat",
      context: "AI changed what users expected from software overnight.",
      project: "AI Chat Interface",
      description:
        "Built the chat interface for an AI product — streaming responses, Markdown rendering, conversation state. The kind of detail that makes the difference between a prototype and something people actually want to use.",
      insight:
        "Streaming text sounds trivial until you realize how much of the experience lives in the delay.",
      tags: ["Next.js", "SSE", "React", "TypeScript"],
      accent: "teal",
      detail: {
        company: "Lecle Vietnam",
        role: "Frontend Engineer · Chat experience lead",
        team: "6 engineers · close loop with ML & product",
        technologies: ["Next.js", "Server-Sent Events", "React", "TypeScript"],
        demoType: "ai-stream",
        demo: {
          title: "Streaming response flow",
          steps: [
            "User sends a prompt",
            "Tokens stream via SSE",
            "Markdown renders live",
            "Conversation state persists",
          ],
        },
      },
    },
  ],
  stack: {
    heading: "stack",
    manifestTitle: "stack.manifest",
    manifestHint: "Tools I ship with — grouped by how often they show up.",
    groups: [
      {
        label: "I reach for every day",
        featured: true,
        items: [
          { label: "React / Next.js" },
          { label: "TypeScript" },
          { label: "TailwindCSS" },
          { label: "CSS / SCSS" },
        ],
      },
      {
        label: "I go deep when needed",
        items: [
          {
            label: "WebRTC",
            eraTag: { text: "↗ 2020", chapterIndex: 0 },
          },
          { label: "WebSockets" },
          { label: "SSR / SSG" },
          { label: "GraphQL" },
          { label: "REST APIs" },
        ],
      },
      {
        label: "I think in these at scale",
        items: [
          {
            label: "Storybook",
            eraTag: { text: "↗ 2022", chapterIndex: 1 },
          },
          { label: "Micro-frontends" },
          { label: "Turborepo" },
          { label: "Jest / Playwright" },
          { label: "Docker" },
        ],
      },
    ],
  },
  contact: {
    greetBefore: "Hey! My name is",
    namePlaceholder: "your name",
    greetMid: "and I am from",
    countryPlaceholder: "your country",
    topicBefore: "Let's connect about",
    topics: [
      { id: "collab", label: "Collaboration" },
      { id: "project", label: "Potential project" },
      { id: "network", label: "Networking" },
    ],
    emailBefore: "We can talk in more detail via email",
    sendLabel: "send_message()",
    socialBefore: "Or find me on",
    linkedIn: "LinkedIn",
    github: "GitHub",
    email: "aidiemnguyen2104@gmail.com",
    footer: "Thi Ai Diem Nguyen · Wrocław, Poland · 2025",
    formAriaLabel: "Contact form",
  },
};

export default en;
