import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, getSessionUser } from "@/lib/cms/auth";
import { hashPassword } from "@/lib/cms/password";
import { setUserPassword } from "@/lib/cms/users";

export async function POST(request: NextRequest) {
  const session = await getSessionUser(request);
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: { newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { newPassword } = body;
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "Das Passwort muss mindestens 8 Zeichen lang sein." }, { status: 400 });
  }

  const updated = setUserPassword(session.username, hashPassword(newPassword));
  if (!updated) {
    return NextResponse.json(
      { error: "Für diesen Benutzer kann das Passwort hier nicht geändert werden." },
      { status: 400 }
    );
  }

  const token = await createSessionToken(session.username, false);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
