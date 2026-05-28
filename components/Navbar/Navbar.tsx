"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import type { RoadStopId } from "@/data/road-stops";
import type { FullPageSectionId } from "@/lib/section-scroll";
import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import styles from "./Navbar.module.scss";

const roadNavKeys: { key: RoadStopId; navKey: RoadStopId }[] = [
  { key: "about", navKey: "about" },
  { key: "projects", navKey: "projects" },
  { key: "stack", navKey: "stack" },
  { key: "contact", navKey: "contact" },
];

function SunIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  );
}

interface NavbarProps {
  onScrollToSection?: (id: RoadStopId) => void;
  onScrollToRoad?: () => void;
  activeSection?: FullPageSectionId;
  showRoadLinks?: boolean;
}

export function Navbar({
  onScrollToSection,
  onScrollToRoad,
  activeSection,
  showRoadLinks,
}: NavbarProps) {
  const { dictionary } = useLocaleContext();
  const { nav } = dictionary;
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const theme = resolvedTheme ?? "light";
  const isDark = mounted && theme === "dark";

  return (
    <>
      <a href="#road" className={styles.skip} onClick={() => onScrollToRoad?.()}>
        {nav.skipToContent}
      </a>
      <motion.header
        className={styles.navbar}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <button
          type="button"
          className={styles.logo}
          onClick={() => onScrollToRoad?.()}
        >
          {nav.logo}
        </button>
        {showRoadLinks && onScrollToSection ? (
          <nav className={styles.links} aria-label={nav.mainNav}>
            {roadNavKeys.map(({ key, navKey }) => (
              <button
                key={key}
                type="button"
                className={`${styles.link} ${activeSection === navKey ? styles.linkActive : ""}`}
                onClick={() => onScrollToSection(navKey)}
                aria-current={activeSection === navKey ? "true" : undefined}
              >
                {nav[navKey]}
              </button>
            ))}
          </nav>
        ) : (
          <div className={styles.links} aria-hidden />
        )}
        <div className={styles.actions}>
          <LanguageSwitcher />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? nav.themeLight : nav.themeDark}
          >
            {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <SunIcon />}
          </button>
        </div>
      </motion.header>
    </>
  );
}
