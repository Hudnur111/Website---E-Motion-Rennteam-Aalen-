"use client";

import { useState } from "react";

interface UserRow {
  username: string;
  mustChangePassword: boolean;
}

interface UserManagerProps {
  adminUsername: string;
  initialUsers: UserRow[];
}

export default function UserManager({ adminUsername, initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [createdInfo, setCreatedInfo] = useState<{ username: string; password: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadUsers() {
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Benutzer konnten nicht geladen werden.");
        return;
      }
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      setError("Verbindung zum Server fehlgeschlagen.");
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setCreatedInfo(null);

    if (!username.trim()) {
      setFormError("Bitte einen Benutzernamen angeben.");
      return;
    }
    if (temporaryPassword.length < 8) {
      setFormError("Das temporäre Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), temporaryPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error || "Benutzer konnte nicht angelegt werden.");
        return;
      }
      setCreatedInfo({ username: username.trim(), password: temporaryPassword });
      setUsername("");
      setTemporaryPassword("");
      await loadUsers();
    } catch {
      setFormError("Verbindung zum Server fehlgeschlagen.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(target: string) {
    if (!confirm(`Zugang von "${target}" wirklich entfernen?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(target)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Benutzer konnte nicht entfernt werden.");
        return;
      }
      await loadUsers();
    } catch {
      setError("Verbindung zum Server fehlgeschlagen.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold text-foreground">Neuen Benutzer anlegen</h2>
        <p className="mt-1 text-sm text-muted">
          Vergib einen Benutzernamen und ein beliebiges temporäres Passwort. Teile beides der Person mit – sie
          muss sich beim ersten Login damit anmelden und wird dann direkt aufgefordert, ein eigenes, geheimes
          Passwort zu vergeben.
        </p>

        <form onSubmit={handleCreate} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-username" className="mb-1.5 block text-sm font-medium text-foreground">
              Benutzername
            </label>
            <input
              id="new-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="z. B. Linda"
            />
          </div>
          <div>
            <label htmlFor="new-temp-password" className="mb-1.5 block text-sm font-medium text-foreground">
              Temporäres Passwort
            </label>
            <input
              id="new-temp-password"
              type="text"
              required
              minLength={8}
              value={temporaryPassword}
              onChange={(e) => setTemporaryPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              placeholder="mind. 8 Zeichen"
            />
          </div>

          {formError && (
            <p role="alert" className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              {formError}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? "Wird angelegt…" : "Benutzer anlegen"}
            </button>
          </div>
        </form>

        {createdInfo && (
          <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <p className="font-semibold">Benutzer &quot;{createdInfo.username}&quot; wurde angelegt.</p>
            <p className="mt-1">
              Zugangsdaten für die erste Anmeldung: Benutzername <strong>{createdInfo.username}</strong>, Passwort{" "}
              <strong>{createdInfo.password}</strong>. Bitte sicher übermitteln – nach dem ersten Login vergibt die
              Person selbst ein neues Passwort, das nur sie kennt.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-semibold text-foreground">Bestehende Zugänge</h2>

        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-4 divide-y divide-border">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{adminUsername}</p>
              <p className="text-xs text-muted">Hauptadministrator – volle Berechtigung</p>
            </div>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-text">
              Admin
            </span>
          </div>

          {users.length === 0 && (
            <p className="py-3 text-sm text-muted">Noch keine weiteren Benutzer angelegt.</p>
          )}

          {users.map((u) => (
            <div key={u.username} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{u.username}</p>
                <p className="text-xs text-muted">
                  {u.mustChangePassword ? "Wartet auf erste Anmeldung / eigenes Passwort" : "Aktiv"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(u.username)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
