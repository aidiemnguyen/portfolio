import type { Dictionary } from "@/i18n/types";

const pl: Dictionary = {
  metadata: {
    title: "AI Diem — Zbudowane przez historię",
    description:
      "Portfolio Senior Frontend Engineer. Projekty powiązane z realnymi momentami w czasie — od WebRTC po interfejsy AI i przeprowadzkę do Polski.",
  },
  road: {
    eyebrow: "Moje przystanki",
    title: "Wybierz przystanek",
    subtitle:
      "Jedna droga · cztery rozdziały · kliknij pin, by otworzyć pełny ekran.",
    back: "Wróć na mapę",
    mapAria: "Mapa portfolio — wybierz kategorię",
    stops: {
      about: {
        district: "Dzielnica I",
        hint: "Misja i bio",
      },
      projects: {
        district: "Dzielnica II",
        hint: "Praca w czasie",
      },
      stack: {
        district: "Dzielnica III",
        hint: "Narzędzia",
      },
      contact: {
        district: "Koniec trasy",
        hint: "Napisz do mnie",
      },
    },
  },
  nav: {
    logo: "AI Diem.",
    themeLight: "Przełącz na jasny motyw",
    themeDark: "Przełącz na ciemny motyw",
    language: "Język",
    skipToContent: "Przejdź do treści",
    about: "o mnie",
    projects: "projekty",
    stack: "stack",
    contact: "kontakt",
    mainNav: "Nawigacja główna",
  },
  hero: {
    displayName: "frontend engineer",
    titleLine1: "zbudowane przez",
    titleLine2: "historię.",
    subtitle:
      "W 2025 roku spakowałam 7 lat pracy we frontendzie do dwóch walizek i przeprowadziłam się do Polski. Nie po to, by zaczynać od zera — ale by zbliżyć się do tego, dlaczego w ogóle tworzę rzeczy.",
    ctaWork: "zobacz projekty",
    ctaCv: "pobierz cv",
    scrollToWork: "Przewiń do projektów",
    originLabel: "Pochodzenie",
    originValue: "Wietnam",
    nowLabel: "Teraz",
    nowValue: "Wrocław, Polska",
    focusLabel: "Fokus",
    focusValue: "React · Next.js · Motion",
  },
  mission: {
    eyebrow: "Misja · 2025",
    lines: ["Tworzę", "przez", "prawdziwe"],
    highlights: ["momenty.", "nie", "slajdy."],
    withLabel: "zbudowane przez",
    pills: ["TypeScript", "WEBRTC", "Myślenie produktowe"],
  },
  about: {
    title: "krótko o mnie",
    stats: [
      { value: "7+", label: "Lat wysyłania produktów" },
      { value: "4", label: "Epoki, przez które przeszłam" },
      {
        value: "50+",
        label: "Inżynierów, którzy korzystają z mojego design systemu",
      },
      {
        value: "3",
        label: "Produkty, które korzystają z mojego systemu modułów",
      },
    ],
    bio: "Kocham czysty kod, szczery feedback i designerów, którym zależy na siatce. Senior frontend — interfejsy, które w poniedziałek nadal mają sens.",
  },
  timeline: {
    heading: "projekty",
    subheading: "Trzy rozdziały z ostatnich lat — WebRTC, migracja SaaS i chat AI.",
    openChapter: "Otwórz rozdział",
  },
  chapter: {
    label: "Rozdział",
    demo: "W ruchu",
    backToTimeline: "Wróć do osi czasu",
    company: "Firma",
    role: "Rola",
    team: "Zespół",
    technologies: "Technologie",
  },
  eras: [
    {
      year: 2020,
      slug: "webrtc-video",
      context:
        "Świat został w domach. Ekrany stały się jedynym sposobem, by się widzieć.",
      project: "Wideorozmowy WebRTC",
      description:
        "Rozszerzyłam open source WebRTC o rozmowy 1-1 i grupowe — dynamiczne zarządzanie strumieniami mediów i pasmem pod realnym obciążeniem. Testy obciążeniowe z 50+ użytkownikami w jednym spotkaniu.",
      insight:
        "Najlepsza infrastruktura to taka, której ludzie nie zauważają — dopóki nie zniknie.",
      tags: ["WebRTC", "React", "TypeScript", "Node.js"],
      accent: "teal",
      detail: {
        company: "Lecle Vietnam",
        role: "Frontend Engineer",
        team: "4 inżynierów · 1 designer · wspólna warstwa mediów",
        technologies: ["WebRTC", "React", "TypeScript", "Node.js", "Socket.io"],
        demoType: "video-call",
        demo: {
          title: "Rozmowa grupowa pod obciążeniem",
          steps: [
            "Peer łączy się z serwerem sygnalizacji",
            "Negocjacja strumieni (50+ uczestników)",
            "Pasmo dostosowuje się do połączenia",
            "Stabilny call — bez utraty klatek",
          ],
        },
      },
    },
    {
      year: 2022,
      slug: "joblogic-migration",
      context:
        "Świat znów otworzył drzwi. Pracownicy w terenie potrzebowali oprogramowania równie wytrwałego jak oni sami.",
      project: "Migracja SaaS w Joblogic",
      description:
        "Prowadziłam migrację jQuery → Vue.js dla brytyjskiej platformy SaaS dla firm serwisowych. Zbudowałam wspólny design system w Storybooku używany przez 50+ inżynierów.",
      insight:
        "Przepisanie kodu jest proste. Zmiana tego, jak zespół myśli o budowaniu UI — to trwa dłużej.",
      tags: ["Vue.js", "Storybook", "jQuery", "Design System"],
      accent: "purple",
      detail: {
        company: "Joblogic · Birmingham, UK (zdalnie)",
        role: "Senior Frontend Engineer",
        team: "Squad platformy · 50+ inżynierów w zespołach produktowych",
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
          title: "Wdrożenie design systemu",
          steps: [
            "Token zdefiniowany raz w Storybooku",
            "Komponent Button opublikowany",
            "Zespoły produktowe adoptują UI",
            "Ekrany jQuery wycofywane etapami",
          ],
        },
      },
    },
    {
      year: 2024,
      slug: "ai-chat",
      context:
        "AI z dnia na dzień zmieniło oczekiwania użytkowników wobec oprogramowania.",
      project: "Interfejs czatu AI",
      description:
        "Zbudowałam interfejs czatu dla produktu AI — streamowanie odpowiedzi, renderowanie Markdown, stan rozmowy. Detale, które odróżniają prototyp od czegoś, czego ludzie naprawdę chcą używać.",
      insight:
        "Streamowany tekst brzmi trywialnie, dopóki nie zrozumiesz, ile doświadczenia siedzi w opóźnieniu.",
      tags: ["Next.js", "SSE", "React", "TypeScript"],
      accent: "teal",
      detail: {
        company: "Lecle Vietnam",
        role: "Frontend Engineer · lead doświadczenia czatu",
        team: "6 inżynierów · ścisła współpraca z ML i produktem",
        technologies: ["Next.js", "Server-Sent Events", "React", "TypeScript"],
        demoType: "ai-stream",
        demo: {
          title: "Przepływ streamowanej odpowiedzi",
          steps: [
            "Użytkownik wysyła prompt",
            "Tokeny napływają przez SSE",
            "Markdown renderuje się na żywo",
            "Stan rozmowy jest zachowany",
          ],
        },
      },
    },
  ],
  stack: {
    heading: "stack",
    manifestTitle: "stack.manifest",
    manifestHint: "Narzędzia, z których korzystam — pogrupowane jak często się pojawiają.",
    groups: [
      {
        label: "Sięgam po to codziennie",
        featured: true,
        items: [
          { label: "React / Next.js" },
          { label: "TypeScript" },
          { label: "TailwindCSS" },
          { label: "CSS / SCSS" },
        ],
      },
      {
        label: "Zagłębiam się, gdy trzeba",
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
        label: "Myślę tym na skalę",
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
    greetBefore: "Cześć! Nazywam się",
    namePlaceholder: "twoje imię",
    greetMid: "i jestem z",
    countryPlaceholder: "twój kraj",
    topicBefore: "Porozmawiajmy o",
    topics: [
      { id: "collab", label: "Współpraca" },
      { id: "project", label: "Potencjalny projekt" },
      { id: "network", label: "Networking" },
    ],
    emailBefore: "Możemy pogadać dokładniej przez e-mail",
    sendLabel: "wyslij_wiadomosc()",
    socialBefore: "Albo znajdziesz mnie na",
    linkedIn: "LinkedIn",
    github: "GitHub",
    email: "aidiemnguyen2104@gmail.com",
    footer: "Thi Ai Diem Nguyen · Wrocław, Polska · 2025",
    formAriaLabel: "Formularz kontaktowy",
  },
};

export default pl;
