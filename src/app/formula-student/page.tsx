import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import DisciplinesChart from "@/components/DisciplinesChart";

export const metadata: Metadata = {
  title: "Was ist Formula Student?",
  description:
    "Formula Student erklärt: der internationale Konstruktionswettbewerb, bei dem Studierendenteams eigene Rennwagen entwickeln, bauen und gegeneinander antreten lassen.",
  alternates: { canonical: "/formula-student" },
};

export default function FormulaStudentPage() {
  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Formula Student
        </p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">Was ist die Formula Student?</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Wenn Studierende von Hochschulen und Universitäten antreten, um in der Formula Student
          zu konkurrieren, dann haben sie einen langen Weg hinter sich. Einen Formula-Student-
          Rennwagen zu bauen erfordert Zeit, Teamgeist, Innovation, Technologie und Bereitschaft.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Das Ziel der Formula Student Electric ist es, sich bereits zu einem frühen Zeitpunkt im
          Studium mit zukunftsgewandten Technologien auseinanderzusetzen und nach dem Regelwerk
          der Society of Automotive Engineers zu arbeiten.
        </p>
        <p>
          Neben der technischen Konstruktion und Fertigung des Rennwagens sind insbesondere auch
          Projektmanagement, Controlling, Marketing und Öffentlichkeitsarbeit wichtige
          Bestandteile, die es mit entsprechendem Interesse und Einsatz zu bearbeiten gilt.
          Wichtig dabei ist, die Kommunikation zwischen den verschiedenen Arbeitsgruppen und den
          uns unterstützenden Projektpartnern herzustellen.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-16">
        <h2 className="border-b border-border pb-3 text-xl font-bold">
          Die Geschichte der Formula Student
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Die Formula Student ist ein internationaler Konstruktionswettbewerb zwischen
            Studierenden verschiedener Hochschulen, der 1981 in den USA durch die Society of
            Automotive Engineers (SAE) ins Leben gerufen wurde.
          </p>
          <p>
            Seit 2006 findet dieser Wettbewerb unter der Schirmherrschaft des Vereins Deutscher
            Ingenieure (VDI) in Deutschland am Hockenheimring statt. Die Formula Student Germany
            ist der bekannteste Wettbewerb – hier treten die erfolgreichsten Teams weltweit
            gegeneinander an. Im europäischen Raum finden weitere Wettbewerbe auf bekannten
            Rennstrecken statt, zum Beispiel in Silverstone, am Red Bull Ring oder auf dem Circuit
            de Barcelona-Catalunya.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-16">
        <h2 className="border-b border-border pb-3 text-xl font-bold">
          Die Disziplinen im Überblick
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Insgesamt können 1.000 Punkte über acht statische und dynamische Disziplinen erreicht
          werden. Die Endurance-Disziplin, die Zuverlässigkeit und Energieeffizienz des Fahrzeugs
          über eine lange Renndistanz prüft, ist dabei mit 300 Punkten die gewichtigste.
        </p>
        <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
          <DisciplinesChart />
        </div>
      </Reveal>
    </div>
  );
}
