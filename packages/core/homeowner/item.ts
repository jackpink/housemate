export * as Item from "./item";
import { ItemCategory, ItemStatus, item, itemFile } from "../db/schema";
import { db } from "../db";
import { eq, InferSelectModel, and, asc, desc } from "drizzle-orm";

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
  priority,
}: {
  id: string;
  title?: string;
  description?: string;
  recurring?: boolean;
  date?: string;
  priority?: number;
}) {
  await db
    .update(item)
    .set({ title, description, recurring, date, toDoPriority: priority })
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

export async function getToDos(homeownerId: string) {
  console.log("First recalibrate");
  await recalibratePriority(homeownerId);
  console.log("now query");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, homeownerId), eq(item.status, ItemStatus.TODO)),

    with: { files: true },
    orderBy: [desc(item.toDoPriority)],
  });
  console.log("items", items);
  return items;
}

async function recalibratePriority(homeownerId: string) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, homeownerId), eq(item.status, ItemStatus.TODO)),
    orderBy: [asc(item.toDoPriority)],
  });
  for (let index = 0; index < items.length; index++) {
    console.log(
      "index priority and item title",
      index,
      items[index]?.toDoPriority,
      items[index]!.title,
    );
    await db
      .update(item)
      .set({ toDoPriority: index * 2 })
      .where(eq(item.id, items[index]!.id));
  }
}

export type ToDos = Awaited<ReturnType<typeof getToDos>>;
