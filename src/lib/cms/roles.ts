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
