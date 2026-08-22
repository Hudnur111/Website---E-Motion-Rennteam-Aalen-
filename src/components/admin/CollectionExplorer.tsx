"use client";

import { useEffect, useMemo, useState } from "react";
import type { CollectionDef } from "@/lib/cms/collections";
import ContentForm from "@/components/admin/ContentForm";
import EditorPanel from "@/components/admin/EditorPanel";

interface Item {
  slug: string;
  data: Record<string, unknown>;
  body: string;
}

interface WriteResult {
  committedToGithub: boolean;
  warning?: string;
}

type PanelState =
  | { mode: "create" }
  | { mode: "create-prefilled"; sourceSlug: string; data: Record<string, unknown>; body: string }
  | { mode: "edit"; slug: string }
  | null;

// The panel closes as soon as a save/delete succeeds (see closePanel() in
// onSaved/onDeleted below), which unmounts ContentForm's own success/warning
// message in the same tick it appears — a real editor could never actually
// read it, most importantly the warning that a change was only saved
// locally and NOT committed to GitHub. Recording it here, outside the
// panel, keeps it on screen after the panel is gone.
function noticeForWriteResult(result: WriteResult, verb: "gespeichert" | "gelöscht"): { kind: "ok" | "warning"; message: string } {
  if (result.committedToGithub) {
    return { kind: "ok", message: `Erfolgreich ${verb} und als Commit auf GitHub gesichert.` };
  }
  return { kind: "warning", message: result.warning || `Erfolgreich ${verb}.` };
}

export default function CollectionExplorer({
  collectionName,
  collection,
  initialItems,
}: {
  collectionName: string;
  collection: CollectionDef;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<PanelState>(null);
  const [panelDirty, setPanelDirty] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "warning"; message: string } | null>(null);

  const titleField = collection.fields.find((f) => f.isTitle);

  // The in-panel confirm() below only covers navigation this component can
  // intercept (Escape, the × button, a backdrop click). It can't run for a
  // browser back button, tab close, or manual refresh — those unmount the
  // page before any JS handler gets a chance to ask, silently discarding
  // whatever the editor typed. beforeunload is the one hook the platform
  // gives us for that case; only registered while there's something to lose.
  useEffect(() => {
    if (!panelDirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [panelDirty]);

  // Re-fetches the list after a save/create/delete inside the panel so it
  // reflects the change without a full page reload. Never called from an
  // effect (only from these user-triggered callbacks), so there's no
  // synchronous-setState-in-effect concern here.
  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/content/${collectionName}`);
      const responseData = await res.json();
      if (!res.ok) {
        setLoadError(responseData.error || "Laden fehlgeschlagen.");
        return;
      }
      setItems(responseData.items);
      setLoadError("");
    } catch {
      setLoadError("Verbindung zum Server fehlgeschlagen.");
    } finally {
      setRefreshing(false);
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      const title = titleField ? String(item.data[titleField.name] ?? "") : "";
      return title.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query);
    });
  }, [items, search, titleField]);

  function itemTitle(item: Item): string {
    return titleField ? String(item.data[titleField.name] ?? item.slug) : item.slug;
  }

  function closePanel() {
    setPanel(null);
    setPanelDirty(false);
  }

  // Used for every user-initiated close (backdrop click, Escape, the × button)
  // so an editor can't lose in-progress work with one stray click. Saves and
  // deletes call closePanel() directly since the change is already persisted.
  function requestClosePanel() {
    if (panelDirty && !window.confirm("Ungespeicherte Änderungen verwerfen?")) return;
    closePanel();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{collection.label}</h1>
          <p className="text-sm text-muted">{refreshing ? "Aktualisiert…" : `${items.length} Einträge`}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNotice(null);
            setPanel({ mode: "create" });
          }}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105"
        >
          + Neuer Eintrag
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className={`mb-4 rounded-lg border px-3.5 py-2.5 text-sm ${
            notice.kind === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          }`}
        >
          {notice.message}
        </p>
      )}

      {items.length >= 6 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Einträge durchsuchen…"
          aria-label="Einträge durchsuchen"
          className="mb-4 w-full max-w-sm rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      )}

      {loadError && (
        <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {loadError}
        </p>
      )}

      {!refreshing && filteredItems.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          {items.length === 0 ? "Noch keine Einträge vorhanden." : "Keine Einträge gefunden."}
        </p>
      )}

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.slug}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-accent"
          >
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setPanel({ mode: "edit", slug: item.slug });
              }}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block break-words font-medium text-foreground">{itemTitle(item)}</span>
              <span className="block break-words text-xs text-muted">{item.slug}</span>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                title="Duplizieren"
                onClick={() => {
                  setNotice(null);
                  setPanel({ mode: "create-prefilled", sourceSlug: item.slug, data: item.data, body: item.body });
                }}
                className="rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                Kopieren
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotice(null);
                  setPanel({ mode: "edit", slug: item.slug });
                }}
                className="text-xs text-accent-text"
              >
                Bearbeiten →
              </button>
            </div>
          </div>
        ))}
      </div>

      {panel && (
        <EditorPanel
          title={
            panel.mode === "create"
              ? `Neuer Eintrag: ${collection.label}`
              : panel.mode === "create-prefilled"
              ? `Kopie erstellen: ${collection.label}`
              : `${collection.label} bearbeiten`
          }
          onClose={requestClosePanel}
        >
          {panel.mode === "create" && (
            <ContentForm
              collectionName={collectionName}
              collection={collection}
              mode="create"
              onDirtyChange={setPanelDirty}
              onSaved={(result) => {
                setNotice(noticeForWriteResult(result, "gespeichert"));
                closePanel();
                refresh();
              }}
            />
          )}
          {panel.mode === "create-prefilled" && (
            <ContentForm
              collectionName={collectionName}
              collection={collection}
              mode="create"
              initialData={panel.data}
              initialBody={panel.body}
              onDirtyChange={setPanelDirty}
              onSaved={(result) => {
                setNotice(noticeForWriteResult(result, "gespeichert"));
                closePanel();
                refresh();
              }}
            />
          )}
          {panel.mode === "edit" &&
            (() => {
              const item = items.find((i) => i.slug === panel.slug);
              if (!item) return <p className="text-sm text-muted">Eintrag nicht gefunden.</p>;
              return (
                <ContentForm
                  collectionName={collectionName}
                  collection={collection}
                  mode="edit"
                  initialSlug={item.slug}
                  initialData={item.data}
                  initialBody={item.body}
                  onDirtyChange={setPanelDirty}
                  onSaved={(result) => {
                    setNotice(noticeForWriteResult(result, "gespeichert"));
                    closePanel();
                    refresh();
                  }}
                  onDeleted={(result) => {
                    setNotice(noticeForWriteResult(result, "gelöscht"));
                    closePanel();
                    refresh();
                  }}
                />
              );
            })()}
        </EditorPanel>
      )}
    </div>
  );
}
