import { notFound } from "next/navigation";
import { getCollection } from "@/lib/cms/collections";
import ContentForm from "@/components/admin/ContentForm";

export default async function NewContentPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionName } = await params;
  const collection = getCollection(collectionName);
  if (!collection) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">Neuer Eintrag: {collection.label}</h1>
      <ContentForm collectionName={collectionName} collection={collection} mode="create" />
    </div>
  );
}
