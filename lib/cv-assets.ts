import type { Locale } from "@/i18n/config";

export type CvAssets = {
  pdf: string;
  docx?: string;
};

const CV_PDF = "/cv/CV_Thi_Ai_Diem_Nguyen_Senior_Frontend.pdf";

const CV_BY_LOCALE: Record<Locale, CvAssets> = {
  en: { pdf: CV_PDF },
  pl: { pdf: CV_PDF },
};

export function getCvAssets(locale: Locale): CvAssets {
  return CV_BY_LOCALE[locale];
}
