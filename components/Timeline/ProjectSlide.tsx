"use client";

import type { Locale } from "@/i18n/config";
import type { EraTranslation } from "@/i18n/types";
import Link from "next/link";
import styles from "./ProjectSlide.module.scss";

interface ProjectSlideProps {
  era: EraTranslation;
  index: number;
  locale: Locale;
  openLabel: string;
  isActive?: boolean;
  layout?: "full" | "timeline" | "grid";
}

export function ProjectSlide({
  era,
  index,
  locale,
  openLabel,
  isActive = true,
  layout = "full",
}: ProjectSlideProps) {
  const accentClass =
    era.accent === "teal" ? styles.slideTeal : styles.slidePurple;
  const chapterNum = String(index + 1).padStart(2, "0");
  const href = `/${locale}/projects/${era.slug}`;
  const isGrid = layout === "grid";
  const isTimeline = layout === "timeline";

  return (
    <article
      className={`${styles.slide} ${accentClass} ${isTimeline ? styles.slideTimeline : ""} ${isGrid ? styles.slideGrid : ""} ${isActive ? styles.slideActive : ""}`}
      data-era-index={index}
      aria-hidden={!isActive}
    >
      <div
        className={`${styles.canvas} ${era.accent === "teal" ? styles.canvasTeal : styles.canvasPurple}`}
        aria-hidden
      />
      <div
        className={`${styles.orb} ${era.accent === "teal" ? styles.orbTeal : styles.orbPurple}`}
        aria-hidden
      />

      {!isTimeline && !isGrid && (
        <span className={styles.yearGhost} aria-hidden>
          {era.year}
        </span>
      )}

      <div
        className={`${styles.content} ${isTimeline ? styles.contentTimeline : ""} ${isGrid ? styles.contentGrid : ""}`}
      >
        {isGrid && (
          <span className={styles.yearBadge} aria-hidden>
            {era.year}
          </span>
        )}

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

        <blockquote className={styles.quote}>
          &ldquo;{era.context}&rdquo;
        </blockquote>

        <p className={styles.insight}>{era.insight}</p>

        <Link
          href={href}
          className={styles.cta}
          aria-label={`${openLabel}: ${era.project}`}
          tabIndex={isActive ? 0 : -1}
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
