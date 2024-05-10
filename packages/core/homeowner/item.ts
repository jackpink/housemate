export * as Item from "./item";
import { ItemCategory, ItemStatus, item, itemFile } from "../db/schema";
import { db } from "../db";
import { eq, InferSelectModel } from "drizzle-orm";

export async function create({
  title,
  status,
  category,
  homeownerId,
  propertyId,
}: {
  title: string;
  status: ItemStatus;
  category: ItemCategory;
  homeownerId: string;
  propertyId: string;
}) {
  const [created] = await db
    .insert(item)
    .values({ title, status, category, homeownerId, propertyId })
    .returning({ id: item.id });

  if (!created) throw new Error("Failed to create item");
  return created.id;
}

export async function get(id: string) {
  const result = await db.query.item.findFirst({
    where: eq(item.id, id),
    with: { files: true },
  });
  if (!result) throw new Error("Item not found");
  return result;
}

export type ItemWithFiles = Awaited<ReturnType<typeof get>>;

export async function update({
  id,
  title,
  description,
  recurring,
  date,
}: {
  id: string;
  title?: string;
  description?: string;
  recurring?: boolean;
  date?: string;
}) {
  await db
    .update(item)
    .set({ title, description, recurring, date })
    .where(eq(item.id, id));
}

export async function addFile({
  itemId,
  name,
  key,
  bucket,
  type,
}: {
  itemId: string;
  name: string;
  key: string;
  bucket: string;
  type: string;
}) {
  await db
    .insert(itemFile)
    .values({ itemId, name, key, bucket, type })
    .returning({ id: itemFile.id });
}
