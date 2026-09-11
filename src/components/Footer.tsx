import Image from "next/image";
import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";

interface FooterProps {
  hiddenIds?: string[];
}

const NAV_ITEMS = [
  { id: "formula-student", href: "/formula-student", label: "Formula Student", group: "nav" },
  { id: "team", href: "/team", label: "Team", group: "nav" },
  { id: "fahrzeuge", href: "/fahrzeuge", label: "Fahrzeuge", group: "nav" },
  { id: "erfolge", href: "/erfolge", label: "Timeline", group: "nav" },
  { id: "sponsoren", href: "/sponsoren", label: "Sponsoren", group: "nav" },
  { id: "mitmachen", href: "/mitmachen", label: "Mitmachen", group: "nav" },
  { id: "galerie", href: "/galerie", label: "Galerie", group: "aktuelles" },
  { id: "kontakt", href: "/kontakt", label: "Kontakt", group: "aktuelles" },
] as const;

export default function Footer({ hiddenIds = [] }: FooterProps) {
  const hidden = new Set(hiddenIds);
  const navLinks = NAV_ITEMS.filter((i) => i.group === "nav" && !hidden.has(i.id));
  const aktuellesLinks = NAV_ITEMS.filter((i) => i.group === "aktuelles" && !hidden.has(i.id));

  return (
    <footer className="border-t border-border bg-surface">
      <div className="checkered-divider" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Image
            src="/uploads/logo.png"
            alt="E-Motion Rennteam Aalen"
            width={1000}
            height={563}
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Formula Student Electric Racing Team der Hochschule Aalen.
            Elektrisch. Ambitioniert. Aalen.
          </p>
          <SocialIcons className="mt-4 flex gap-3" />
        </div>

        {navLinks.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-foreground">Navigation</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {navLinks.map((item) => (
              <li key={item.id}><Link href={item.href} className="transition-colors hover:text-accent-text">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        )}

        <div>
          {aktuellesLinks.length > 0 && (
          <>
          <div className="text-sm font-semibold text-foreground">Aktuelles</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {aktuellesLinks.map((item) => (
              <li key={item.id}><Link href={item.href} className="transition-colors hover:text-accent-text">{item.label}</Link></li>
            ))}
          </ul>
          </>
          )}
          <div className="mt-4 space-y-1 text-sm text-muted">
            <p>Hochschule Aalen</p>
            <p>Beethovenstraße 1, 73430 Aalen</p>
            <a href="mailto:info@emotion-rennteam.de" className="block hover:text-foreground">
              info@emotion-rennteam.de
            </a>
            <a href="tel:+4973615762191" className="block hover:text-foreground">
              +49 7361 5762191
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} E-Motion Rennteam Aalen</span>
          <div className="flex items-center gap-4">
            <Link href="/impressum" className="transition-colors hover:text-foreground">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-foreground">
              Datenschutz
            </Link>
          </div>
          <span>Formula Student Germany | Hochschule Aalen</span>
        </div>
      </div>
    </footer>
  );
}
