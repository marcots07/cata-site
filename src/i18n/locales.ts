export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function hasLocale(locale: string): locale is Locale {
  return locales.some((item) => item === locale);
}

export function htmlLang(locale: Locale) {
  return locale === "es" ? "es-MX" : "en";
}

export function openGraphLocale(locale: Locale) {
  return locale === "es" ? "es_MX" : "en_US";
}
