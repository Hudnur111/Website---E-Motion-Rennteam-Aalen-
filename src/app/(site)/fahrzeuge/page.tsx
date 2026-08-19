import type { Metadata } from "next";
import Image from "next/image";
import { getVehicles } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import ScrollScale from "@/components/motion/ScrollScale";

export const metadata: Metadata = {
  title: "Fahrzeuge",
  description:
    "Die Rennwagen des E-Motion Rennteams Aalen: technische Daten, Baujahre und Entwicklung unserer Formula-Student-Electric-Boliden.",
  alternates: { canonical: "/fahrzeuge" },
};

export default function VehiclesPage() {
  const vehicles = getVehicles();

  return (
    <div className="py-20">
      <div className="container-page">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Fahrzeuge</p>
          <h1 className="mx-auto mt-2 max-w-2xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Unsere Boliden
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Jedes Jahr entwickeln wir ein neues, vollelektrisches Formula-Student-Fahrzeug – von
            der Simulation bis zur Rennstrecke.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 space-y-32">
        {vehicles.map((vehicle, i) => (
          <section key={vehicle.slug} className={i % 2 === 1 ? "bg-surface/40 py-24" : "py-2"}>
            <div className="container-page">
              <Reveal className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
                    {vehicle.year}
                  </p>
                  {vehicle.current && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Aktuell
                    </span>
                  )}
                </div>
                <h2 className="mx-auto mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">
                  {vehicle.name}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{vehicle.tagline}</p>
              </Reveal>
            </div>

            {vehicle.coverImage && (
              <div className="relative left-1/2 right-1/2 mt-14 -mx-[50vw] w-screen px-4 sm:px-8">
                <ScrollScale className="mx-auto aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-border/60 bg-surface sm:aspect-[21/9] sm:rounded-[2.5rem]">
                  <Image
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    width={1600}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </ScrollScale>
              </div>
            )}

            <div className="container-page">
              {vehicle.body && (
                <Reveal className="mx-auto mt-14 max-w-2xl text-center text-muted">
                  {vehicle.body}
                </Reveal>
              )}

              {vehicle.specs && vehicle.specs.length > 0 && (
                <StaggerGroup className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
                  {vehicle.specs.map((spec) => (
                    <StaggerItem key={spec.label}>
                      <div className="rounded-2xl border border-border bg-background p-5 text-center transition-colors hover:border-accent/60">
                        <div className="text-xs uppercase tracking-wide text-muted">
                          {spec.label}
                        </div>
                        <div className="mt-1.5 text-lg font-semibold">{spec.value}</div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
