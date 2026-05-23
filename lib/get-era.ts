import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { EraTranslation } from "@/i18n/types";

export async function getEraBySlug(
  locale: string,
  slug: string
): Promise<{ era: EraTranslation; locale: Locale } | null> {
  if (!isValidLocale(locale)) return null;

  const dictionary = await getDictionary(locale);
  const era = dictionary.eras.find((e) => e.slug === slug);

  if (!era) return null;

  return { era, locale };
}
