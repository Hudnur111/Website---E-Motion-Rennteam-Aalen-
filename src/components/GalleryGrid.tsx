"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type GalleryImage = {
  slug: string;
  title: string;
  image: string;
  category?: string;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? images[activeIndex] : null;
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  function open(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
    lastTriggerRef.current?.focus();
  }

  function next() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }

  function prev() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }

  // Keyboard support for the lightbox: Escape closes it, arrow keys navigate.
  useEffect(() => {
    if (active === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, activeIndex]);

  // Move focus into the dialog when it opens so keyboard/screen-reader users
  // land somewhere sensible instead of staying on the (now hidden) trigger.
  useEffect(() => {
    if (active) closeButtonRef.current?.focus();
  }, [active]);

  return (
    <>
      <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <StaggerItem key={img.slug}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={img.image}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm font-semibold text-foreground">{img.title}</span>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="90vw"
                  className="object-contain bg-background"
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted">{active.title}</p>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Schließen"
                className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                ✕
              </button>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Vorheriges Bild"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Nächstes Bild"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    →
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
