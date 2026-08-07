import Image from "next/image";
import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="checkered-divider" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
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

        <div>
          <div className="text-sm font-semibold text-foreground">Navigation</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/team" className="transition-colors hover:text-accent">Team</Link></li>
            <li><Link href="/fahrzeuge" className="transition-colors hover:text-accent">Fahrzeuge</Link></li>
            <li><Link href="/erfolge" className="transition-colors hover:text-accent">Erfolge</Link></li>
            <li><Link href="/sponsoren" className="transition-colors hover:text-accent">Sponsoren</Link></li>
            <li><Link href="/mitmachen" className="transition-colors hover:text-accent">Mitmachen</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Aktuelles</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/news" className="transition-colors hover:text-accent">News</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-accent">Blog</Link></li>
            <li><Link href="/galerie" className="transition-colors hover:text-accent">Galerie</Link></li>
            <li><Link href="/kontakt" className="transition-colors hover:text-accent">Kontakt</Link></li>
          </ul>
          <div className="mt-4 space-y-1 text-sm text-muted">
            <p>Hochschule Aalen</p>
            <p>Beethovenstraße 1, 73430 Aalen</p>
            <a href="mailto:vorstand@emotion-rennteam.de" className="block hover:text-foreground">
              vorstand@emotion-rennteam.de
            </a>
            <a href="tel:+4973615762191" className="block hover:text-foreground">
              07361 5762191
            </a>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Newsletter</div>
          <p className="mt-3 text-sm text-muted">
            Kein Update mehr verpassen – Rennergebnisse, Baufortschritt und Events direkt
            ins Postfach.
          </p>
          <div className="mt-4">
            <NewsletterForm />
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
