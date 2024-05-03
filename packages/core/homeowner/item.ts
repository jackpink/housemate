export * as Item from "./item";
import { ItemCategory, ItemStatus, itemyy } from "../db/schema";
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
    .insert(itemyy)
    .values({ title, status, category, homeownerId, propertyId })
    .returning({ id: itemyy.id });

  if (!created) throw new Error("Failed to create item");
  return created.id;
}

export function get(id: string) {
  return db.select().from(itemyy).where(eq(itemyy.id, id));
}
