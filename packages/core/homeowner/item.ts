export * as Item from "./item";
import { ItemCategory, ItemStatus, item } from "../db/schema";
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
  const [itemObj] = await db.select().from(item).where(eq(item.id, id));
  return itemObj;
}

export async function update({
  id,
  title,
  description,
}: {
  id: string;
  title?: string;
  description?: string;
}) {
  await db.update(item).set({ title, description }).where(eq(item.id, id));
}
