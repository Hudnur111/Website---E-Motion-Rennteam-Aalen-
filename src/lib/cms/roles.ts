// Rollen für Admin-Zugänge, die über das private Credentials-Repo
// (siehe credentialsRepo.ts) verwaltet werden. Bewusst als offene Liste
// gehalten wie im credentials-repo-Paket selbst - neue Rollen lassen sich
// hier ergänzen, ohne das Paket anfassen zu muessen.

export const ROLE_ADMIN = "Admin";
export const ROLE_SPONSORING = "Sponsoring-Management";

/** Rollen, die im CMS-Panel bei der Anlage/Bearbeitung eines Zugangs zur Auswahl stehen. */
export const ASSIGNABLE_ROLES = [ROLE_ADMIN, ROLE_SPONSORING] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export function isAssignableRole(role: string): role is AssignableRole {
  return (ASSIGNABLE_ROLES as readonly string[]).includes(role);
}

interface SessionLike {
  username: string;
  roles?: string[];
}

/**
 * Der Hauptadministrator (CMS_ADMIN_USER) darf immer Benutzer verwalten -
 * unabhaengig davon, ob das Credentials-Repo konfiguriert ist (Break-Glass-
 * Zugang). Darueber hinaus duerfen Zugaenge mit der Rolle "Admin" aus dem
 * Credentials-Repo ebenfalls Benutzer verwalten; "Sponsoring-Management"
 * ist auf die eigenen Inhalte beschraenkt.
 */
export function canManageUsers(session: SessionLike): boolean {
  if (Boolean(process.env.CMS_ADMIN_USER) && session.username === process.env.CMS_ADMIN_USER) {
    return true;
  }
  return Boolean(session.roles?.includes(ROLE_ADMIN));
}

/**
 * Welche Content-Collection(-Namen aus collections.ts) eine nicht-Admin-Rolle
 * im CMS-Panel sehen und bearbeiten darf. Fehlt eine Rolle hier, hat sie
 * (ausser Admin) auf keine Collection Zugriff.
 */
const ROLE_COLLECTION_ACCESS: Record<string, readonly string[]> = {
  [ROLE_SPONSORING]: ["sponsor"],
};

function isFullAccess(session: SessionLike): boolean {
  if (Boolean(process.env.CMS_ADMIN_USER) && session.username === process.env.CMS_ADMIN_USER) {
    return true;
  }
  if (session.roles?.includes(ROLE_ADMIN)) return true;
  // Lokale/Bootstrap-Nutzer aus der Legacy-Liste (.cms-users.json) tragen
  // keine Rollen aus der Online-Benutzerverwaltung - fuer sie galt bisher
  // immer voller Zugriff, das bleibt so (reine Aufteilung nach Rollen gibt
  // es nur fuer Zugaenge aus dem Credentials-Repo).
  if (!session.roles || session.roles.length === 0) return true;
  return false;
}

/** Ob dieser Zugang die angegebene Content-Collection sehen/bearbeiten darf. */
export function canAccessCollection(session: SessionLike, collectionName: string): boolean {
  if (isFullAccess(session)) return true;
  return Boolean(session.roles?.some((role) => ROLE_COLLECTION_ACCESS[role]?.includes(collectionName)));
}

/** Liste der Collection-Namen, auf die dieser Zugang Zugriff hat (für die Sidebar/Übersicht). */
export function accessibleCollectionNames(session: SessionLike, allCollectionNames: readonly string[]): string[] {
  if (isFullAccess(session)) return [...allCollectionNames];
  const allowed = new Set<string>();
  for (const role of session.roles ?? []) {
    for (const name of ROLE_COLLECTION_ACCESS[role] ?? []) allowed.add(name);
  }
  return allCollectionNames.filter((name) => allowed.has(name));
}
