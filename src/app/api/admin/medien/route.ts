import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { promises as fs } from "node:fs";
import path from "node:path";
import { commitBinaryFile, deleteFile as githubDeleteFile, getGithubConfig } from "@/lib/cms/github";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;

async function listUploadedImages(): Promise<{ name: string; path: string; size: number }[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(UPLOADS_DIR);
  } catch {
    return [];
  }
  const results = await Promise.all(
    entries
      .filter((f) => IMAGE_EXTENSIONS.test(f))
      .map(async (name) => {
        let size = 0;
        try {
          const stat = await fs.stat(path.join(UPLOADS_DIR, name));
          size = stat.size;
        } catch {
          // ignore
        }
        return { name, path: `/uploads/${name}`, size };
      })
  );
  return results.sort((a, b) => b.name.localeCompare(a.name));
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const images = await listUploadedImages();
  return NextResponse.json({ images });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { name } = body;
  if (!name || !/^[a-zA-Z0-9._-]+$/.test(name) || !IMAGE_EXTENSIONS.test(name)) {
    return NextResponse.json({ error: "Ungültiger Dateiname." }, { status: 400 });
  }

  const absPath = path.join(UPLOADS_DIR, name);
  try {
    await fs.unlink(absPath);
  } catch {
    // ignore – file may not exist locally in serverless env
  }

  if (getGithubConfig()) {
    try {
      await githubDeleteFile(`public/uploads/${name}`, `cms: Bild "${name}" löschen`, user.username);
    } catch {
      return NextResponse.json({ warning: "Lokal gelöscht, GitHub-Commit fehlgeschlagen." });
    }
  }

  return NextResponse.json({ ok: true });
}
