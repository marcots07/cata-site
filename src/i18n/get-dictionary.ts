import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import type { Dictionary } from "./dictionary";
import { en } from "./en";
import { es } from "./es";
import { defaultLocale, hasLocale, type Locale } from "./locales";

const dictionaries: Record<Locale, Dictionary> = { en, es };

export async function getDictionary(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return { locale, dict: dictionaries[locale] };
}

/** The 404 page also renders when the first segment isn't a locale, so it can't call notFound(). */
export async function getDictionaryOrDefault(): Promise<{ locale: Locale; dict: Dictionary }> {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  return { locale, dict: dictionaries[locale] };
}
