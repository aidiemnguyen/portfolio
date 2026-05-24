"use client";

import { DemoAnimation } from "@/components/ProjectModal/DemoAnimation";
import type { Locale } from "@/i18n/config";
import type { Dictionary, EraTranslation } from "@/i18n/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./ProjectPage.module.scss";

const YEAR_TO_ERA: Record<number, number> = {
  2020: 0,
  2022: 1,
  2024: 2,
  2025: 3,
};

interface ProjectPageProps {
  era: EraTranslation;
  locale: Locale;
  chapter: Dictionary["chapter"];
}

const ease = [0.22, 1, 0.36, 1] as const;

const section = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const pageStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

export function ProjectPage({ era, locale, chapter }: ProjectPageProps) {
  const accentClass =
    era.accent === "teal" ? styles.pageTeal : styles.pagePurple;

  useEffect(() => {
    const eraIndex = YEAR_TO_ERA[era.year] ?? 0;
    document.documentElement.setAttribute("data-era", String(eraIndex));
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.setAttribute("data-era", "0");
    };
  }, [era.year]);

  return (
    <motion.article
      className={`${styles.page} ${accentClass}`}
      initial="hidden"
      animate="show"
      variants={pageStagger}
    >
      <div className={styles.inner}>
        <motion.div variants={section}>
          <Link href={`/${locale}#timeline`} className={styles.back}>
            <span className={styles.backArrow} aria-hidden>
              ←
            </span>
            {chapter.backToTimeline}
          </Link>
        </motion.div>

        <motion.header className={styles.hero} variants={section}>
          <p className={styles.chapterMeta}>
            {chapter.label} · {era.year}
          </p>
          <p className={styles.yearWatermark} aria-hidden>
            {era.year}
          </p>
          <h1 className={styles.title}>{era.project}</h1>
        </motion.header>

        <motion.div className={styles.demoWrap} variants={section}>
          <DemoAnimation
            key={era.slug}
            type={era.detail.demoType}
            steps={era.detail.demo.steps}
            accent={era.accent}
            variant="hero"
            caption={`${chapter.demo} — ${era.detail.demo.title}`}
          />
        </motion.div>

        <motion.section className={styles.section} variants={section}>
          <p className={styles.context}>&ldquo;{era.context}&rdquo;</p>
        </motion.section>

        <motion.section
          className={`${styles.section} ${styles.narrativeBlock}`}
          variants={section}
        >
          {era.detail.company && (
            <div className={styles.narrativeItem}>
              <span className={styles.sectionLabel}>{chapter.company}</span>
              <p className={styles.narrativeValue}>{era.detail.company}</p>
            </div>
          )}
          {era.detail.role && (
            <div className={styles.narrativeItem}>
              <span className={styles.sectionLabel}>{chapter.role}</span>
              <p className={styles.narrativeValue}>{era.detail.role}</p>
            </div>
          )}
          {era.detail.team && (
            <div className={styles.narrativeItem}>
              <span className={styles.sectionLabel}>{chapter.team}</span>
              <p className={styles.narrativeValue}>{era.detail.team}</p>
            </div>
          )}
        </motion.section>

        <motion.blockquote className={styles.insight} variants={section}>
          {era.insight}
        </motion.blockquote>

        <motion.section className={styles.section} variants={section}>
          <span className={styles.sectionLabel}>{chapter.technologies}</span>
          <ul className={styles.techList}>
            {era.detail.technologies.map((tech) => (
              <li key={tech} className={styles.techTag}>
                {tech}
              </li>
            ))}
          </ul>
        </motion.section>

        {era.detail.links && era.detail.links.length > 0 && (
          <motion.nav className={styles.links} variants={section}>
            {era.detail.links.map((link) => (
              <Link
                key={link.href}
                href={
                  link.href.startsWith("#")
                    ? `/${locale}${link.href}`
                    : link.href
                }
                className={styles.link}
              >
                {link.label} →
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.article>
  );
}
