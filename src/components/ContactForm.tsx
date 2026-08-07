"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SUBJECTS = [
  "Allgemeine Anfrage",
  "Sponsoring",
  "Presse",
  "Mitmachen / Bewerbung",
  "Sonstiges",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 600);
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
        >
          Danke für deine Nachricht! Wir melden uns so schnell wie möglich bei dir.
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              E-Mail <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="subject" className="text-sm font-medium">Betreff</label>
            <select
              id="subject"
              name="subject"
              defaultValue={SUBJECTS[0]}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Nachricht <span className="text-accent">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div className="flex items-start gap-2.5">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-surface accent-[var(--color-accent)]"
            />
            <label htmlFor="consent" className="text-xs text-muted">
              Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden.
              Weitere Infos in der{" "}
              <Link href="/datenschutz" className="text-accent hover:underline">
                Datenschutzerklärung
              </Link>
              . *
            </label>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "sending" ? "Wird gesendet…" : "Nachricht senden"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
