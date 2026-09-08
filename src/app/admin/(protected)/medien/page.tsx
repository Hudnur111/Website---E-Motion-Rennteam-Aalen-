import { promises as fs } from "node:fs";
import path from "node:path";
import MediaLibrary from "@/components/admin/MediaLibrary";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

interface MediaFile {
  name: string;
  path: string;
  size: number;
  mtime: number;
}

async function listUploads(): Promise<MediaFile[]> {
  try {
    const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => {
          if (!e.isFile()) return false;
          const ext = path.extname(e.name).toLowerCase();
          return ALLOWED_EXTENSIONS.has(ext) && !e.name.startsWith(".");
        })
        .map(async (e) => {
          const stat = await fs.stat(path.join(UPLOADS_DIR, e.name));
          return {
            name: e.name,
            path: `/uploads/${e.name}`,
            size: stat.size,
            mtime: stat.mtimeMs,
          };
        })
    );
    return files.sort((a, b) => b.mtime - a.mtime);
  } catch {
    return [];
  }
}

export default async function MediaPage() {
  const files = await listUploads();
  return <MediaLibrary initialFiles={files} />;
}
