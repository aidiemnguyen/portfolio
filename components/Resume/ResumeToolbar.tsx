"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { CvAssets } from "@/lib/cv-assets";
import Link from "next/link";
import styles from "./Resume.module.scss";

interface ResumeToolbarProps {
  locale: Locale;
  labels: Dictionary["resume"];
  cv: CvAssets;
}

export function ResumeToolbar({ locale, labels, cv }: ResumeToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <Link href={`/${locale}`} className={styles.backLink}>
        ← {labels.backToSite}
      </Link>
      <div className={styles.toolbarActions}>
        {cv?.docx ? (
          <a href={cv.docx} className={styles.secondaryBtn} download>
            {labels.downloadDocx}
          </a>
        ) : null}
        <a href={cv.pdf} className={styles.secondaryBtn} download>
          {labels.downloadPdf}
        </a>
        <button
          type="button"
          className={styles.printBtn}
          onClick={() => window.print()}
        >
          {labels.printAction}
        </button>
      </div>
    </div>
  );
}
