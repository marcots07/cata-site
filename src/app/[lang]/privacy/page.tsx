import type { Metadata } from "next";

import { LegalPage, LegalSections } from "@/components/legal-page";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/i18n/metadata";
import { contactAddress, contactEmail, formatPolicyDate } from "@/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getDictionary();
  return pageMeta(locale, "/privacy", dict.privacy.title, dict.privacy.description, dict.meta.ogAlt);
}

export default async function PrivacyPage() {
  const { locale, dict } = await getDictionary();

  return (
    <LegalPage
      lang={locale}
      header={dict.header}
      footer={dict.footer}
      title={dict.privacy.heading}
      lede={dict.privacy.lede}
      updated={dict.legal.updated.replace("{date}", formatPolicyDate(locale))}
    >
      <LegalSections
        sections={dict.privacy.sections}
        email={contactEmail}
        privacyHref={`/${locale}/privacy`}
        privacyLabel={dict.legal.privacyLink}
        address={contactAddress}
      />
    </LegalPage>
  );
}
