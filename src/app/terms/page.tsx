import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactEmail } from "@/site";

export const metadata: Metadata = {
  title: "Terms — Cata",
  description: "The terms for the Cata site and its waitlist.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms."
      lede="This site is a preview of Cata, an iPhone app that isn't out yet. Joining the list means you'd like to hear when it is."
    >
      <LegalSection title="The site">
        <p>
          The pages, words, pictures, and the scene at the top belong to Cata. You can look at them and share a link.
          Don&apos;t copy the site, and don&apos;t try to pull the waitlist off it.
        </p>
      </LegalSection>

      <LegalSection title="The waitlist">
        <p>
          Use an email address that is yours. Joining doesn&apos;t reserve a place, a price, or a launch date, and it
          doesn&apos;t promise that every feature described on the site will ship, or ship in that form.
        </p>
        <p>
          We&apos;ll use the address only as the <Link href="/privacy">privacy policy</Link> says: one note when Cata is
          ready. We can close the list, or drop an address that was submitted by a bot or that isn&apos;t a real inbox.
        </p>
      </LegalSection>

      <LegalSection title="The app">
        <p>
          Nothing here is the app. Scanning, pairing, asking, and the cellar are what we&apos;re building. When the app
          is available it will have its own terms, and those will cover using it.
        </p>
      </LegalSection>

      <LegalSection title="Wine">
        <p>
          Cata is for people who are of legal drinking age where they live. This site doesn&apos;t sell alcohol. Please
          enjoy it responsibly.
        </p>
      </LegalSection>

      <LegalSection title="As is">
        <p>
          The site is a preview, offered as it stands. We don&apos;t promise it will be up without interruption, and
          we&apos;re not responsible for losses from using it or from relying on a description of an app that isn&apos;t
          out yet.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions go to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
