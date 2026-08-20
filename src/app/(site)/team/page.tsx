import type { Metadata } from "next";
import Image from "next/image";
import { getTeam, getPage } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Das Team hinter dem E-Motion Rennteam Aalen: Studierende aus allen Fachbereichen, die gemeinsam einen Formula-Student-Electric-Rennwagen entwickeln.",
  alternates: { canonical: "/team" },
};

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  Teamleitung:
    "Koordiniert das Gesamtprojekt, die Wettbewerbsplanung und die Zusammenarbeit aller Fachbereiche.",
  Fahrzeugtechnik:
    "Verantwortlich für Monocoque, Karosserie und die Integration aller Komponenten zum Gesamtfahrzeug.",
  "Elektrotechnik / High-Voltage":
    "Entwickelt Batteriesystem, Leistungselektronik und sorgt für die Hochvolt-Sicherheit des Fahrzeugs.",
  Aerodynamik:
    "Optimiert Abtrieb und Luftwiderstand mit CFD-Simulationen und dem Design der Flügelelemente.",
  Fahrwerk:
    "Zuständig für Radaufhängung, Dämpfung und die Fahrdynamik-Abstimmung auf der Strecke.",
  "Software / Autonomous":
    "Baut die Fahrzeugsoftware, Telemetrie und das autonome Fahrmodul für die Driverless-Disziplin.",
  "Marketing & Finanzen":
    "Kümmert sich um Sponsoring, Öffentlichkeitsarbeit und die finanzielle Planung des Teams.",
};

export default function TeamPage() {
  const team = getTeam();
  const page = getPage("team");
  const departments = Array.from(new Set(team.map((m) => m.department)));

  const descriptions: Record<string, string> = { ...DEFAULT_DESCRIPTIONS };
  if (page?.departmentDescriptions?.length) {
    for (const d of page.departmentDescriptions) {
      descriptions[d.label] = d.value;
    }
  }

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Team</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
          {page?.heroTitle ?? "Die Köpfe hinter dem ERT-14/26"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          {page?.heroSubtitle ??
            "Über 60 Studierende verschiedenster Fachrichtungen entwickeln, fertigen und testen gemeinsam unseren elektrischen Rennwagen – organisiert in sieben Fachteams."}
        </p>
      </Reveal>

      <div className="mt-14 space-y-14">
        {departments.map((department, di) => {
          const members = team.filter((member) => member.department === department);
          return (
            <Reveal key={department} delay={di * 0.05}>
              <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-bold">{department}</h2>
                    {descriptions[department] && (
                      <p className="mt-1.5 max-w-xl text-sm text-muted">
                        {descriptions[department]}
                      </p>
                    )}
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-text">
                    {members.length} {members.length === 1 ? "Mitglied" : "Mitglieder"}
                  </span>
                </div>

                <StaggerGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <StaggerItem key={member.slug}>
                      <div className="group h-full rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_30px_-10px_rgba(74,99,247,0.35)]">
                        <div className="aspect-square overflow-hidden rounded-lg bg-surface-2">
                          {member.photo ? (
                            <Image
                              src={member.photo}
                              alt={member.name}
                              width={300}
                              height={300}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-9 w-9 opacity-50"
                              >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                              <span className="text-xs font-medium uppercase tracking-wide">
                                Bild folgt
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="mt-4 font-semibold">{member.name}</h3>
                        <p className="text-sm text-accent-text">{member.role}</p>
                        {member.body && (
                          <p className="mt-2 text-sm text-muted">{member.body}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
