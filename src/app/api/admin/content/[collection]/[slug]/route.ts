import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/cms/collections";
import { getItem, saveItem, deleteItem } from "@/lib/cms/content";
import { getSessionUser } from "@/lib/cms/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  const item = await getItem(collectionName, slug);
  if (!item) return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
  return NextResponse.json({ collection, item });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  let body: { data?: Record<string, unknown>; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const result = await saveItem(collectionName, slug, body.data ?? {}, body.body ?? "", user.username);
  return NextResponse.json(result);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; slug: string }> }
) {
  const { collection: collectionName, slug } = await params;
  const collection = getCollection(collectionName);
  if (!collection) return NextResponse.json({ error: "Unbekannte Collection." }, { status: 404 });

  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const result = await deleteItem(collectionName, slug, user.username);
  return NextResponse.json(result);
}
