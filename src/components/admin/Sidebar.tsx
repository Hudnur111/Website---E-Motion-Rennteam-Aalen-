"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { collections } from "@/lib/cms/collections";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      <Link
        href="/admin"
        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname === "/admin" ? "bg-accent/15 text-accent-text" : "text-muted hover:bg-surface-2 hover:text-foreground"
        }`}
      >
        Übersicht
      </Link>
      <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted/70">Inhalte</p>
      {collections.map((c) => {
        const href = `/admin/${c.name}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={c.name}
            href={href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-accent/15 text-accent-text" : "text-muted hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}
