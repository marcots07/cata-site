import { saveWaitlistSignup } from "@/mail/waitlist";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hits = new Map<string, { count: number; reset: number }>();

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

function limited(key: string) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || row.reset < now) {
    hits.set(key, { count: 1, reset: now + 60_000 });
    return false;
  }
  row.count += 1;
  return row.count > 8;
}

export async function POST(request: Request) {
  if (limited(clientKey(request))) {
    return Response.json(
      { error: "Too many tries. Wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send an email address." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Send an email address." }, { status: 400 });
  }

  const company = "company" in body && typeof body.company === "string" ? body.company : "";
  if (company.trim().length > 0) {
    return Response.json({ ok: true });
  }

  const email =
    "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  const saved = await saveWaitlistSignup(email);
  if (!saved) {
    return Response.json({ error: "Couldn't save that just now. Try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
