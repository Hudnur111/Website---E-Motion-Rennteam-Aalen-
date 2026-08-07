import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readCollection<T>(collection: string): (T & { slug: string })[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        ...(data as T),
        slug: file.replace(/\.md$/, ""),
        body: content,
      } as T & { slug: string; body: string };
    });
}

export type TeamMember = {
  name: string;
  role: string;
  department: string;
  order?: number;
  photo?: string;
  linkedin?: string;
  body: string;
  slug: string;
};

export type Vehicle = {
  name: string;
  year: number;
  tagline?: string;
  coverImage?: string;
  current?: boolean;
  specs?: { label: string; value: string }[];
  body: string;
  slug: string;
};

export type Sponsor = {
  name: string;
  tier: "Platin" | "Gold" | "Silber" | "Partner";
  logo?: string;
  website?: string;
  body: string;
  slug: string;
};

export type NewsPost = {
  title: string;
  date: string;
  excerpt?: string;
  coverImage?: string;
  body: string;
  slug: string;
};

export type Page = {
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  body: string;
  slug: string;
};

export function getTeam(): TeamMember[] {
  return readCollection<TeamMember>("team").sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
}

export function getVehicles(): Vehicle[] {
  return readCollection<Vehicle>("vehicles").sort((a, b) => b.year - a.year);
}

export function getSponsors(): Sponsor[] {
  const tierOrder = ["Platin", "Gold", "Silber", "Partner"];
  return readCollection<Sponsor>("sponsors").sort(
    (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
  );
}

export function getNews(): NewsPost[] {
  return readCollection<NewsPost>("news").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return getNews().find((post) => post.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  return readCollection<Page>("pages").find((page) => page.slug === slug);
}
