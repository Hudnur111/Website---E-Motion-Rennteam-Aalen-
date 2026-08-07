import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  return { title: post ? `${post.title} | Blog | E-Motion Rennteam Aalen` : "Blog" };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const html = await marked.parse(post.body || "");

  return (
    <article className="container-page max-w-3xl py-20">
      <Reveal>
        <Link href="/blog" className="text-sm font-semibold text-accent-2 hover:underline">
          &larr; Zurück zum Blog
        </Link>

        <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
          <time>
            {new Date(post.date).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
          {post.author && (
            <>
              <span aria-hidden>·</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
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
          className="prose prose-invert mt-8 max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-accent-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
    </article>
  );
}
