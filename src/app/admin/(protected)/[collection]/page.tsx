import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/cms/collections";
import { listItems } from "@/lib/cms/content";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function CollectionListPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionName } = await params;
  const collection = getCollection(collectionName);
  if (!collection) notFound();

  const items = await listItems(collectionName);
  const titleField = collection.fields.find((f) => f.isTitle);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{collection.label}</h1>
          <p className="text-sm text-muted">{items.length} Einträge</p>
        </div>
        <Link
          href={`/admin/${collectionName}/new`}
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-105"
        >
          + Neuer Eintrag
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Noch keine Einträge vorhanden.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Titel</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.slug} className="bg-surface">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {titleField ? String(item.data[titleField.name] ?? item.slug) : item.slug}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/${collectionName}/${item.slug}`}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-accent-text transition-colors hover:bg-accent/10"
                      >
                        Bearbeiten
                      </Link>
                      <DeleteButton
                        collection={collectionName}
                        slug={item.slug}
                        label={titleField ? String(item.data[titleField.name] ?? item.slug) : item.slug}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
