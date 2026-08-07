import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, getNews, getSponsors } from "@/lib/content";
import HeroBackground from "@/components/motion/HeroBackground";
import HeroContent from "@/components/motion/HeroContent";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import Counter from "@/components/motion/Counter";

const STATS = [
  { value: 60, suffix: "+", label: "Studierende im Team" },
  { value: 8, suffix: "", label: "Fachbereiche" },
  { value: 12, suffix: "+", label: "Jahre Erfahrung" },
  { value: 2, suffix: "", label: "Wettbewerbe pro Saison" },
];

export default function Home() {
  const page = getPage("home");
  const vehicle = getVehicles().find((v) => v.current) ?? getVehicles()[0];
  const news = getNews().slice(0, 3);
  const sponsors = getSponsors().slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackground />
        <div className="container-page relative py-28 sm:py-36">
          <HeroContent
            eyebrow="Formula Student Electric"
            title={page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            subtitle={page?.heroSubtitle ?? "Elektrisch. Ambitioniert. Aalen."}
          />
        </div>

        <div className="relative border-t border-border/60 bg-background/40 backdrop-blur-sm">
          <StaggerGroup className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
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
        <section className="container-page py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal direction="left" className="order-2 md:order-1">
              <div className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface">
                {vehicle.coverImage ? (
                  <Image
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    Fahrzeugbild folgt
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.1} className="order-1 md:order-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                {vehicle.year} · Aktuelles Fahrzeug
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{vehicle.name}</h2>
              <p className="mt-3 text-muted">{vehicle.tagline}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {vehicle.specs?.slice(0, 4).map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/60"
                  >
                    <dt className="text-xs uppercase tracking-wide text-muted">{spec.label}</dt>
                    <dd className="mt-1 text-lg font-semibold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/fahrzeuge"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-all hover:gap-2 hover:underline"
              >
                Alle technischen Daten ansehen <span aria-hidden>&rarr;</span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="border-t border-border bg-surface py-24">
          <div className="container-page">
            <Reveal className="flex items-end justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">Aktuelle News</h2>
              <Link href="/news" className="text-sm font-semibold text-accent hover:underline">
                Alle News &rarr;
              </Link>
            </Reveal>
            <StaggerGroup className="mt-8 grid gap-6 md:grid-cols-3">
              {news.map((post) => (
                <StaggerItem key={post.slug}>
                  <Link
                    href={`/news/${post.slug}`}
                    className="group block h-full rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_-8px_rgba(74,99,247,0.35)]"
                  >
                    <time className="text-xs uppercase tracking-wide text-muted">
                      {new Date(post.date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 text-lg font-semibold group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {sponsors.length > 0 && (
        <section className="container-page py-24">
          <Reveal>
            <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted">
              Unsere Sponsoren &amp; Partner
            </h2>
          </Reveal>
          <StaggerGroup className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {sponsors.map((sponsor) => (
              <StaggerItem key={sponsor.slug}>
                <span className="text-lg font-semibold text-muted/80 transition-colors hover:text-foreground">
                  {sponsor.name}
                </span>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal className="mt-8 text-center" delay={0.1}>
            <Link href="/sponsoren" className="text-sm font-semibold text-accent hover:underline">
              Alle Sponsoren ansehen &rarr;
            </Link>
          </Reveal>
        </section>
      )}
    </>
  );
}
