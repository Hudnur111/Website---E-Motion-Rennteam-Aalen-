"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useFormSubmit } from "@/lib/useFormSubmit";
import HoneypotField from "@/components/HoneypotField";

const DEPARTMENTS = [
  "Fahrzeugtechnik",
  "Elektrotechnik / High-Voltage",
  "Aerodynamik",
  "Fahrwerk",
  "Software / Autonomous",
  "Marketing & Finanzen",
  "Noch unentschlossen",
];

export default function MemberApplicationForm() {
  const { status, errors, errorMessage, submit } = useFormSubmit("/api/mitmachen");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.get("consent") === "on" ? "true" : "";
    await submit(payload);
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-accent/40 bg-surface p-6 text-sm text-muted"
          role="status"
        >
          Danke für deine Bewerbung! Wir melden uns so schnell wie möglich bei dir.
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
        >
          {errorMessage && (
            <p
              role="alert"
              className="sm:col-span-2 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-500"
            >
              {errorMessage}
            </p>
          )}
          <HoneypotField />
          <div>
            <label htmlFor="member-name" className="text-sm font-medium">Name</label>
            <input
              id="member-name"
              name="name"
              required
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "member-name-error" : undefined}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
            {errors.name && (
              <p id="member-name-error" className="mt-1 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="member-email" className="text-sm font-medium">E-Mail</label>
            <input
              id="member-email"
              name="email"
              type="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "member-email-error" : undefined}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
            {errors.email && (
              <p id="member-email-error" className="mt-1 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="member-phone" className="text-sm font-medium">Telefon (optional)</label>
            <input
              id="member-phone"
              name="phone"
              type="tel"
              maxLength={32}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="member-department" className="text-sm font-medium">Fachbereich</label>
            <select
              id="member-department"
              name="department"
              defaultValue={DEPARTMENTS[0]}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            >
              {DEPARTMENTS.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="member-message" className="text-sm font-medium">Motivation</label>
            <textarea
              id="member-message"
              name="message"
              rows={4}
              maxLength={4000}
              placeholder="Erzähl uns kurz, warum du beim E-Motion Rennteam mitmachen möchtest."
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div className="flex items-start gap-2.5 sm:col-span-2">
            <input
              id="member-consent"
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-surface accent-[var(--color-accent)]"
            />
            <label htmlFor="member-consent" className="text-xs text-muted">
              Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Bewerbung gespeichert
              werden. Weitere Infos in der{" "}
              <Link href="/datenschutz" className="text-accent hover:underline">
                Datenschutzerklärung
              </Link>
              . *
            </label>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="sm:col-span-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "sending" ? "Wird gesendet…" : "Bewerbung senden"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
