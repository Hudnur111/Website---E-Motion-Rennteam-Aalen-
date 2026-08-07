"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
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
          className="grid gap-4 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="member-name" className="text-sm font-medium">Name</label>
            <input
              id="member-name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="member-email" className="text-sm font-medium">E-Mail</label>
            <input
              id="member-email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="member-phone" className="text-sm font-medium">Telefon (optional)</label>
            <input
              id="member-phone"
              name="phone"
              type="tel"
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
              placeholder="Erzähl uns kurz, warum du beim E-Motion Rennteam mitmachen möchtest."
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Bewerbung senden
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
