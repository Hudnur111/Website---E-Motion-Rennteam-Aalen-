import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSessionUser } from "@/lib/cms/auth";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_DEPTH = 3;

// Strips accents/diacritics and anything but letters/digits so "Timo M."
// and "timo-m" both normalize to "timom" for comparison against filenames.
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

type Candidate = { path: string; stem: string; mtime: number };

async function collectImages(dir: string, base: string, depth: number): Promise<Candidate[]> {
  if (depth > MAX_DEPTH) return [];
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const results: Candidate[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectImages(abs, base, depth + 1)));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!entry.isFile() || !ALLOWED_EXTENSIONS.has(ext)) continue;
    const stat = await fs.stat(abs);
    const relative = path.relative(base, abs).split(path.sep).join("/");
    results.push({
      path: `/uploads/${relative}`,
      stem: normalize(path.basename(entry.name, ext)),
      mtime: stat.mtimeMs,
    });
  }
  return results;
}

// Looks up an already-uploaded image (anywhere under public/uploads/, any
// depth) whose filename matches a typed name, so editors don't have to
// manually re-upload a photo that's already there under e.g.
// "single-bilder-upload/<Name>.jpg". Matches the full name first, falling
// back to just the first word (most existing files are named by first name
// only); picks the newest file on a tie.
export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const name = request.nextUrl.searchParams.get("name")?.trim() ?? "";
  if (!name) return NextResponse.json({ path: null });

  const images = await collectImages(UPLOADS_DIR, UPLOADS_DIR, 0);

  const fullNorm = normalize(name);
  const firstWordNorm = normalize(name.split(/\s+/)[0] ?? "");

  const pick = (stem: string) => {
    const candidates = images.filter((img) => img.stem === stem);
    if (!candidates.length) return null;
    return candidates.reduce((a, b) => (b.mtime > a.mtime ? b : a));
  };

  const match = pick(fullNorm) ?? (firstWordNorm && firstWordNorm !== fullNorm ? pick(firstWordNorm) : null);
  return NextResponse.json({ path: match?.path ?? null });
}
