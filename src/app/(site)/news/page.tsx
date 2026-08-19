import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export const metadata: Metadata = {
  title: "News",
  description:
    "Aktuelle News des E-Motion Rennteams Aalen: Berichte von Rennen, Events und dem Fahrzeugbau der aktuellen Saison.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const news = getNews();

  return (
    <div className="container-page py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-text">News &amp; Blog</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">Aktuelles vom Team</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Wettbewerbsberichte, Baufortschritt und Neuigkeiten rund um das E-Motion Rennteam Aalen.
        </p>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/news/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_30px_-10px_rgba(74,99,247,0.35)]"
            >
              <div className="aspect-video overflow-hidden bg-surface-2">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={600}
                    height={340}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    E-Motion
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time className="text-xs uppercase tracking-wide text-muted">
                  {new Date(post.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <h2 className="mt-2 text-lg font-semibold group-hover:text-accent-text">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
