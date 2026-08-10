import type { MetadataRoute } from "next";
import { getBlogPosts, getNews } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/fahrzeuge", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/sponsoren", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/formula-student", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/galerie", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/erfolge", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/mitmachen", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
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
    priority: 0.6,
  }));

  return [...staticEntries, ...newsEntries, ...blogEntries];
}
