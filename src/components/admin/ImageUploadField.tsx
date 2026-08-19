"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Kept separate so a hard failure (nothing uploaded, red) never looks the
  // same as a soft warning (upload succeeded, e.g. "not committed to
  // GitHub", amber) — they used to share one field and one color.
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    setWarning("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload fehlgeschlagen.");
        return;
      }
      onChange(data.publicPath);
      if (data.warning) setWarning(data.warning);
    } catch {
      setError("Verbindung zum Server fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
          {value ? (
            <Image src={value} alt="" width={80} height={80} className="h-full w-full object-cover" unoptimized />
          ) : (
            <span className="text-[10px] text-muted">Kein Bild</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent disabled:opacity-60"
          >
            {uploading ? "Lädt hoch…" : "Bild hochladen"}
          </button>
          {value && (
            <input
              type="text"
              aria-label="Bildpfad"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted outline-none focus:border-accent"
            />
          )}
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-400">{error}</p>}
      {warning && <p className="mt-2 text-xs text-amber-400">{warning}</p>}
    </div>
  );
}
