"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { locales, type Locale } from "@/i18n/locales";

export function LocaleSwitch({
  lang,
  label,
  english,
  spanish,
}: {
  lang: Locale;
  label: string;
  english: string;
  spanish: string;
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");

  return (
    <nav aria-label={label} className="flex items-center text-[11px] font-medium tracking-[0.18em]">
      {locales.map((locale, index) => {
        const active = locale === lang;
        return (
          <span key={locale} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-1.5 text-parchment/25">
                /
              </span>
            ) : null}
            <Link
              href={`/${locale}${rest}${hash}`}
              hrefLang={locale}
              lang={locale}
              scroll={false}
              aria-current={active ? "page" : undefined}
              aria-label={locale === "en" ? english : spanish}
              className={`rounded-full px-1.5 py-1 transition-colors ${
                active ? "text-parchment" : "text-parchment/40 hover:text-parchment/80"
              }`}
            >
              {locale === "en" ? "EN" : "ES"}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
