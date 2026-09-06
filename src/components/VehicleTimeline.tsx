import type { Vehicle } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export default function VehicleTimeline({ vehicles }: { vehicles: Vehicle[] }) {
  const sorted = [...vehicles].sort((a, b) => a.year - b.year);

  return (
    <div className="container-page">
      <Reveal className="mx-auto max-w-3xl">
        <ol className="relative border-l border-border pl-8 sm:pl-10">
          {sorted.map((vehicle) => (
            <li key={vehicle.slug} className="mb-10 last:mb-0">
              <span
                className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 ${
                  vehicle.current
                    ? "border-accent bg-accent"
                    : "border-border bg-background"
                }`}
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold text-accent-text">
                  {vehicle.year}
                </span>
                <h3 className="text-lg font-bold tracking-tight">{vehicle.name}</h3>
                {vehicle.current && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                    Aktuell im Einsatz
                  </span>
                )}
              </div>
              {vehicle.tagline && (
                <p className="mt-1.5 text-sm text-muted">{vehicle.tagline}</p>
              )}
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
