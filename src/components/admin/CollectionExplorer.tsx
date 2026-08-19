"use client";

import { useMemo, useState } from "react";
import type { CollectionDef } from "@/lib/cms/collections";
import ContentForm from "@/components/admin/ContentForm";
import EditorPanel from "@/components/admin/EditorPanel";

interface Item {
  slug: string;
  data: Record<string, unknown>;
  body: string;
}

type PanelState = { mode: "create" } | { mode: "edit"; slug: string } | null;

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

  const titleField = collection.fields.find((f) => f.isTitle);

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
          onClick={() => setPanel({ mode: "create" })}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105"
        >
          + Neuer Eintrag
        </button>
      </div>

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
          <button
            key={item.slug}
            type="button"
            onClick={() => setPanel({ mode: "edit", slug: item.slug })}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-accent"
          >
            <span>
              <span className="block font-medium text-foreground">{itemTitle(item)}</span>
              <span className="block text-xs text-muted">{item.slug}</span>
            </span>
            <span className="text-xs text-accent-text">Bearbeiten →</span>
          </button>
        ))}
      </div>

      {panel && (
        <EditorPanel
          title={panel.mode === "create" ? `Neuer Eintrag: ${collection.label}` : `${collection.label} bearbeiten`}
          onClose={closePanel}
        >
          {panel.mode === "create" ? (
            <ContentForm
              collectionName={collectionName}
              collection={collection}
              mode="create"
              onSaved={() => {
                closePanel();
                refresh();
              }}
            />
          ) : (
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
                  onSaved={() => {
                    closePanel();
                    refresh();
                  }}
                  onDeleted={() => {
                    closePanel();
                    refresh();
                  }}
                />
              );
            })()
          )}
        </EditorPanel>
      )}
    </div>
  );
}
