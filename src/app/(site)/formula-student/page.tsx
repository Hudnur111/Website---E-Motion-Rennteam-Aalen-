import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import Reveal from "@/components/motion/Reveal";
import DisciplinesChart from "@/components/DisciplinesChart";

export const metadata: Metadata = {
  title: "Was ist Formula Student?",
  description:
    "Formula Student erklärt: der internationale Konstruktionswettbewerb, bei dem Studierendenteams eigene Rennwagen entwickeln, bauen und gegeneinander antreten lassen.",
  alternates: { canonical: "/formula-student" },
};

export default async function FormulaStudentPage() {
  const page = getPage("formula-student");
  const bodyHtml = page?.body ? await renderMarkdown(page.body) : "";

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
          Formula Student
        </p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
          {page?.heroTitle ?? "Was ist die Formula Student?"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          {page?.heroSubtitle ??
            "Wenn Studierende von Hochschulen und Universitäten antreten, um in der Formula Student zu konkurrieren, dann haben sie einen langen Weg hinter sich."}
        </p>
      </Reveal>

      {bodyHtml && (
        <Reveal delay={0.05}>
          <div
            className="prose prose-invert mt-12 max-w-2xl prose-headings:text-foreground prose-p:text-muted prose-a:text-accent-text prose-h2:mt-16 prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:text-xl prose-h2:font-bold"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </Reveal>
      )}

      <Reveal delay={0.1} className="mt-8">
        <div className="max-w-2xl rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
          <DisciplinesChart />
        </div>
      </Reveal>
    </div>
  );
}
