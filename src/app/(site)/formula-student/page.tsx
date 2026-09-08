import type { Metadata } from "next";
import Reveal from "@/components/motion/Reveal";
import DisciplinesChart from "@/components/DisciplinesChart";
import FSTimeline from "@/components/FormulaStudent/FSTimeline";
import FSPillars from "@/components/FormulaStudent/FSPillars";
import FSStats from "@/components/FormulaStudent/FSStats";
import FSCompetitions from "@/components/FormulaStudent/FSCompetitions";

export const metadata: Metadata = {
  title: "Was ist Formula Student?",
  description:
    "Formula Student erklärt: der internationale Konstruktionswettbewerb, bei dem Studierendenteams eigene Rennwagen entwickeln, bauen und gegeneinander antreten lassen.",
  alternates: { canonical: "/formula-student" },
};

export default function FormulaStudentPage() {
  return (
    <div className="container-page space-y-20 py-20">
      {/* Hero */}
      <Reveal>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
              Formula Student
            </p>
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
              Studierendenteams bauen Rennwagen
            </h1>
          </div>
          <p className="max-w-xl text-base text-muted">
            Ein internationaler Konstruktionswettbewerb, in dem Teams Elektrorennwagen entwickeln,
            bauen und auf Rennstrecken testen – Technik trifft Teamgeist.
          </p>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.05}>
        <FSStats />
      </Reveal>

      {/* Pillars */}
      <Reveal delay={0.1}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Die vier Säulen</h2>
            <p className="mt-2 text-sm text-muted">
              Ein erfolgreiches Projekt erfordert Balance über alle Bereiche
            </p>
          </div>
          <FSPillars />
        </div>
      </Reveal>

      {/* Timeline */}
      <Reveal delay={0.15}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Geschichte & Meilensteine</h2>
            <p className="mt-2 text-sm text-muted">
              Von 1981 bis heute – die Evolution der Formula Student
            </p>
          </div>
          <FSTimeline />
        </div>
      </Reveal>

      {/* Disziplinen */}
      <Reveal delay={0.2}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Disziplinen & Punktevergabe</h2>
            <p className="mt-2 text-sm text-muted">
              1.000 Punkte über 8 Wettbewerbe – Technik, Design & Performance
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
            <DisciplinesChart />
          </div>
        </div>
      </Reveal>

      {/* Competitions */}
      <Reveal delay={0.25}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Wettbewerbe weltweit</h2>
            <p className="mt-2 text-sm text-muted">
              Die besten Teams treten auf renommierten Rennstrecken an
            </p>
          </div>
          <FSCompetitions />
        </div>
      </Reveal>
    </div>
  );
}
