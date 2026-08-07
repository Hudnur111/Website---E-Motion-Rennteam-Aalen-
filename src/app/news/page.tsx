import Link from "next/link";
import Image from "next/image";
import { getNews } from "@/lib/content";

export const metadata = { title: "News | E-Motion Rennteam Aalen" };

export default function NewsPage() {
  const news = getNews();

  return (
    <div className="container-page py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">News &amp; Blog</p>
      <h1 className="mt-2 text-4xl font-extrabold">Aktuelles vom Team</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Wettbewerbsberichte, Baufortschritt und Neuigkeiten rund um das E-Motion Rennteam Aalen.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
          >
            <div className="aspect-video overflow-hidden bg-surface-2">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={340}
                  className="h-full w-full object-cover"
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
              <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
