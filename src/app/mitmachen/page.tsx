import Link from "next/link";
import { getPositions } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata = { title: "Mitmachen | E-Motion Rennteam Aalen" };

export default function JoinPage() {
  const positions = getPositions();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Mitmachen</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Werde Teil des Teams</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Egal ob Fahrzeugtechnik, Elektrotechnik, Software oder Marketing – bei uns lernst du,
          Theorie in ein reales Projekt zu übersetzen. Keine Vorerfahrung nötig, nur Motivation.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-14">
        <h2 className="border-b border-border pb-3 text-xl font-bold">Offene Positionen</h2>
      </Reveal>

      <StaggerGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {positions.map((position) => (
          <StaggerItem key={position.slug}>
            <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/50">
              <div className="flex flex-wrap items-center gap-2">
                {position.department && (
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                    {position.department}
                  </span>
                )}
                {position.commitment && (
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-muted">
                    {position.commitment}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{position.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{position.body}</p>
              <Link
                href="/kontakt"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all hover:gap-2 hover:underline"
              >
                Jetzt bewerben <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.1} className="mt-20 rounded-2xl border border-accent/40 bg-surface p-10 text-center">
        <h2 className="text-2xl font-bold">Keine passende Position dabei?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Wir freuen uns auch über Initiativbewerbungen – schreib uns einfach, was dich
          interessiert.
        </p>
        <Link
          href="/kontakt"
          className="mt-6 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
        >
          Kontakt aufnehmen
        </Link>
      </Reveal>
    </div>
  );
}
