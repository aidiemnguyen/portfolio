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
    subtitle: "One road · five chapters · tap a pin to open it full screen.",
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
      approach: {
        district: "District III",
        hint: "How I ship",
      },
      stack: {
        district: "District IV",
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
    approach: "approach",
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
    skillGroups: [
      {
        label: "the basics, done well",
        items: ["React.js", "Next.js", "TypeScript"],
      },
      {
        label: "where i go deeper",
        items: ["WebRTC", "WebSockets", "SSR/SSG"],
      },
      {
        label: "how i think about scale",
        items: ["Storybook", "Turborepo", "Micro-frontends"],
      },
    ],
    bio: "I ♡ clean code, honest feedback & knowing why we're building this in the first place.",
  },
  approach: {
    title: "approach",
    meTitle: "How I work",
    otherTitle: "The usual rush",
    me: [
      "Pixel-perfect where it matters",
      "Stable support after launch",
      "Fixed scope, clear updates",
      "Motion with purpose",
      "Better than the Figma handoff",
      "Fast, human replies",
    ],
    other: [
      "Near enough layout",
      "Silence after deploy",
      "Scope creep & surprise invoices",
      "Animation for show",
      "Worse than the mockup",
      "Days between messages",
    ],
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
        company: "Tech startup · Remote-first",
        role: "Frontend Engineer",
        team: "4 engineers · 1 designer · shared ownership of media layer",
        technologies: [
          "WebRTC",
          "React",
          "TypeScript",
          "Node.js",
          "Socket.io",
          "Adaptive bitrate",
        ],
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
        company: "AI product startup",
        role: "Frontend Engineer · Chat experience lead",
        team: "6 engineers · close loop with ML & product",
        technologies: [
          "Next.js",
          "Server-Sent Events",
          "React",
          "TypeScript",
          "Markdown pipeline",
          "Framer Motion",
        ],
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
    tools: [
      { label: "React / Next.js", symbol: "⚛" },
      { label: "TypeScript", symbol: "TS" },
      { label: "CSS / TailwindCSS", symbol: "◈" },
      { label: "WebRTC", symbol: "◎" },
      { label: "Storybook", symbol: "▣" },
      { label: "Jest / Playwright", symbol: "✓" },
      { label: "Framer Motion", symbol: "→" },
      { label: "Figma", symbol: "◇" },
      { label: "Docker", symbol: "⬡" },
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
    channelBefore: "We can talk in more detail at",
    channels: [
      { id: "email", label: "Email" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "github", label: "GitHub" },
    ],
    sendLabel: "Send a message",
    linkedIn: "LinkedIn",
    github: "GitHub",
    email: "aidiemnguyen2104@gmail.com",
    footer: "Thi Ai Diem Nguyen · Wrocław, Poland · 2025",
    formAriaLabel: "Contact form",
  },
};

export default en;
