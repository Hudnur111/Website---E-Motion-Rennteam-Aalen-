import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCollection } from "./collections";
import { commitFile, commitBinaryFile, deleteFile as githubDeleteFile, getGithubConfig } from "./github";

const ROOT = process.cwd();

export interface ContentItem {
  slug: string;
  data: Record<string, unknown>;
  body: string;
}

export interface SaveResult {
  committedToGithub: boolean;
  commitUrl: string | null;
  warning?: string;
}

// Slugs end up in filesystem paths (path.join(ROOT, collection.path, `${slug}.md`))
// and as-is in GitHub Contents API paths. slugify() only ever produces safe
// values, but getItem/saveItem/deleteItem also accept a slug straight from
// the URL's dynamic route segment (editing/deleting an existing item) —
// without this check, a crafted slug like "../../../etc/passwd" or one
// containing an encoded slash could read, overwrite, or delete files outside
// the intended content directory, including in the GitHub repo itself.
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return VALID_SLUG.test(slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "eintrag";
}

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function listItems(collectionName: string): Promise<ContentItem[]> {
  const collection = getCollection(collectionName);
  if (!collection) throw new Error(`Unbekannte Collection: ${collectionName}`);
  const dir = path.join(/* turbopackIgnore: true */ ROOT, collection.path);
  const files = (await readDirSafe(dir)).filter((f) => f.endsWith(".md"));
  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const parsed = matter(raw);
      return { slug: file.replace(/\.md$/, ""), data: parsed.data, body: parsed.content.trim() };
    })
  );
  return items.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getItem(collectionName: string, slug: string): Promise<ContentItem | null> {
  const collection = getCollection(collectionName);
  if (!collection) throw new Error(`Unbekannte Collection: ${collectionName}`);
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(/* turbopackIgnore: true */ ROOT, collection.path, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = matter(raw);
    return { slug, data: parsed.data, body: parsed.content.trim() };
  } catch {
    return null;
  }
}

function serialize(data: Record<string, unknown>, body: string): string {
  return matter.stringify(body ? `\n${body}\n` : "\n", data);
}

export async function saveItem(
  collectionName: string,
  slug: string,
  data: Record<string, unknown>,
  body: string,
  authorName: string
): Promise<SaveResult> {
  const collection = getCollection(collectionName);
  if (!collection) throw new Error(`Unbekannte Collection: ${collectionName}`);
  if (!isValidSlug(slug)) throw new Error(`Ungültiger Slug: "${slug}"`);
  const relPath = path.join(collection.path, `${slug}.md`).split(path.sep).join("/");
  const content = serialize(data, body);

  // Best-effort local write so the running dev instance reflects the change
  // immediately. This does not persist on most serverless hosts, which is
  // why the GitHub commit below is the source of truth.
  try {
    const absPath = path.join(/* turbopackIgnore: true */ ROOT, relPath);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, content, "utf-8");
  } catch {
    // ignore (read-only filesystem in some deployments)
  }

  if (!getGithubConfig()) {
    return {
      committedToGithub: false,
      commitUrl: null,
      warning:
        "GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO). Änderung wurde nur lokal gespeichert und ist NICHT auf GitHub gesichert.",
    };
  }

  const { commitUrl } = await commitFile(
    relPath,
    content,
    `cms: ${collection.label} "${slug}" aktualisieren`,
    authorName
  );
  return { committedToGithub: true, commitUrl };
}

export async function deleteItem(collectionName: string, slug: string, authorName: string): Promise<SaveResult> {
  const collection = getCollection(collectionName);
  if (!collection) throw new Error(`Unbekannte Collection: ${collectionName}`);
  if (!isValidSlug(slug)) throw new Error(`Ungültiger Slug: "${slug}"`);
  const relPath = path.join(collection.path, `${slug}.md`).split(path.sep).join("/");

  try {
    await fs.unlink(path.join(/* turbopackIgnore: true */ ROOT, relPath));
  } catch {
    // ignore
  }

  if (!getGithubConfig()) {
    return {
      committedToGithub: false,
      commitUrl: null,
      warning: "GitHub-Anbindung ist nicht konfiguriert. Löschung wurde nur lokal ausgeführt.",
    };
  }

  await githubDeleteFile(relPath, `cms: ${collection.label} "${slug}" löschen`, authorName);
  return { committedToGithub: true, commitUrl: null };
}

export async function saveUploadedImage(
  fileName: string,
  bytes: Uint8Array,
  authorName: string
): Promise<{ publicPath: string } & SaveResult> {
  const safeName = `${Date.now()}-${slugify(fileName.replace(/\.[^/.]+$/, ""))}${path.extname(fileName)}`;
  const relPath = `public/uploads/${safeName}`;
  const publicPath = `/uploads/${safeName}`;

  try {
    const absPath = path.join(/* turbopackIgnore: true */ ROOT, relPath);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, bytes);
  } catch {
    // ignore
  }

  if (!getGithubConfig()) {
    return {
      publicPath,
      committedToGithub: false,
      commitUrl: null,
      warning:
        "GitHub-Anbindung ist nicht konfiguriert. Bild wurde nur lokal gespeichert und ist NICHT auf GitHub gesichert.",
    };
  }

  const { commitUrl } = await commitBinaryFile(relPath, bytes, `cms: Bild "${safeName}" hochladen`, authorName);
  return { publicPath, committedToGithub: true, commitUrl };
}
