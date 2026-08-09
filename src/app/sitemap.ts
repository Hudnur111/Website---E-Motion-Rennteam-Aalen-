import type { MetadataRoute } from "next";
import { getBlogPosts, getNews } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/formula-student", changeFrequency: "monthly", priority: 0.7 },
  { path: "/team", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fahrzeuge", changeFrequency: "monthly", priority: 0.8 },
  { path: "/erfolge", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sponsoren", changeFrequency: "monthly", priority: 0.7 },
  { path: "/mitmachen", changeFrequency: "monthly", priority: 0.7 },
  { path: "/news", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/galerie", changeFrequency: "monthly", priority: 0.5 },
  { path: "/kontakt", changeFrequency: "yearly", priority: 0.5 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.1 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.1 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const newsEntries: MetadataRoute.Sitemap = getNews().map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...newsEntries, ...blogEntries];
}
