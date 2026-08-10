import type { MetadataRoute } from "next";
import { getBlogPosts, getNews } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/team", priority: 0.8, changeFrequency: "monthly" },
  { path: "/fahrzeuge", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sponsoren", priority: 0.7, changeFrequency: "monthly" },
  { path: "/formula-student", priority: 0.6, changeFrequency: "yearly" },
  { path: "/news", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/galerie", priority: 0.5, changeFrequency: "monthly" },
  { path: "/erfolge", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mitmachen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
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
