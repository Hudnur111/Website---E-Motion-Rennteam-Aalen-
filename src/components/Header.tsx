"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/team", label: "Team" },
  { href: "/fahrzeuge", label: "Fahrzeuge" },
  { href: "/erfolge", label: "Erfolge" },
  { href: "/sponsoren", label: "Sponsoren" },
];

const MORE_LINKS = [
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/galerie", label: "Galerie" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const moreActive = MORE_LINKS.some(
    (link) => pathname === link.href || pathname?.startsWith(`${link.href}/`)
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 font-bold tracking-tight">
          <span className="relative text-lg text-accent">
            E-MOTION
            <span className="absolute -inset-x-2 -inset-y-1 -z-10 rounded-full bg-accent/0 blur-lg transition-colors duration-300 group-hover:bg-accent/20" />
          </span>
          <span className="hidden text-sm text-muted sm:inline">Rennteam Aalen</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={`relative flex items-center gap-1 py-1 text-sm font-medium transition-colors ${
                moreActive ? "text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Aktuelles
              <motion.svg
                viewBox="0 0 12 8"
                className="h-2.5 w-2.5 fill-none stroke-current stroke-2"
                animate={{ rotate: moreOpen ? 180 : 0 }}
              >
                <path d="M1 1.5 6 6.5 11 1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              {moreActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-40 overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
                >
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/kontakt"
            className={`relative py-1 text-sm font-medium transition-colors ${
              pathname === "/kontakt" ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            Kontakt
            {pathname === "/kontakt" && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/mitmachen"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Mitmachen
          </Link>
        </nav>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü öffnen"
        >
          <span className="sr-only">Menü</span>
          <div className="space-y-1">
            <motion.span
              className="block h-0.5 w-5 bg-foreground"
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block h-0.5 w-5 bg-foreground"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block h-0.5 w-5 bg-foreground"
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {[...NAV_LINKS, ...MORE_LINKS, { href: "/kontakt", label: "Kontakt" }].map(
                (link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="block rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.32 }}
                className="mt-2"
              >
                <Link
                  href="/mitmachen"
                  className="block rounded-md bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground"
                >
                  Mitmachen
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
