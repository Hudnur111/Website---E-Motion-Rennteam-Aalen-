// Zusaetzliche CMS-Benutzer (z.B. weitere Redakteur:innen) neben dem
// Haupt-Administrator aus CMS_ADMIN_USER/CMS_ADMIN_PASSWORD_HASH.
//
// Gespeichert wird in einer lokalen, nicht versionierten JSON-Datei
// (.cms-users.json, siehe .gitignore) - genau wie .env.local landet sie
// nie im Git-Repository und bleibt deshalb auch von einem automatischen
// Update (git pull) unberuehrt.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export interface CmsUser {
  username: string;
  passwordHash: string;
  /** Muss beim naechsten Login ein eigenes Passwort vergeben. */
  mustChangePassword: boolean;
}

const USERS_FILE = path.join(process.cwd(), ".cms-users.json");

function readStore(): CmsUser[] {
  if (!existsSync(USERS_FILE)) return [];
  try {
    const raw = readFileSync(USERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as { users?: unknown };
    if (!Array.isArray(parsed.users)) return [];
    return parsed.users.filter(
      (u): u is CmsUser =>
        typeof u === "object" &&
        u !== null &&
        typeof (u as CmsUser).username === "string" &&
        typeof (u as CmsUser).passwordHash === "string"
    );
  } catch {
    return [];
  }
}

function writeStore(users: CmsUser[]): void {
  writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2) + "\n", "utf-8");
}

export function listUsers(): CmsUser[] {
  return readStore();
}

export function findUser(username: string): CmsUser | undefined {
  return readStore().find((u) => u.username === username);
}

/** Legt einen Benutzer neu an oder setzt sein Passwort zurueck (mit Zwang zur Neuvergabe). */
export function upsertUser(username: string, passwordHash: string): void {
  const users = readStore();
  const idx = users.findIndex((u) => u.username === username);
  const user: CmsUser = { username, passwordHash, mustChangePassword: true };
  if (idx === -1) users.push(user);
  else users[idx] = user;
  writeStore(users);
}

/** Setzt ein selbst gewaehltes Passwort und hebt die Neuvergabe-Pflicht auf. */
export function setUserPassword(username: string, passwordHash: string): boolean {
  const users = readStore();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], passwordHash, mustChangePassword: false };
  writeStore(users);
  return true;
}

export function deleteUser(username: string): boolean {
  const users = readStore();
  const next = users.filter((u) => u.username !== username);
  if (next.length === users.length) return false;
  writeStore(next);
  return true;
}
