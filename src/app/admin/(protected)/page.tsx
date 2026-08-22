import Link from "next/link";
import { collections } from "@/lib/cms/collections";
import { listItems, latestMtime } from "@/lib/cms/content";
import { getGithubConfig } from "@/lib/cms/github";

function formatRelative(date: Date | null): string {
  if (!date || date.getTime() === 0) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `vor ${diffD} Tag${diffD === 1 ? "" : "en"}`;
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  const stats = await Promise.all(
    collections.map(async (c) => {
      const [items, mtime] = await Promise.all([listItems(c.name), latestMtime(c.name)]);
      return { count: items.length, mtime };
    })
  );
  const githubConnected = Boolean(getGithubConfig());

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Übersicht</h1>
        <p className="text-sm text-muted">Wähle einen Inhaltsbereich aus, um Texte und Bilder zu bearbeiten.</p>
      </div>

      <div
        className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
          githubConnected
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}
      >
        <span aria-hidden>{githubConnected ? "✓" : "!"}</span>
        <p>
          {githubConnected
            ? "GitHub-Anbindung aktiv – jede Speicherung wird automatisch als Commit ins Repository geschrieben."
            : "GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO fehlen). Änderungen werden nur lokal gespeichert und nicht auf GitHub gesichert."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => (
          <Link
            key={c.name}
            href={`/admin/${c.name}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground group-hover:text-accent-text">{c.label}</h2>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">
                {stats[i].count}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted">{c.path}</p>
            <p className="mt-2 text-xs text-muted/70">
              Zuletzt geändert: {formatRelative(stats[i].mtime)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
