import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { deleteUser } from "@/lib/cms/users";

function requireAdmin(username: string): boolean {
  return Boolean(process.env.CMS_ADMIN_USER) && username === process.env.CMS_ADMIN_USER;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  if (!requireAdmin(session.username)) {
    return NextResponse.json({ error: "Nur der Hauptadministrator kann Benutzer verwalten." }, { status: 403 });
  }

  const { username } = await params;
  const removed = deleteUser(decodeURIComponent(username));
  if (!removed) {
    return NextResponse.json({ error: "Benutzer wurde nicht gefunden." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
