import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionaryOrDefault } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const { locale, dict } = await getDictionaryOrDefault();

  return (
    <>
      <SiteHeader lang={locale} copy={dict.header} />
      <main className="mx-auto flex min-h-[78svh] w-full max-w-[740px] flex-col justify-center px-6 pb-24 pt-36 sm:px-10">
        <p className="eyebrow text-burgundy-bright">404</p>
        <h1 className="mt-5 text-balance font-display text-[clamp(3.2rem,7vw,5.2rem)] leading-[0.92] tracking-[-0.03em]">
          {dict.notFound.heading}
        </h1>
        <p className="mt-6 max-w-[30rem] text-lg leading-relaxed text-parchment/70">{dict.notFound.body}</p>
        <Link
          href={`/${locale}`}
          className="mt-10 inline-flex h-11 w-fit items-center rounded-full bg-parchment px-5 text-[14px] font-medium text-ink transition-colors hover:bg-paper"
        >
          {dict.notFound.home}
        </Link>
      </main>
      <SiteFooter lang={locale} copy={dict.footer} />
    </>
  );
}
