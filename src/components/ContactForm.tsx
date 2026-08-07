"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ContactForm() {
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
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">E-Mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium">Nachricht</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Nachricht senden
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
