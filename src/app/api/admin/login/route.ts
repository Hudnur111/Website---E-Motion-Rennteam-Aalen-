import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/cms/auth";
import { hashPassword, verifyPassword } from "@/lib/cms/password";
import { findUser } from "@/lib/cms/users";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// A fixed, precomputed hash with no matching password. Verifying against it
// when the username doesn't exist keeps the scrypt cost identical to the
// "user found, wrong password" path, so response timing can't be used to
// enumerate which usernames are valid.
const DUMMY_PASSWORD_HASH = hashPassword("dummy-password-for-constant-time-login");

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

  if ((!adminUser || !adminHash) && typeof username === "string" && !findUser(username)) {
    return NextResponse.json(
      { error: "CMS-Login ist serverseitig nicht konfiguriert (CMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH fehlen)." },
      { status: 500 }
    );
  }

  let mustChangePassword = false;
  let authenticated = false;

  if (typeof username === "string" && typeof password === "string") {
    if (adminUser && adminHash && username === adminUser) {
      if (verifyPassword(password, adminHash)) authenticated = true;
    } else {
      const user = findUser(username);
      if (user) {
        if (verifyPassword(password, user.passwordHash)) {
          authenticated = true;
          mustChangePassword = user.mustChangePassword;
        }
      } else {
        // Unknown username: still pay the scrypt cost so this branch takes
        // the same time as a real "wrong password" check above.
        verifyPassword(password, DUMMY_PASSWORD_HASH);
      }
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: "Benutzername oder Passwort ist falsch." }, { status: 401 });
  }

  const token = await createSessionToken(username as string, mustChangePassword);
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
