import Link from "next/link";
import Image from "next/image";
import { getPage, getVehicles, getNews, getSponsors } from "@/lib/content";

export default function Home() {
  const page = getPage("home");
  const vehicle = getVehicles().find((v) => v.current) ?? getVehicles()[0];
  const news = getNews().slice(0, 3);
  const sponsors = getSponsors().slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(198,255,30,0.15),transparent_45%)]" />
        <div className="container-page relative py-24 sm:py-32">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
            Formula Student Electric
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            <span className="text-gradient-accent">
              {page?.heroTitle ?? "E-Motion Rennteam Aalen"}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            {page?.heroSubtitle ??
              "Elektrisch. Ambitioniert. Aalen."}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/fahrzeuge"
              className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              Unser Fahrzeug entdecken
            </Link>
            <Link
              href="/sponsoren"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Sponsor werden
            </Link>
          </div>
        </div>
      </section>

      {vehicle && (
        <section className="container-page py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 aspect-video overflow-hidden rounded-xl border border-border bg-surface md:order-1">
              {vehicle.coverImage ? (
                <Image
                  src={vehicle.coverImage}
                  alt={vehicle.name}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted">
                  Fahrzeugbild folgt
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                {vehicle.year} · Aktuelles Fahrzeug
              </p>
              <h2 className="mt-2 text-3xl font-bold">{vehicle.name}</h2>
              <p className="mt-3 text-muted">{vehicle.tagline}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {vehicle.specs?.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="rounded-lg border border-border bg-surface p-4">
                    <dt className="text-xs uppercase tracking-wide text-muted">{spec.label}</dt>
                    <dd className="mt-1 text-lg font-semibold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/fahrzeuge"
                className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
              >
                Alle technischen Daten ansehen &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="border-t border-border bg-surface py-20">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold">Aktuelle News</h2>
              <Link href="/news" className="text-sm font-semibold text-accent hover:underline">
                Alle News &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {news.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-accent"
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
              ))}
            </div>
          </div>
        </section>
      )}

      {sponsors.length > 0 && (
        <section className="container-page py-20">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted">
            Unsere Sponsoren &amp; Partner
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {sponsors.map((sponsor) => (
              <span key={sponsor.slug} className="text-lg font-semibold text-muted/80">
                {sponsor.name}
              </span>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/sponsoren" className="text-sm font-semibold text-accent hover:underline">
              Alle Sponsoren ansehen &rarr;
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
