import type { Vehicle } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export default function VehicleTimeline({ vehicles }: { vehicles: Vehicle[] }) {
  const sorted = [...vehicles].sort((a, b) => a.year - b.year);
  const currentIndex = sorted.findIndex((v) => v.current);
  const progressIndex = currentIndex === -1 ? sorted.length - 1 : currentIndex;

  return (
    <div className="container-page">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-x-auto pb-4 [-webkit-mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)] [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]">
          <nav aria-label="Fahrzeug-Timeline" className="snap-x snap-mandatory">
            <ol className="flex w-max items-center px-6 py-2">
              {sorted.map((vehicle, i) => {
                const isPast = i < progressIndex;
                return (
                  <li key={vehicle.slug} className="flex items-center">
                    {i > 0 && (
                      <span
                        className={`mx-1 h-0.5 w-8 shrink-0 rounded-full sm:mx-2 sm:w-14 ${
                          isPast || i - 1 < progressIndex
                            ? "bg-gradient-to-r from-accent to-accent-2"
                            : "bg-border"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    <a
                      href={`#${vehicle.slug}`}
                      className={`group relative flex w-40 shrink-0 snap-center flex-col items-center rounded-2xl border px-4 py-5 text-center transition-all duration-300 sm:w-48 ${
                        vehicle.current
                          ? "border-accent/60 bg-surface shadow-lg shadow-accent/15"
                          : "border-border bg-surface/60 hover:-translate-y-1 hover:border-accent/40 hover:bg-surface hover:shadow-lg hover:shadow-accent/10"
                      }`}
                    >
                      <span className="font-mono text-[11px] font-medium tracking-widest text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="relative mt-3 flex h-3.5 w-3.5 items-center justify-center">
                        {vehicle.current && (
                          <span
                            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`relative h-3 w-3 rounded-full border-2 ${
                            vehicle.current
                              ? "border-accent bg-accent"
                              : isPast
                                ? "border-accent-2 bg-accent-2"
                                : "border-border bg-background group-hover:border-accent-text/70"
                          }`}
                        />
                      </span>

                      <span className="mt-3 font-mono text-xs font-semibold tracking-wide text-accent-text">
                        {vehicle.year}
                      </span>
                      <span className="mt-1 text-base font-bold tracking-tight transition-colors group-hover:text-accent-text">
                        {vehicle.name}
                      </span>

                      {vehicle.current ? (
                        <span className="mt-2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                          Aktuell
                        </span>
                      ) : (
                        <span className="mt-2 h-[19px]" aria-hidden="true" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </Reveal>
    </div>
  );
}
