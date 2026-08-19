import { notFound } from "next/navigation";
import { getCollection } from "@/lib/cms/collections";
import { listItems } from "@/lib/cms/content";
import CollectionExplorer from "@/components/admin/CollectionExplorer";

export default async function CollectionListPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionName } = await params;
  const collection = getCollection(collectionName);
  if (!collection) notFound();

  const items = await listItems(collectionName);

  return <CollectionExplorer key={collectionName} collectionName={collectionName} collection={collection} initialItems={items} />;
}
