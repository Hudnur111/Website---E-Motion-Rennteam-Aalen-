import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/cms/content";
import { getSessionUser } from "@/lib/cms/auth";

const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Nur Bilddateien (JPG, PNG, WebP, GIF, SVG) sind erlaubt." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Datei ist zu groß (max. 8 MB)." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = await saveUploadedImage(file.name, bytes, user.username);
  return NextResponse.json(result);
}
