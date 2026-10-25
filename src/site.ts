/**
 * Inbox for waitlist and privacy requests. Set CONTACT_EMAIL before launch
 * so this is an address you actually read.
 */
export const contactEmail = process.env.CONTACT_EMAIL?.trim() || "hello@cata.app";

/** Optional postal address, shown on the privacy policy when set. */
export const contactAddress = process.env.CONTACT_ADDRESS?.trim() || "";

export const policyUpdated = "October 24, 2026";
