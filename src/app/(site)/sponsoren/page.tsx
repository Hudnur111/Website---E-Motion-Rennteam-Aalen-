import type { Metadata } from "next";
import { getSponsors, type Sponsor } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import SponsorForm from "@/components/SponsorForm";
import SponsorCard from "@/components/SponsorCard";

export const metadata: Metadata = {
  title: "Sponsoren",
  description:
    "Unsere Sponsoren und Partner: Unternehmen, die das E-Motion Rennteam Aalen unterstützen. Werde jetzt Sponsor.",
  alternates: { canonical: "/sponsoren" },
};

const TIERS: Sponsor["tier"][] = ["Platin", "Gold", "Silber", "Partner"];

const SPONSOR_PACKAGES = [
  { name: "Exklusivsponsor", price: "30.000 €", tax: "5.700 €" },
  { name: "Hauptsponsor", price: "15.000 €", tax: "1.487,50 €" },
  { name: "Goldsponsor", price: "10.000 €", tax: "640 €" },
  { name: "Silbersponsor", price: "5.500 €", tax: "226 €" },
  { name: "Bronzesponsor", price: "2.200 €", tax: "133 €" },
];

const YES = "✓";
const NO = "–";

const SPONSOR_PACKAGE_ROWS: { label: string; values: string[] }[] = [
  {
    label: "Logo-Aufkleber am Rennwagen (2 Stück)",
    values: ["100 cm²", "100 cm²", "70 cm²", "50 cm²", "20 cm²"],
  },
  {
    label: "Logo auf der Homepage",
    values: ["Verlinkung", "Verlinkung", "Platzierung", "Platzierung", "Platzierung"],
  },
  { label: "Logo auf Flyer & Rollups", values: [YES, YES, YES, YES, YES] },
  {
    label: "Fahrzeugverleih für Veranstaltungen (kurzfristig)",
    values: [YES, YES, YES, NO, NO],
  },
  { label: "Fahrzeugverleih für Langzeit-Ausstellungen", values: [YES, YES, NO, NO, NO] },
  { label: "Logo auf der Teamkleidung (vorne)", values: [YES, YES, NO, NO, NO] },
  { label: "Logo auf der Teamkleidung (hinten)", values: [YES, YES, YES, NO, NO] },
  { label: "Erwähnung in Social-Media-Posts", values: [YES, YES, NO, NO, NO] },
  { label: "Logo-Integration ins Car-Design", values: [YES, NO, NO, NO, NO] },
  {
    label: "Platzierung auf der Dankeswand",
    values: ["Groß & zentral", "Groß & zentral", "Medium & versetzt", "Klein & seitlich", NO],
  },
];

const SPONSOR_ADDONS = [
  { name: "Logo auf der Teamkleidung (hinten)", price: "1.000 €", tax: "190 €" },
  { name: "Logo auf dem Pavillon", price: "500 €", tax: "95 €" },
  { name: "Logo auf dem Helm (2 Aufkleber)", price: "500 €", tax: "95 €" },
  { name: "Logo auf unseren Werbeartikeln", price: "500 €", tax: "0 €" },
  { name: "Rollout-Sponsoring mit Bühnenerwähnung", price: "3.000 €", tax: "570 €" },
  { name: "Rollout-Sponsoring Banner", price: "1.000 €", tax: "190 €" },
  { name: "Dankeswand-Upgrade", price: "1.000 €", tax: "190 €" },
  { name: "Logo auf unserem Nutzfahrzeug", price: "1.000 €", tax: "190 €" },
  { name: "Erwähnung in einem Social-Media-Post", price: "2.200 €", tax: "418 €" },
];

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
              {list.map((sponsor, si) => (
                <StaggerItem key={sponsor.slug}>
                  <SponsorCard sponsor={sponsor} index={si} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        );
      })}

      <Reveal className="mt-24" delay={0.1}>
        <h2 className="border-b border-border pb-3 text-xl font-bold">Sponsoring-Pakete 2026</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Fünf Pakete, klar gestaffelt nach Sichtbarkeit und Leistung – von der Logogröße am
          Rennwagen bis zur Platzierung auf unserer Dankeswand.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2">
                <th className="p-4 text-left font-semibold text-muted">Leistung</th>
                {SPONSOR_PACKAGES.map((pkg) => (
                  <th key={pkg.name} className="p-4 text-left font-semibold">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border bg-surface">
                <td className="p-4 font-medium text-muted">Sponsoringleistung (netto)</td>
                {SPONSOR_PACKAGES.map((pkg) => (
                  <td key={pkg.name} className="p-4 font-semibold">
                    {pkg.price}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <td className="p-4 text-muted">zzgl. Steuern</td>
                {SPONSOR_PACKAGES.map((pkg) => (
                  <td key={pkg.name} className="p-4 text-muted">
                    {pkg.tax}
                  </td>
                ))}
              </tr>
              {SPONSOR_PACKAGE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-4 text-muted">{row.label}</td>
                  {row.values.map((value, vi) => (
                    <td
                      key={vi}
                      className={value === NO ? "p-4 text-muted/50" : "p-4"}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-14" delay={0.1}>
        <h2 className="border-b border-border pb-3 text-xl font-bold">Zusatzleistungen</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Einzeln buchbare Leistungen, unabhängig vom gewählten Sponsoring-Paket.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-2">
                <th className="p-4 text-left font-semibold text-muted">Leistung</th>
                <th className="p-4 text-left font-semibold text-muted">Preis</th>
                <th className="p-4 text-left font-semibold text-muted">Steuer</th>
              </tr>
            </thead>
            <tbody>
              {SPONSOR_ADDONS.map((addon) => (
                <tr key={addon.name} className="border-t border-border">
                  <td className="p-4">{addon.name}</td>
                  <td className="p-4 font-semibold">{addon.price}</td>
                  <td className="p-4 text-muted">{addon.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

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
