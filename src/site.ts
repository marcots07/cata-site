/**
 * Inbox for waitlist and privacy requests. Set CONTACT_EMAIL before launch
 * so this is an address you actually read.
 */
export const contactEmail = process.env.CONTACT_EMAIL?.trim() || "hello@cata.app";

/** Optional postal address, shown on the privacy policy when set. */
export const contactAddress = process.env.CONTACT_ADDRESS?.trim() || "";

const policyUpdated = "2026-10-24";

export function formatPolicyDate(locale: "en" | "es") {
  return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${policyUpdated}T12:00:00Z`));
}
