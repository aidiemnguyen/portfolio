import type { Dictionary } from "@/i18n/types";

const en: Dictionary = {
  metadata: {
    title: "AI Diem — Built through history",
    description:
      "Senior Frontend Engineer portfolio. Projects tied to real moments in time — from WebRTC to AI interfaces, and a move to Poland.",
  },
  road: {
    eyebrow: "My road",
    title: "Pick a stop",
    subtitle: "One road · four chapters · tap a pin to open it full screen.",
    back: "Back to the road",
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
    subtitle:
      "In 2025, I packed 7 years of frontend work into two suitcases and moved to Poland. Not to start over — but to get closer to why I build things in the first place.",
    ctaWork: "view projects",
    ctaCv: "download cv",
    scrollToWork: "Scroll to projects",
    originLabel: "Origin",
    originValue: "Vietnam",
    nowLabel: "Now",
    nowValue: "Wrocław, Poland",
    focusLabel: "Focus",
    focusValue: "React · Next.js · Motion",
  },
  mission: {
    eyebrow: "Mission · 2025",
    lines: ["I build", "through", "real"],
    highlights: ["moments.", "not", "slides."],
    withLabel: "built with",
    pills: ["TypeScript", "WEBRTC", "Product sense"],
  },
  about: {
    title: "simply about",
    stats: [
      { value: "7+", label: "Years shipping real products" },
      { value: "4", label: "Eras I built through" },
      { value: "50+", label: "Engineers using my design system" },
      { value: "3", label: "Products sharing 1 shared module system" },
    ],
    bio: "I ♡ clean code, honest feedback & knowing why we're building this in the first place.",
  },
  timeline: {
    heading: "projects",
    subheading: "Each era is a real moment in time — pick a chapter.",
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
    {
      year: 2025,
      slug: "poland-move",
      context: "A new country. A deliberate choice.",
      project: "The move to Poland",
      description:
        "Relocated to Wrocław. Started a Master's in Economics & Finance at University of Wrocław — not to leave engineering, but to understand the business context behind every product decision.",
      insight:
        "I want to know if we're building the right thing. Not just build the thing right.",
      tags: ["Wrocław", "Economics & Finance", "Open to work"],
      accent: "purple",
      detail: {
        company: "Wrocław, Poland · University of Wrocław",
        role: "Frontend Engineer · Master's student",
        team: "Solo chapter — building bridges between code & business",
        technologies: [
          "Economics & Finance",
          "Product thinking",
          "Next.js (personal projects)",
          "Open to senior frontend roles",
        ],
        demoType: "relocation",
        demo: {
          title: "The move in motion",
          steps: [
            "7 years of frontend → two suitcases",
            "Land in Wrocław",
            "Studies + engineering in parallel",
            "Ready for the next product team",
          ],
        },
        links: [
          {
            label: "Get in touch",
            href: "#contact",
          },
        ],
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
