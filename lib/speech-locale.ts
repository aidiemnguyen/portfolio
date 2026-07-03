import type { Locale } from "@/i18n/config";

/** BCP-47 tags for Web Speech API (STT / TTS). */
const SPEECH_LANG: Record<Locale, string> = {
  en: "en-US",
  pl: "pl-PL",
};

export function speechLangForLocale(locale: Locale): string {
  return SPEECH_LANG[locale] ?? SPEECH_LANG.en;
}

export function replyLanguageName(locale: Locale): string {
  return locale === "pl" ? "Polish" : "English";
}
