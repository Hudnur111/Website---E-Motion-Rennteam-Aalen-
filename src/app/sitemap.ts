import type { MetadataRoute } from "next";
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
  { path: "/galerie", priority: 0.5, changeFrequency: "monthly" },
  { path: "/erfolge", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mitmachen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.5, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
