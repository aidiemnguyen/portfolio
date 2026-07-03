import type { Locale } from "@/i18n/config";

/** Opens CV viewer; auto-print when the page loads with ?print=1. */
export function openPrintResume(locale: Locale) {
  if (typeof window === "undefined") return;
  window.open(`/${locale}/resume?print=1`, "_blank", "noopener,noreferrer");
}
