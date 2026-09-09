import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/cms/auth";
import { listUsers } from "@/lib/cms/users";
import { canManageUsers } from "@/lib/cms/roles";
import { isRemoteAuthEnabled, getCredentialsClient } from "@/lib/cms/credentialsRepo";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  if (!canManageUsers(session)) redirect("/admin");

  const remote = isRemoteAuthEnabled();
  const initialUsers = remote
    ? (await getCredentialsClient().loadAdmins({ forceRefresh: true })).users.map((u) => ({
        username: u.username,
        mustChangePassword: u.mustChangePassword,
        roles: u.roles,
        disabled: u.disabled,
      }))
    : listUsers().map(({ username, mustChangePassword }) => ({
        username,
        mustChangePassword,
        roles: [] as string[],
        disabled: false,
      }));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Benutzerverwaltung</h1>
        <p className="text-sm text-muted">
          Lege weitere Redaktions-Zugänge an – z. B. für Teamkolleg:innen, die von ihrem eigenen Gerät aus
          Inhalte pflegen sollen. Jede:r neue Nutzer:in vergibt beim ersten Login ein eigenes, nur ihr/ihm
          bekanntes Passwort.
          {remote && " Zugänge, Rollen und Passwort-Hashes werden verschlüsselt in der Online-Benutzerverwaltung gespeichert."}
        </p>
      </div>
      <UserManager adminUsername={session.username} initialUsers={initialUsers} remote={remote} />
    </div>
  );
}
