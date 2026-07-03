"use client";

import type { Locale } from "@/i18n/config";
import type { EraTranslation } from "@/i18n/types";
import Link from "next/link";
import { ProjectPreview } from "./ProjectPreview";
import styles from "./ProjectSlide.module.scss";

interface ProjectSlideProps {
  era: EraTranslation;
  locale: Locale;
  openLabel: string;
}

export function ProjectSlide({ era, locale, openLabel }: ProjectSlideProps) {
  const accentClass =
    era.accent === "teal" ? styles.slideTeal : styles.slidePurple;
  const href = `/${locale}/projects/${era.slug}`;

  return (
    <article className={`${styles.slide} ${accentClass}`}>
      <div
        className={`${styles.canvas} ${era.accent === "teal" ? styles.canvasTeal : styles.canvasPurple}`}
        aria-hidden
      />
      <div
        className={`${styles.orb} ${era.accent === "teal" ? styles.orbTeal : styles.orbPurple}`}
        aria-hidden
      />

      <div className={styles.content}>
        <span className={styles.yearBadge} aria-hidden>
          {era.year}
        </span>

        <ProjectPreview
          type={era.detail.demoType}
          accent={era.accent}
          label={era.detail.demo.title}
        />

        <div className={styles.meta}>
          {era.detail.company && (
            <span className={styles.company}>{era.detail.company}</span>
          )}
          <ul className={styles.tags} aria-label="Technologies">
            {era.tags.slice(0, 3).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>

        <h3 className={styles.title}>{era.project}</h3>

        <Link
          href={href}
          className={styles.cta}
          aria-label={`${openLabel}: ${era.project}`}
        >
          <span>{openLabel}</span>
          <span className={styles.ctaArrow} aria-hidden>
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
