"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

import { LocaleSwitch } from "./locale-switch";

export function SiteHeader({ lang, copy }: { lang: Locale; copy: Dictionary["header"] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const links = [
    { hash: "scan", label: copy.nav.scan },
    { hash: "pair", label: copy.nav.pair },
    { hash: "ask", label: copy.nav.ask },
    { hash: "cellar", label: copy.nav.cellar },
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-[1360px] items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? "border-parchment/10 bg-ink/85 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href={`/${lang}`} className="flex items-center" aria-label={copy.home}>
          <Image src="/brand/cata-logo.png" alt="" width={73} height={30} loading="eager" className="object-contain" />
        </Link>
        <nav className="hidden items-center gap-0.5 md:flex" aria-label={copy.sections}>
          {links.map((link) => (
            <Link
              key={link.hash}
              href={`/${lang}#${link.hash}`}
              className="rounded-full px-3 py-2 text-[14px] text-parchment/70 transition-colors hover:bg-parchment/[0.07] hover:text-parchment"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitch lang={lang} label={copy.language} english={copy.english} spanish={copy.spanish} />
          <Link
            href={`/${lang}#join`}
            className="inline-flex h-10 items-center rounded-full bg-parchment px-4 text-[14px] font-medium text-ink transition-colors hover:bg-paper sm:px-5"
          >
            <span className="sm:hidden">{copy.joinShort}</span>
            <span className="hidden sm:inline">{copy.join}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
