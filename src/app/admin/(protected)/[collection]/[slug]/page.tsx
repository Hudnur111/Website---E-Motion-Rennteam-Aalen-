import { notFound } from "next/navigation";
import { getCollection } from "@/lib/cms/collections";
import { getItem } from "@/lib/cms/content";
import ContentForm from "@/components/admin/ContentForm";

export default async function EditContentPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) notFound();

  const item = await getItem(collectionName, slug);
  if (!item) notFound();

  const titleField = collection.fields.find((f) => f.isTitle);
  const title = titleField ? String(item.data[titleField.name] ?? slug) : slug;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">
        {collection.label}: {title}
      </h1>
      <ContentForm
        collectionName={collectionName}
        collection={collection}
        mode="edit"
        initialSlug={slug}
        initialData={item.data}
        initialBody={item.body}
      />
    </div>
  );
}
