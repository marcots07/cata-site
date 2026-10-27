import type { ReactNode } from "react";
import Link from "next/link";

import type { Dictionary, LegalSection as LegalSectionCopy } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({
  lang,
  header,
  footer,
  title,
  lede,
  updated,
  children,
}: {
  lang: Locale;
  header: Dictionary["header"];
  footer: Dictionary["footer"];
  title: string;
  lede: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader lang={lang} copy={header} />
      <main className="mx-auto w-full max-w-[740px] px-6 pb-28 pt-36 sm:px-10 md:pt-44">
        <p className="eyebrow text-burgundy-bright">Cata</p>
        <h1 className="mt-5 font-display text-[clamp(3.2rem,7vw,5.2rem)] leading-[0.92] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment/70">{lede}</p>
        <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-parchment/40">{updated}</p>
        <div className="legal mt-14 space-y-11">{children}</div>
      </main>
      <SiteFooter lang={lang} copy={footer} />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.85rem] leading-tight tracking-[-0.02em] text-parchment">{title}</h2>
      <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-parchment/70">{children}</div>
    </section>
  );
}

function LegalText({
  text,
  email,
  privacyHref,
  privacyLabel,
}: {
  text: string;
  email: string;
  privacyHref: string;
  privacyLabel: string;
}) {
  if (!text.includes("{")) return <p>{text}</p>;
  const parts = text.split(/(\{email\}|\{privacy\})/g);
  return (
    <p>
      {parts.map((part, index) => {
        if (part === "{email}") {
          return (
            <a key={index} href={`mailto:${email}`}>
              {email}
            </a>
          );
        }
        if (part === "{privacy}") {
          return (
            <Link key={index} href={privacyHref}>
              {privacyLabel}
            </Link>
          );
        }
        return part;
      })}
    </p>
  );
}

export function LegalSections({
  sections,
  email,
  privacyHref,
  privacyLabel,
  address,
}: {
  sections: LegalSectionCopy[];
  email: string;
  privacyHref: string;
  privacyLabel: string;
  address?: string;
}) {
  return sections.map((section, index) => (
    <LegalSection key={section.title} title={section.title}>
      {section.blocks.map((block, blockIndex) =>
        "ul" in block && block.ul ? (
          <ul key={blockIndex}>
            {block.ul.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : "p" in block && block.p ? (
          <LegalText
            key={blockIndex}
            text={block.p}
            email={email}
            privacyHref={privacyHref}
            privacyLabel={privacyLabel}
          />
        ) : null,
      )}
      {address && index === sections.length - 1 ? <p>{address}</p> : null}
    </LegalSection>
  ));
}
