import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSessionUser } from "@/lib/cms/auth";
import { deleteFile as githubDeleteFile, getGithubConfig } from "@/lib/cms/github";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// Validates that a given filename is safe: no path separators, no dots as
// first char, only allowed image extensions. Prevents path traversal.
function isSafeFilename(filename: string): boolean {
  if (!filename || filename.includes("/") || filename.includes("\\")) return false;
  if (filename.startsWith(".")) return false;
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  try {
    const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile() && isSafeFilename(e.name))
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
    // Newest first
    files.sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ error: "Medienverzeichnis nicht lesbar." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  let filename: string;
  try {
    const body = await request.json();
    filename = String(body.filename ?? "");
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!isSafeFilename(filename)) {
    return NextResponse.json({ error: "Ungültiger Dateiname." }, { status: 400 });
  }

  const absPath = path.join(UPLOADS_DIR, filename);
  try {
    await fs.unlink(absPath);
  } catch {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  if (!getGithubConfig()) {
    return NextResponse.json({
      committedToGithub: false,
      warning: "GitHub-Anbindung fehlt – Datei wurde nur lokal gelöscht.",
    });
  }

  try {
    await githubDeleteFile(`public/uploads/${filename}`, `cms: Bild "${filename}" löschen`, session.username);
  } catch {
    return NextResponse.json({
      committedToGithub: false,
      warning: "Lokal gelöscht, aber GitHub-Commit fehlgeschlagen.",
    });
  }

  return NextResponse.json({ committedToGithub: true });
}
