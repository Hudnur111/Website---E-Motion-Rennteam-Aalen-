import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold text-accent">E-MOTION</div>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Formula Student Electric Racing Team der Hochschule Aalen.
            Elektrisch. Ambitioniert. Aalen.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Navigation</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/team" className="transition-colors hover:text-accent">Team</Link></li>
            <li><Link href="/fahrzeuge" className="transition-colors hover:text-accent">Fahrzeuge</Link></li>
            <li><Link href="/sponsoren" className="transition-colors hover:text-accent">Sponsoren</Link></li>
            <li><Link href="/news" className="transition-colors hover:text-accent">News</Link></li>
            <li><Link href="/kontakt" className="transition-colors hover:text-accent">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Kontakt</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Hochschule Aalen</li>
            <li>Beethovenstraße 1, 73430 Aalen</li>
            <li>
              <a href="mailto:info@e-motion-aalen.de" className="hover:text-foreground">
                info@e-motion-aalen.de
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} E-Motion Rennteam Aalen</span>
          <span>Formula Student Germany | Hochschule Aalen</span>
        </div>
      </div>
    </footer>
  );
}
