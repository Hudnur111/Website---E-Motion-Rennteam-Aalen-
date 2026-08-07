import Image from "next/image";
import { getVehicles } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export const metadata = { title: "Fahrzeuge | E-Motion Rennteam Aalen" };

export default function VehiclesPage() {
  const vehicles = getVehicles();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Fahrzeuge</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Unsere Boliden</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Jedes Jahr entwickeln wir ein neues, vollelektrisches Formula-Student-Fahrzeug –
          von der Simulation bis zur Rennstrecke.
        </p>
      </Reveal>

      <div className="mt-14 space-y-16">
        {vehicles.map((vehicle, i) => (
          <Reveal key={vehicle.slug} direction={i % 2 === 0 ? "left" : "right"}>
            <div className="group grid gap-8 rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40 md:grid-cols-2 md:p-10">
              <div className="aspect-video overflow-hidden rounded-xl bg-surface-2">
                {vehicle.coverImage ? (
                  <Image
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    Fahrzeugbild folgt
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{vehicle.name}</h2>
                  {vehicle.current && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Aktuell
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{vehicle.year}</p>
                <p className="mt-3 text-muted">{vehicle.tagline}</p>
                {vehicle.body && <p className="mt-4 text-sm text-muted">{vehicle.body}</p>}

                {vehicle.specs && vehicle.specs.length > 0 && (
                  <dl className="mt-6 grid grid-cols-2 gap-4">
                    {vehicle.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent/60"
                      >
                        <dt className="text-xs uppercase tracking-wide text-muted">{spec.label}</dt>
                        <dd className="mt-1 text-lg font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
