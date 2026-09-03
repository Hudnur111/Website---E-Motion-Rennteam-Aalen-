import type { Metadata } from "next";
import { getGallery } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Bildergalerie des E-Motion Rennteams Aalen: Impressionen von Fahrzeugbau, Testfahrten, Events und Wettbewerben, nach Saison sortiert.",
  alternates: { canonical: "/galerie" },
};

const UNSORTED_SEASON = "Weitere Bilder";

function groupBySeason(images: ReturnType<typeof getGallery>) {
  const seasons = new Map<string, typeof images>();
  for (const image of images) {
    const season = image.season ?? UNSORTED_SEASON;
    seasons.set(season, [...(seasons.get(season) ?? []), image]);
  }
  return Array.from(seasons.entries()).sort(([a], [b]) => {
    if (a === UNSORTED_SEASON) return 1;
    if (b === UNSORTED_SEASON) return -1;
    return b.localeCompare(a);
  });
}

export default function GalleryPage() {
  const seasonGroups = groupBySeason(getGallery());
  const hasImages = seasonGroups.length > 0;

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Galerie</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">Impressionen</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Eindrücke von Wettbewerben, aus der Werkstatt und von Events – das E-Motion
          Rennteam Aalen in Bildern, nach Saison sortiert.
        </p>
      </Reveal>

      {hasImages ? (
        seasonGroups.map(([season, images]) => (
          <div key={season} className="mt-16 first:mt-0">
            <Reveal>
              <h2 className="border-b border-border pb-3 text-xl font-bold">
                {season === UNSORTED_SEASON ? season : `Saison ${season}`}
              </h2>
            </Reveal>
            <GalleryGrid images={images} />
          </div>
        ))
      ) : (
        <p className="mt-14 text-muted">Es sind noch keine Bilder hinterlegt.</p>
      )}

      <Reveal delay={0.1} className="mt-20 rounded-2xl border border-accent/40 bg-surface p-8 text-center sm:p-10">
        <h2 className="text-2xl font-bold">Mediakit</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Sponsoren und Presse können unser Mediakit mit Logos, Fahrzeugbildern und Team-Fotos in
          hoher Auflösung direkt bei uns anfragen.
        </p>
        <a
          href="mailto:info@emotion-rennteam.de?subject=Anfrage%20Mediakit"
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          Mediakit anfragen
        </a>
      </Reveal>
    </div>
  );
}
