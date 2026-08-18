import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/cms/auth";
import { verifyPassword } from "@/lib/cms/password";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`cms-login:${ip}`, 5, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Zu viele Anmeldeversuche. Bitte in ein paar Minuten erneut versuchen." },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { username, password } = body;
  const adminUser = process.env.CMS_ADMIN_USER;
  const adminHash = process.env.CMS_ADMIN_PASSWORD_HASH;

  if (!adminUser || !adminHash) {
    return NextResponse.json(
      { error: "CMS-Login ist serverseitig nicht konfiguriert (CMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH fehlen)." },
      { status: 500 }
    );
  }

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username !== adminUser ||
    !verifyPassword(password, adminHash)
  ) {
    return NextResponse.json({ error: "Benutzername oder Passwort ist falsch." }, { status: 401 });
  }

  const token = await createSessionToken(username);
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
