"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_NAME = "cookie-consent";
const COOKIE_MAX_AGE_DAYS = 180;

function readConsentCookie(): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
}

function writeConsentCookie(value: "accepted" | "declined") {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsentCookie()) setVisible(true);
  }, []);

  function respond(value: "accepted" | "declined") {
    writeConsentCookie(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-surface/95 backdrop-blur-sm"
    >
      <div className="container-page flex flex-col items-center gap-4 py-5 text-sm text-muted sm:flex-row sm:justify-between">
        <p className="max-w-2xl">
          Wir setzen ausschließlich ein technisch notwendiges Cookie, um deine Auswahl zu diesem
          Hinweis zu speichern. Tracking- oder Marketing-Cookies verwenden wir nicht. Mehr dazu in
          unserer{" "}
          <Link href="/datenschutz" className="text-accent-text underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-accent/60"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
