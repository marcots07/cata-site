import type { Metadata } from "next";

import { openGraphLocale, type Locale } from "./locales";

export function pageMeta(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  imageAlt: string,
): Metadata {
  const image = { url: "/og.jpg", width: 1200, height: 630, alt: imageAlt };
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        en: `/en${path}`,
        es: `/es${path}`,
        "x-default": `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: openGraphLocale(locale),
      alternateLocale: [locale === "es" ? "en_US" : "es_MX"],
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
