import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/cms/auth";
import { hashPassword } from "@/lib/cms/password";
import { listUsers, upsertUser } from "@/lib/cms/users";

function requireAdmin(username: string): boolean {
  return Boolean(process.env.CMS_ADMIN_USER) && username === process.env.CMS_ADMIN_USER;
}

export async function GET(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  if (!requireAdmin(session.username)) {
    return NextResponse.json({ error: "Nur der Hauptadministrator kann Benutzer verwalten." }, { status: 403 });
  }

  const users = listUsers().map(({ username, mustChangePassword }) => ({ username, mustChangePassword }));
  return NextResponse.json({
    admin: process.env.CMS_ADMIN_USER ?? null,
    users,
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  if (!requireAdmin(session.username)) {
    return NextResponse.json({ error: "Nur der Hauptadministrator kann Benutzer verwalten." }, { status: 403 });
  }

  let body: { username?: string; temporaryPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const username = body.username?.trim();
  const temporaryPassword = body.temporaryPassword ?? "";

  if (!username) {
    return NextResponse.json({ error: "Bitte einen Benutzernamen angeben." }, { status: 400 });
  }
  if (username === process.env.CMS_ADMIN_USER) {
    return NextResponse.json({ error: "Dieser Benutzername ist bereits der Hauptadministrator." }, { status: 400 });
  }
  if (temporaryPassword.length < 8) {
    return NextResponse.json({ error: "Das temporäre Passwort muss mindestens 8 Zeichen lang sein." }, { status: 400 });
  }

  upsertUser(username, hashPassword(temporaryPassword));
  return NextResponse.json({ ok: true, username, mustChangePassword: true });
}
