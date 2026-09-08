import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/cms/auth";
import { listUsers } from "@/lib/cms/users";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  if (session.username !== process.env.CMS_ADMIN_USER) redirect("/admin");

  const initialUsers = listUsers().map(({ username, mustChangePassword }) => ({ username, mustChangePassword }));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Benutzerverwaltung</h1>
        <p className="text-sm text-muted">
          Lege weitere Redaktions-Zugänge an – z. B. für Teamkolleg:innen, die von ihrem eigenen Gerät aus
          Inhalte pflegen sollen. Jede:r neue Nutzer:in vergibt beim ersten Login ein eigenes, nur ihr/ihm
          bekanntes Passwort.
        </p>
      </div>
      <UserManager adminUsername={session.username} initialUsers={initialUsers} />
    </div>
  );
}
