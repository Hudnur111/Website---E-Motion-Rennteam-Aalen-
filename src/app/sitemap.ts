import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getBlogPosts, getNews } from "@/lib/content";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/team", priority: 0.8 },
  { path: "/fahrzeuge", priority: 0.8 },
  { path: "/formula-student", priority: 0.7 },
  { path: "/erfolge", priority: 0.7 },
  { path: "/sponsoren", priority: 0.7 },
  { path: "/mitmachen", priority: 0.7 },
  { path: "/news", priority: 0.6 },
  { path: "/blog", priority: 0.6 },
  { path: "/galerie", priority: 0.5 },
  { path: "/kontakt", priority: 0.5 },
  { path: "/impressum", priority: 0.2 },
  { path: "/datenschutz", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      priority,
    })
  );

  const newsEntries: MetadataRoute.Sitemap = getNews().map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.5,
  }));

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.5,
  }));

  return [...staticEntries, ...newsEntries, ...blogEntries];
}
