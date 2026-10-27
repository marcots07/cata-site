import type { Metadata } from "next";

import { LegalPage, LegalSections } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/i18n/metadata";
import { contactEmail, formatPolicyDate } from "@/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return pageMeta(locale, "/terms", dict.terms.title, dict.terms.description, dict.meta.ogAlt);
}

export default async function TermsPage() {
  const { locale, dict } = await getDictionary();

  return (
    <LegalPage
      lang={locale}
      header={dict.header}
      footer={dict.footer}
      title={dict.terms.heading}
      lede={dict.terms.lede}
      updated={dict.legal.updated.replace("{date}", formatPolicyDate(locale))}
    >
      <LegalSections
        sections={dict.terms.sections}
        email={contactEmail}
        privacyHref={`/${locale}/privacy`}
        privacyLabel={dict.legal.privacyLink}
      />
    </LegalPage>
  );
}
