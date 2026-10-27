"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import type { Dictionary } from "@/i18n/dictionary";

import { ArrowRight } from "./icons";

type Status = "idle" | "sending" | "done" | "error";
type FormError = keyof Dictionary["form"]["errors"];

const ERRORS: readonly FormError[] = ["rate_limited", "invalid", "failed"];

function isFormError(value: string): value is FormError {
  return ERRORS.some((error) => error === value);
}

export function WaitlistForm({
  id,
  align = "start",
  copy,
  privacyHref,
}: {
  id: string;
  align?: "start" | "center";
  copy: Dictionary["form"];
  privacyHref: string;
}) {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const locked = status === "sending" || status === "done";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;

    const data = new FormData(event.currentTarget);
    const company = String(data.get("company") ?? "");
    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const body: unknown = await response.json().catch(() => null);
      const error =
        body && typeof body === "object" && "error" in body && typeof body.error === "string"
          ? body.error
          : null;

      if (!response.ok) {
        setStatus("error");
        setMessage(error && isFormError(error) ? copy.errors[error] : copy.errors.failed);
        return;
      }

      setStatus("done");
      setMessage(copy.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(copy.errors.failed);
    }
  }

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="w-full max-w-[29rem]">
      <label htmlFor={fieldId} className="sr-only">
        {copy.label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-full border bg-parchment/[0.07] p-1.5 pl-5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-colors duration-300 focus-within:bg-parchment/[0.11] ${
          status === "error"
            ? "border-burgundy-bright/70"
            : "border-parchment/15 focus-within:border-parchment/40"
        }`}
      >
        <input
          id={fieldId}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={copy.placeholder}
          value={email}
          disabled={locked}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-parchment outline-none placeholder:text-parchment/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={locked}
          className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-parchment px-5 text-[14px] font-medium text-ink transition-[background-color,transform] duration-300 hover:bg-paper active:scale-[0.98] disabled:cursor-default disabled:opacity-80"
        >
          {status === "sending" ? (
            copy.sending
          ) : status === "done" ? (
            copy.done
          ) : (
            <>
              <span className="sm:hidden">{copy.joinShort}</span>
              <span className="hidden sm:inline">{copy.join}</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <p
        role="status"
        className={`mt-3 min-h-5 px-5 text-[13px] ${align === "center" ? "text-center" : ""} ${
          status === "error" ? "text-[#f0a6a1]" : "text-parchment/50"
        }`}
      >
        {message ?? (
          <>
            {copy.promise}{" "}
            <Link
              href={privacyHref}
              className="underline decoration-parchment/30 underline-offset-[3px] transition-colors hover:text-parchment hover:decoration-parchment/60"
            >
              {copy.privacy}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
