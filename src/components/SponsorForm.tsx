"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TIERS = ["Platin", "Gold", "Silber", "Partner", "Noch unentschlossen"];

export default function SponsorForm() {
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
          Vielen Dank für dein Interesse an einer Partnerschaft! Wir melden uns zeitnah bei euch.
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
            <label htmlFor="company" className="text-sm font-medium">Firmenname</label>
            <input
              id="company"
              name="company"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="contact" className="text-sm font-medium">Ansprechpartner:in</label>
            <input
              id="contact"
              name="contact"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="sponsor-email" className="text-sm font-medium">E-Mail</label>
            <input
              id="sponsor-email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">Telefon (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tier" className="text-sm font-medium">Interessiert an</label>
            <select
              id="tier"
              name="tier"
              defaultValue={TIERS[TIERS.length - 1]}
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            >
              {TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sponsor-message" className="text-sm font-medium">Nachricht</label>
            <textarea
              id="sponsor-message"
              name="message"
              rows={4}
              placeholder="Erzählt uns kurz von eurem Unternehmen und wie ihr euch eine Partnerschaft vorstellt."
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Anfrage senden
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
