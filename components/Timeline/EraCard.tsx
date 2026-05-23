"use client";

import { AnimatedBackground } from "@/components/AnimatedBackground/AnimatedBackground";
import type { Locale } from "@/i18n/config";
import type { EraTranslation } from "@/i18n/types";
import Link from "next/link";
import styles from "./EraCard.module.scss";

interface EraCardProps {
  era: EraTranslation;
  index: number;
  locale: Locale;
  isActive: boolean;
  openLabel: string;
  variant?: "list" | "snap";
}

export function EraCard({
  era,
  index,
  locale,
  isActive,
  openLabel,
  variant = "list",
}: EraCardProps) {
  const accentMod =
    era.accent === "teal" ? styles.rowTeal : styles.rowPurple;
  const isPolandEra = era.year === 2025;
  const chapterNum = String(index + 1).padStart(2, "0");
  const isSnap = variant === "snap";

  return (
    <article
      className={`${styles.row} ${accentMod} ${isActive ? styles.rowActive : ""} ${isPolandEra ? styles.rowPoland : ""} ${isSnap ? styles.rowSnap : ""}`}
    >
      {isPolandEra && <AnimatedBackground variant="era" />}
      <Link
        href={`/${locale}/projects/${era.slug}`}
        className={styles.link}
        aria-label={`${openLabel}: ${era.project}`}
      >
        <span className={styles.index}>{chapterNum}</span>
        <span className={styles.year}>{era.year}</span>
        <div className={styles.body}>
          <p className={styles.context}>&ldquo;{era.context}&rdquo;</p>
          <h3 className={styles.project}>{era.project}</h3>
        </div>
        <span className={styles.action}>
          <span className={styles.actionLabel}>{openLabel}</span>
          <span className={styles.arrow} aria-hidden>
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
