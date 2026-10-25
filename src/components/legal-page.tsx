import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { policyUpdated } from "@/site";

export function LegalPage({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[740px] px-6 pb-28 pt-36 sm:px-10 md:pt-44">
        <p className="eyebrow text-burgundy-bright">Cata</p>
        <h1 className="mt-5 font-display text-[clamp(3.2rem,7vw,5.2rem)] leading-[0.92] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment/70">{lede}</p>
        <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-parchment/40">Updated {policyUpdated}</p>
        <div className="legal mt-14 space-y-11">{children}</div>
      </main>
      <SiteFooter />
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
