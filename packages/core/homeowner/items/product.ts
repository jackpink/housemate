export * as Product from "./product";
import {
  ItemCategory,
  ItemStatus,
  RecurringSchedule,
  item,
  itemFile,
  itemFilesFolder,
  itemPastDate,
} from "../../db/schema";
import { db } from "../../db";
import { eq, and, asc, desc, or, type InferSelectModel } from "drizzle-orm";

export async function getAll(homeownerId: string, warrantyEndDate: string) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(
        eq(item.homeownerId, homeownerId),
        eq(item.warrantyEndDate, warrantyEndDate),
      ),
  });
  return items;
}

export type Items = Awaited<ReturnType<typeof getAll>>;
