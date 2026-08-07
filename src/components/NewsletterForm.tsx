"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 600);
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.p
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-2"
        >
          Danke für deine Anmeldung!
        </motion.p>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              E-Mail-Adresse
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="deine@email.de"
              className="w-full min-w-0 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "sending" ? "…" : "Anmelden"}
            </button>
          </form>
          <p className="mt-2 text-xs text-muted">
            Abmeldung jederzeit möglich. Infos in der{" "}
            <Link href="/datenschutz" className="hover:text-foreground hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
