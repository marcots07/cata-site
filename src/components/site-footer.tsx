import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

export function SiteFooter({ lang, copy }: { lang: Locale; copy: Dictionary["footer"] }) {
  const sections = [
    { href: `/${lang}#scan`, label: copy.scan },
    { href: `/${lang}#pair`, label: copy.pair },
    { href: `/${lang}#ask`, label: copy.ask },
    { href: `/${lang}#cellar`, label: copy.cellar },
    { href: `/${lang}#join`, label: copy.waitlist },
  ];
  const legal = [
    { href: `/${lang}/privacy`, label: copy.privacy },
    { href: `/${lang}/terms`, label: copy.terms },
  ];

  return (
    <footer className="border-t border-parchment/[0.08] bg-ink">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-10 px-6 py-14 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href={`/${lang}`} className="block w-fit" aria-label={copy.home}>
            <Image src="/brand/cata-logo.png" alt="" width={116} height={48} className="object-contain" />
          </Link>
          <p className="mt-3 text-[15px] text-parchment/50">{copy.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[14px] text-parchment/60" aria-label={copy.sections}>
          {sections.map((link) => (
            <Link key={link.href} className="transition-colors hover:text-parchment" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 text-[13px] text-parchment/40">
          <nav className="flex gap-x-5" aria-label={copy.legal}>
            {legal.map((link) => (
              <Link key={link.href} className="transition-colors hover:text-parchment" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p>{copy.rights}</p>
        </div>
      </div>
    </footer>
  );
}
