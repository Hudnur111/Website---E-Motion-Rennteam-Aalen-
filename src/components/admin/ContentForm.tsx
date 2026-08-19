"use client";

import { useEffect, useRef, useState } from "react";
import type { CollectionDef, FieldDef } from "@/lib/cms/collections";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextField from "@/components/admin/RichTextField";

interface SaveResult {
  slug: string;
  committedToGithub: boolean;
  commitUrl: string | null;
  warning?: string;
}

interface Props {
  collectionName: string;
  collection: CollectionDef;
  mode: "create" | "edit";
  initialSlug?: string;
  initialData?: Record<string, unknown>;
  initialBody?: string;
  onSaved: (result: SaveResult) => void;
  onDeleted?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

type FieldValue = string | number | boolean | { label: string; value: string }[] | undefined;

// Every collection has at most one `richText` field, and — regardless of the
// `isBody` flag, which is only used for `isBody: true` at the schema level —
// existing content always stores that field's value as the markdown body,
// not as frontmatter. So the richText field is always the body field.
function fieldsWithoutBody(collection: CollectionDef): FieldDef[] {
  return collection.fields.filter((f) => f.type !== "richText");
}

function bodyField(collection: CollectionDef): FieldDef | undefined {
  return collection.fields.find((f) => f.type === "richText");
}

// Existing content stores full ISO timestamps (e.g. "2025-08-10T09:00:00.000Z");
// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in the browser's local
// time. Converting through Date preserves the time-of-day on edit instead of
// silently truncating it to midnight, which a plain <input type="date"> would.
function toDatetimeLocalValue(value: FieldValue): string {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ContentForm({
  collectionName,
  collection,
  mode,
  initialSlug,
  initialData,
  initialBody,
  onSaved,
  onDeleted,
  onDirtyChange,
}: Props) {
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [data, setData] = useState<Record<string, FieldValue>>(() => (initialData as Record<string, FieldValue>) ?? {});
  const [body, setBody] = useState(initialBody ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  // The `saving` state disables the submit button, but that disabling only
  // takes effect on React's next render — two clicks dispatched in the same
  // event-loop tick (a fast real double-click, or any script that fires two
  // click events back to back) both run handleSubmit before that render
  // happens, which used to fire two POST requests and create two entries.
  // A plain ref is set synchronously, so the second call sees it immediately.
  const submittingRef = useRef(false);

  const bField = bodyField(collection);

  // Lets the parent (EditorPanel via CollectionExplorer) confirm before
  // discarding an editor's in-progress work when they close the panel
  // without saving — compares against a snapshot taken once on mount, not
  // on every initial* prop change, so it stays stable across re-renders.
  const initialSnapshot = useRef(JSON.stringify({ slug: initialSlug ?? "", data: initialData ?? {}, body: initialBody ?? "" }));
  useEffect(() => {
    const dirty = JSON.stringify({ slug, data, body }) !== initialSnapshot.current;
    onDirtyChange?.(dirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, data, body]);

  function setField(name: string, value: FieldValue) {
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function findMissingRequiredImageField(): FieldDef | undefined {
    // Native HTML `required` validation only covers <input>/<select>/
    // <textarea>; the image field is a custom upload widget with no such
    // element when empty, so the browser would happily submit it blank.
    return fieldsWithoutBody(collection).find((f) => f.type === "image" && f.required && !data[f.name]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    const missingImage = findMissingRequiredImageField();
    if (missingImage) {
      setResult({ ok: false, message: `${missingImage.label} ist erforderlich – bitte ein Bild hochladen.` });
      return;
    }
    submittingRef.current = true;
    setSaving(true);
    setResult(null);
    try {
      const payload = { slug, data, body: bField ? body : undefined };
      const url = mode === "create" ? `/api/admin/content/${collectionName}` : `/api/admin/content/${collectionName}/${initialSlug}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: responseData.error || "Speichern fehlgeschlagen." });
        return;
      }
      setResult({
        ok: true,
        message: responseData.committedToGithub
          ? "Gespeichert und als Commit auf GitHub gesichert."
          : responseData.warning || "Gespeichert.",
      });
      onSaved({
        slug: mode === "create" ? responseData.slug : (initialSlug ?? slug),
        committedToGithub: responseData.committedToGithub,
        commitUrl: responseData.commitUrl ?? null,
        warning: responseData.warning,
      });
    } catch {
      setResult({ ok: false, message: "Verbindung zum Server fehlgeschlagen." });
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialSlug) return;
    if (!confirm(`Diesen Eintrag wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/content/${collectionName}/${initialSlug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setResult({ ok: false, message: data.error || "Löschen fehlgeschlagen." });
        return;
      }
      onDeleted?.();
    } catch {
      setResult({ ok: false, message: "Verbindung zum Server fehlgeschlagen." });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "create" && (
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-foreground">
            URL-Slug <span className="text-muted">(optional, wird sonst automatisch erzeugt)</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
            placeholder="mein-eintrag"
          />
        </div>
      )}

      {fieldsWithoutBody(collection).map((field) => (
        <FieldEditor key={field.name} field={field} value={data[field.name]} onChange={(v) => setField(field.name, v)} />
      ))}

      {bField && (
        <div>
          <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-foreground">
            {bField.label}
          </label>
          <RichTextField id="body" value={body} onChange={setBody} rows={12} />
        </div>
      )}

      {result && (
        <p
          role="status"
          className={`rounded-lg border px-3.5 py-2.5 text-sm ${
            result.ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {result.message}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={saving || deleting}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? "Speichert…" : "Speichern"}
        </button>
        {mode === "edit" && onDeleted && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Löscht…" : "Löschen"}
          </button>
        )}
      </div>
    </form>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: FieldValue; onChange: (v: FieldValue) => void }) {
  switch (field.type) {
    case "string":
      return (
        <TextField field={field}>
          <input
            id={field.name}
            type="text"
            required={field.required}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </TextField>
      );
    case "text":
      return (
        <TextField field={field}>
          <textarea
            id={field.name}
            required={field.required}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </TextField>
      );
    case "number":
      return (
        <TextField field={field}>
          <input
            id={field.name}
            type="number"
            required={field.required}
            value={(value as number) ?? ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
            className="w-full max-w-[10rem] rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </TextField>
      );
    case "boolean":
      return (
        <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          {field.label}
        </label>
      );
    case "datetime":
      return (
        <TextField field={field}>
          <input
            id={field.name}
            type="datetime-local"
            required={field.required}
            value={toDatetimeLocalValue(value)}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            className="w-full max-w-[16rem] rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </TextField>
      );
    case "select":
      return (
        <TextField field={field}>
          <select
            id={field.name}
            required={field.required}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="">Bitte wählen…</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </TextField>
      );
    case "image":
      return (
        <TextField field={field}>
          <ImageUploadField value={(value as string) ?? ""} onChange={(v) => onChange(v)} />
        </TextField>
      );
    case "objectList":
      return <ObjectListField field={field} value={(value as { label: string; value: string }[]) ?? []} onChange={onChange} />;
    default:
      return null;
  }
}

function TextField({ field, children }: { field: FieldDef; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-red-400"> *</span>}
      </label>
      {children}
    </div>
  );
}

function ObjectListField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
}) {
  function updateRow(index: number, key: "label" | "value", val: string) {
    const next = value.map((row, i) => (i === index ? { ...row, [key]: val } : row));
    onChange(next);
  }

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-foreground">{field.label}</p>
      <div className="space-y-2">
        {value.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={row.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
              placeholder="Bezeichnung"
              className="w-1/3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <input
              type="text"
              value={row.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              placeholder="Wert"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="rounded-md px-2.5 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, { label: "", value: "" }])}
        className="mt-2 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        + Zeile hinzufügen
      </button>
    </div>
  );
}
