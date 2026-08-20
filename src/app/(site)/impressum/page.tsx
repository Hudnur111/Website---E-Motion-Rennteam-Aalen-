import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung des E-Motion Rennteams Aalen gemäß § 5 TMG.",
  alternates: { canonical: "/impressum" },
};

export default async function ImpressumPage() {
  const page = getPage("impressum");
  const bodyHtml = page?.body ? await renderMarkdown(page.body) : "";

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Rechtliches</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
          {page?.heroTitle ?? "Impressum"}
        </h1>
      </Reveal>

      {bodyHtml && (
        <Reveal delay={0.05}>
          <div
            className="prose prose-invert mt-12 max-w-2xl prose-headings:text-foreground prose-p:text-muted prose-a:text-accent-text prose-h2:mt-8 prose-h2:text-base prose-h2:font-semibold"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </Reveal>
      )}
    </div>
  );
}
