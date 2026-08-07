"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/fahrzeuge", label: "Fahrzeuge" },
  { href: "/sponsoren", label: "Sponsoren" },
  { href: "/news", label: "News" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="text-lg text-accent">E-MOTION</span>
          <span className="hidden text-sm text-muted sm:inline">Rennteam Aalen</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü öffnen"
        >
          <span className="sr-only">Menü</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
