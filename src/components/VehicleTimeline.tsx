import type { Vehicle } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export default function VehicleTimeline({ vehicles }: { vehicles: Vehicle[] }) {
  const sorted = [...vehicles].sort((a, b) => a.year - b.year);

  return (
    <div className="container-page">
      <Reveal className="mx-auto max-w-5xl">
        <nav aria-label="Fahrzeug-Timeline" className="overflow-x-auto pb-2">
          <ol className="flex w-max items-center gap-1 sm:gap-2">
            {sorted.map((vehicle, i) => (
              <li key={vehicle.slug} className="flex items-center">
                {i > 0 && (
                  <span
                    className="mx-1 h-px w-6 shrink-0 bg-border sm:mx-2 sm:w-12"
                    aria-hidden="true"
                  />
                )}
                <a
                  href={`#${vehicle.slug}`}
                  className="group flex w-36 shrink-0 flex-col items-center rounded-xl border border-border bg-surface px-3 py-4 text-center transition-colors hover:border-accent/60 sm:w-44 sm:px-4"
                >
                  <span
                    className={`h-3 w-3 rounded-full border-2 ${
                      vehicle.current
                        ? "border-accent bg-accent"
                        : "border-border bg-background"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="mt-2 font-mono text-xs font-semibold text-accent-text">
                    {vehicle.year}
                  </span>
                  <span className="mt-1 text-sm font-bold tracking-tight transition-colors group-hover:text-accent-text">
                    {vehicle.name}
                  </span>
                  {vehicle.current && (
                    <span className="mt-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      Aktuell
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>
    </div>
  );
}
