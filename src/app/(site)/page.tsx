import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, TEAM_DEPARTMENTS } from "@/lib/content";
import HeroBackground from "@/components/motion/HeroBackground";
import HeroContent from "@/components/motion/HeroContent";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";
import ScrollScale from "@/components/motion/ScrollScale";

const STATS = [
  { value: 50, suffix: "+", label: "Studierende im Team" },
  { value: TEAM_DEPARTMENTS.length, suffix: "", label: "Fachbereiche" },
  { value: 12, suffix: "+", label: "Jahre Erfahrung" },
];

export default function Home() {
  const page = getPage("home");
  const vehicle = getVehicles().find((v) => v.current) ?? getVehicles()[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackground />
        <div className="container-page relative pb-20 pt-28 sm:pb-28 sm:pt-36">
          <HeroContent
            eyebrow="Formula Student"
            title={page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            subtitle={page?.heroSubtitle ?? "Elektrisch. Ambitioniert. Aalen."}
          />
        </div>

        {vehicle?.coverImage && (
          <div className="container-page relative pb-20 sm:pb-28">
            <ScrollScale className="mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/60 bg-surface shadow-[0_40px_120px_-40px_rgba(74,99,247,0.35)] sm:aspect-[21/9]">
              <Image
                src={vehicle.coverImage}
                alt={vehicle.name}
                width={1600}
                height={900}
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="h-full w-full object-cover"
              />
            </ScrollScale>
          </div>
        )}

        <div className="relative border-t border-border/60 bg-background/40 backdrop-blur-sm">
          <StaggerGroup className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-3">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="text-center sm:text-left">
                <div className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {vehicle && (
        <section className="container-page py-28 text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">
              {vehicle.year} · Aktuelles Fahrzeug
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              {vehicle.name}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{vehicle.tagline}</p>
          </Reveal>
          <StaggerGroup className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 items-stretch">
            {vehicle.specs?.slice(0, 4).map((spec) => (
              <StaggerItem key={spec.label} className="h-full">
                <div className="flex h-full flex-col justify-center rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/60">
                  <div className="text-xs uppercase tracking-wide text-muted">{spec.label}</div>
                  <div className="mt-1.5 text-lg font-semibold">{spec.value}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.1} className="mt-10">
            <Link
              href="/fahrzeuge"
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-text transition-all hover:gap-2 hover:underline"
            >
              Alle technischen Daten ansehen <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </section>
      )}

      <section className="container-page py-24 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Unsere Sponsoren</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Ohne unsere Partner wäre unser Projekt nicht möglich. Lernen Sie die Unternehmen
            kennen, die uns unterstützen.
          </p>
          <Link
            href="/sponsoren"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:gap-2.5"
          >
            Zu unseren Sponsoren <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
