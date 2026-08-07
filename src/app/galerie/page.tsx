import { getGallery } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = { title: "Galerie | E-Motion Rennteam Aalen" };

export default function GalleryPage() {
  const images = getGallery();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Galerie</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">Impressionen</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Eindrücke von Wettbewerben, aus der Werkstatt und von Events – das E-Motion
          Rennteam Aalen in Bildern.
        </p>
      </Reveal>

      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : (
        <p className="mt-14 text-muted">Es sind noch keine Bilder hinterlegt.</p>
      )}
    </div>
  );
}
