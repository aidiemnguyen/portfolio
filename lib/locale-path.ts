import { locales, type Locale } from "@/i18n/config";

/** Same rules as LanguageSwitcher — swap locale segment in the current path. */
export function pathForLocale(pathname: string, target: Locale): string {
  if (!pathname) return `/${target}`;
  const segments = pathname.split("/");
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}${pathname}`;
}
