"use client";

import { useState } from "react";
import GalleryGrid from "@/components/GalleryGrid";

function ImageLoadNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3.5 sm:items-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mt-0.5 h-5 w-5 shrink-0 text-accent-text sm:mt-0"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
      <p className="flex-1 text-sm text-foreground">
        Werden Bilder nicht richtig angezeigt? Lade die Seite bitte einmal neu.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 rounded-full border border-accent/40 px-4 py-1.5 text-xs font-semibold text-accent-text transition-colors hover:border-accent hover:bg-accent/10"
      >
        Seite neu laden
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Hinweis schließen"
        className="shrink-0 text-muted transition-colors hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}

type GalleryImage = {
  slug: string;
  title: string;
  image: string;
  album: string;
};

export default function GalleryAlbumPicker({
  albums,
}: {
  albums: { name: string; images: GalleryImage[] }[];
}) {
  const [selected, setSelected] = useState(albums[0]?.name ?? "");
  const active = albums.find((album) => album.name === selected) ?? albums[0];

  return (
    <div>
      <ImageLoadNotice />
      <label htmlFor="album-select" className="text-sm font-medium">
        Album auswählen
      </label>
      <select
        id="album-select"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mt-2 w-full max-w-sm rounded-md border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent sm:w-auto"
      >
        {albums.map((album) => (
          <option key={album.name} value={album.name}>
            {album.name} ({album.images.length})
          </option>
        ))}
      </select>

      {active && <GalleryGrid images={active.images} />}
    </div>
  );
}
