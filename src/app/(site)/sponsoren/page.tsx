import type { Metadata } from "next";
import Image from "next/image";
import { getSponsors, type Sponsor } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import SponsorForm from "@/components/SponsorForm";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Unsere Sponsoren und Partner: Unternehmen, die das E-Motion Rennteam Aalen unterstützen. Werde jetzt Sponsor.",
  alternates: { canonical: "/sponsoren" },
};

const TIERS: Sponsor["tier"][] = ["Platin", "Gold", "Silber", "Partner"];

export default function SponsorsPage() {
  const sponsors = getSponsors();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">Sponsoren</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">Unsere Partner</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Ohne die Unterstützung unserer Sponsoren wäre die Entwicklung unseres Fahrzeugs nicht
          möglich. Vielen Dank an alle Partner!
        </p>
      </Reveal>

      {TIERS.map((tier, ti) => {
        const list = sponsors.filter((s) => s.tier === tier);
        if (list.length === 0) return null;
        return (
          <div key={tier} className="mt-14">
            <Reveal delay={ti * 0.05}>
              <h2 className="border-b border-border pb-3 text-xl font-bold">
                {tier === "Partner" ? "Partner" : `${tier}-Partner`}
              </h2>
            </Reveal>
            <StaggerGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((sponsor) => (
                <StaggerItem key={sponsor.slug}>
                  <a
                    href={sponsor.website ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(74,99,247,0.35)]"
                  >
                    {sponsor.logo ? (
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={160}
                        height={80}
                        className="max-h-16 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold uppercase tracking-tight text-foreground">
                        {sponsor.name}
                      </span>
                    )}
                  </a>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        );
      })}

      <Reveal id="werden" className="mt-24 scroll-mt-24 rounded-2xl border border-accent/40 bg-surface p-8 sm:p-10" delay={0.1}>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Interesse an einem Sponsoring?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Werdet Teil unseres Erfolgs und unterstützt das E-Motion Rennteam Aalen. Füllt einfach
            das Formular aus – wir melden uns zeitnah bei euch.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <SponsorForm />
        </div>
      </Reveal>
    </div>
  );
}
