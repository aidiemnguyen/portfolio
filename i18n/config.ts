export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  pl: "PL",
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
