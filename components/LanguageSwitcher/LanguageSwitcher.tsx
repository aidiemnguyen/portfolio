"use client";

import { localeLabels, locales, type Locale } from "@/i18n/config";
import { pathForLocale } from "@/lib/locale-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocaleContext } from "@/contexts/LocaleContext";
import styles from "./LanguageSwitcher.module.scss";

export function LanguageSwitcher() {
  const { locale, dictionary } = useLocaleContext();
  const pathname = usePathname();

  function hrefFor(target: Locale) {
    return pathForLocale(pathname ?? "", target);
  }

  return (
    <nav
      className={styles.switcher}
      aria-label={dictionary.nav.language}
    >
      {locales.map((loc) => (
        <Link
          key={loc}
          href={hrefFor(loc)}
          className={`${styles.link} ${locale === loc ? styles.active : ""}`}
          aria-current={locale === loc ? "true" : undefined}
          hrefLang={loc}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </nav>
  );
}
