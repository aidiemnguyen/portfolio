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
  isActive: boolean;
}

export function ProjectSlide({
  era,
  index,
  locale,
  openLabel,
  isActive,
}: ProjectSlideProps) {
  const accentClass =
    era.accent === "teal" ? styles.cardTeal : styles.cardPurple;
  const chapterNum = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}
      data-era-index={index}
      aria-hidden={!isActive}
    >
      <div className={styles.bgDark}>
        <span className={styles.watermark} aria-hidden>
          {era.year}
        </span>
      </div>
      <div className={styles.bgLight}>
        <span className={styles.lightBeam} aria-hidden />
      </div>
      <div className={styles.center}>
        <Link
          href={`/${locale}/projects/${era.slug}`}
          className={styles.label}
        >
          {era.project}
          <span className={styles.labelArrow} aria-hidden>
            ↗
          </span>
        </Link>
        <Link
          href={`/${locale}/projects/${era.slug}`}
          className={`${styles.card} ${accentClass}`}
          aria-label={`${openLabel}: ${era.project}`}
        >
          <span className={styles.cardChapter}>
            {openLabel} · {chapterNum}
          </span>
          <p className={styles.cardQuote}>&ldquo;{era.context}&rdquo;</p>
          <p className={styles.cardInsight}>{era.insight}</p>
          <span className={styles.cardCta}>
            {openLabel}
            <span aria-hidden> →</span>
          </span>
        </Link>
      </div>
    </article>
  );
}
