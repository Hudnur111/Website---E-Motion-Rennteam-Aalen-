"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageEntry {
  name: string;
  path: string;
  size: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/medien");
      if (!res.ok) {
        setError("Bilder konnten nicht geladen werden.");
        return;
      }
      const data = await res.json();
      setImages(data.images ?? []);
      setError("");
    } catch {
      setError("Verbindung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCopy(imgPath: string) {
    try {
      await navigator.clipboard.writeText(imgPath);
      setCopiedPath(imgPath);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      // fallback: select the text
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`Bild "${name}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) return;
    setDeletingName(name);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/medien", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ kind: "error", message: data.error || "Löschen fehlgeschlagen." });
        return;
      }
      setNotice({ kind: "ok", message: data.warning ?? `"${name}" wurde gelöscht.` });
      await load();
    } catch {
      setNotice({ kind: "error", message: "Verbindung fehlgeschlagen." });
    } finally {
      setDeletingName(null);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(true);
    setNotice(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ kind: "error", message: data.error || "Upload fehlgeschlagen." });
        return;
      }
      setNotice({ kind: "ok", message: `Bild gespeichert: ${data.publicPath}` });
      await load();
    } catch {
      setNotice({ kind: "error", message: "Upload fehlgeschlagen." });
    } finally {
      setUploadProgress(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mediathek</h1>
          <p className="text-sm text-muted">
            {loading ? "Lädt…" : `${images.length} Bild${images.length !== 1 ? "er" : ""} in /public/uploads/`}
          </p>
        </div>
        <label className="cursor-pointer rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105">
          {uploadProgress ? "Lädt hoch…" : "+ Bild hochladen"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploadProgress}
          />
        </label>
      </div>

      {notice && (
        <p
          role="status"
          className={`mb-4 rounded-lg border px-3.5 py-2.5 text-sm ${
            notice.kind === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {notice.message}
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && images.length === 0 && !error && (
        <p className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted">
          Noch keine Bilder hochgeladen. Lade das erste Bild hoch, um loszulegen.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.name} className="group relative overflow-hidden rounded-xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.path}
              alt={img.name}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <div className="p-2">
              <p className="truncate text-[11px] font-medium text-foreground" title={img.name}>
                {img.name}
              </p>
              <p className="text-[10px] text-muted">{formatBytes(img.size)}</p>
            </div>
            <div className="flex gap-1 border-t border-border p-2">
              <button
                type="button"
                onClick={() => handleCopy(img.path)}
                className="flex-1 rounded-md px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {copiedPath === img.path ? "✓ Kopiert" : "Pfad kopieren"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(img.name)}
                disabled={deletingName === img.name}
                className="rounded-md px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingName === img.name ? "…" : "Löschen"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
