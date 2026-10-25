import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { contactAddress, contactEmail } from "@/site";

export const metadata: Metadata = {
  title: "Privacy policy — Cata",
  description: "What Cata keeps when you join the waitlist, and how to have it deleted.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy."
      lede="Joining the list gives us your email address and nothing else. We use it to tell you when Cata is ready, and we delete it when you ask."
    >
      <LegalSection title="What we collect">
        <p>When you join the waitlist, we store:</p>
        <ul>
          <li>The email address you typed.</li>
          <li>The time you joined.</li>
        </ul>
        <p>
          We don&apos;t ask for your name, and this site doesn&apos;t create an account. A hidden field on the form
          catches automated signups and is thrown away. It is never saved.
        </p>
        <p>
          To keep the form from being flooded, we count how many tries come from one network address and slow them
          down after a few in a minute. That count lives in memory and is not saved with your email.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          We use your email to write to you when Cata is ready to download. The site says one email, and that is the
          promise: we don&apos;t use the list for a newsletter, for offers, or for anything else.
        </p>
        <p>If you write to us, we use your address to reply.</p>
      </LegalSection>

      <LegalSection title="What we don't do">
        <ul>
          <li>We don&apos;t sell your email, and we don&apos;t share it for advertising.</li>
          <li>We don&apos;t use analytics, advertising pixels, or tracking cookies on this site.</li>
          <li>The wine scene in the browser is drawn on your device. Nothing about it is sent to us.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Who else sees it">
        <p>
          The list is private. Resend holds it and sends the launch note. Resend receives only the email address
          you typed. While Resend is not connected, the address stays in a file on the server that runs this site.
        </p>
        <p>
          The company that hosts the site keeps ordinary request logs, which can include a network address, to run the
          site and block abuse. Those logs are separate from the waitlist.
        </p>
        <p>We also share information if the law requires it.</p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep your email until we have sent the launch note, then delete it within 30 days. If you ask sooner, we
          delete it then. Asking means emailing{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> from the address you signed up with.
        </p>
        <p>
          You can also ask for a copy of what we hold, or for a correction. If Resend has a copy, we delete it there
          too.
        </p>
        <p>
          Joining the list is how you agree to this. You can take that back at any time by asking us to delete the
          address, and we will.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          This site doesn&apos;t set cookies. Fonts are part of the site itself, so visiting doesn&apos;t send your
          request to a font service.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Cata is about wine, and it isn&apos;t for anyone under the legal drinking age where they live. We don&apos;t
          knowingly keep an email from someone who is.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this page changes, the date at the top changes with it. If we ever want to use the list for something
          other than the launch note, we&apos;ll ask you first.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Cata. Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> for anything on this page.
        </p>
        {contactAddress ? <p>{contactAddress}</p> : null}
      </LegalSection>
    </LegalPage>
  );
}
