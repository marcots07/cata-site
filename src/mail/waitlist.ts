import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

type Entry = { email: string; at: string };

type ResendFailure = {
  name: string;
  message: string;
  statusCode: number | null;
};

function resendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

/**
 * Resend's duplicate response is a 422 whose name is not in the SDK's error
 * union (`email_already_exists` and similar). Match the text so a second
 * signup of the same address still counts as success.
 */
function alreadyListed(error: ResendFailure) {
  const name = error.name.toLowerCase();
  const message = error.message.toLowerCase();
  if (name.includes("already_exists") || name.includes("duplicate")) return true;
  return /already (exists|in (the )?(audience|segment))|duplicate/.test(message);
}

function isEntry(value: unknown): value is Entry {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    typeof value.email === "string"
  );
}

/**
 * Puts the address on the waitlist segment. Creating a contact that already
 * exists does not apply `segments`, so that case is followed by an explicit add.
 */
async function saveWithResend(resend: Resend, email: string) {
  const segmentId = process.env.RESEND_SEGMENT_ID?.trim();
  const created = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  });

  if (!created.error) return true;
  if (!alreadyListed(created.error)) {
    console.error("Resend waitlist signup failed", created.error.name, created.error.statusCode);
    return false;
  }
  if (!segmentId) return true;

  const added = await resend.contacts.segments.add({ email, segmentId });
  if (!added.error || alreadyListed(added.error)) return true;
  console.error("Resend waitlist segment add failed", added.error.name, added.error.statusCode);
  return false;
}

async function saveLocally(email: string) {
  const file = path.join(process.cwd(), "data", "waitlist.json");
  await mkdir(path.dirname(file), { recursive: true });

  let entries: Entry[] = [];
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    if (Array.isArray(parsed)) entries = parsed.filter(isEntry);
  } catch {
    entries = [];
  }

  if (!entries.some((entry) => entry.email === email)) {
    entries.push({ email, at: new Date().toISOString() });
    await writeFile(file, `${JSON.stringify(entries, null, 2)}\n`);
  }
}

/** Saves a waitlist address. Uses the local file until `RESEND_API_KEY` is set. */
export async function saveWaitlistSignup(email: string) {
  const resend = resendClient();
  try {
    if (resend) return await saveWithResend(resend, email);
    await saveLocally(email);
    return true;
  } catch (error) {
    console.error("Waitlist signup failed", error instanceof Error ? error.name : "error");
    return false;
  }
}
