import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getNews, getNewsBySlug } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return getNews().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getNewsBySlug(params.slug);
  return { title: post ? `${post.title} | E-Motion Rennteam Aalen` : "News" };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  const html = await marked.parse(post.body || "");

  return (
    <article className="container-page max-w-3xl py-20">
      <Reveal>
        <Link href="/news" className="text-sm font-semibold text-accent hover:underline">
          &larr; Zurück zu News
        </Link>

        <time className="mt-6 block text-xs uppercase tracking-wide text-muted">
          {new Date(post.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </time>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{post.title}</h1>
      </Reveal>

      {post.coverImage && (
        <Reveal delay={0.1}>
          <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-surface-2">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={900}
              height={506}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <div
          className="prose prose-invert mt-8 max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
    </article>
  );
}
