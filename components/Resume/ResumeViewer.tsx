"use client";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getCvAssets } from "@/lib/cv-assets";
import { ResumeAutoPrint } from "./ResumeAutoPrint";
import { ResumeToolbar } from "./ResumeToolbar";
import styles from "./Resume.module.scss";

interface ResumeViewerProps {
  locale: Locale;
  dictionary: Dictionary;
  autoPrint: boolean;
}

export function ResumeViewer({
  locale,
  dictionary,
  autoPrint,
}: ResumeViewerProps) {
  const cv = getCvAssets(locale);

  return (
    <div className={styles.page}>
      <ResumeAutoPrint enabled={autoPrint} />
      <ResumeToolbar locale={locale} labels={dictionary.resume} cv={cv} />
      <iframe
        className={styles.pdfFrame}
        src={cv.pdf}
        title={dictionary.resume.pageTitle}
      />
    </div>
  );
}
