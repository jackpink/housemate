export * as Todos from "./todos";
import { ItemCategory, ItemStatus, item } from "../../db/schema";
import { db } from "../../db";
import { eq, and, asc, desc, or, type InferSelectModel } from "drizzle-orm";
import { Item } from "./item";

export async function getAll({ propertyId }: { propertyId: string }) {
  console.log("First recalibrate");
  await recalibratePriority({ propertyId });
  // console.log("now query");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.propertyId, propertyId), eq(item.status, ItemStatus.TODO)),

    with: {
      filesRootFolder: {
        with: { files: true },
      },
      pastDates: true,
    },
    orderBy: [desc(item.toDoPriority)],
  });
  // console.log("items", items);
  return items;
}

export async function getAllCompleted(propertyId: string, range: number = 7) {
  const items = await db.query.item.findMany({
    where: (item, {}) =>
      and(
        eq(item.propertyId, propertyId),
        or(
          eq(item.category, ItemCategory.JOB),
          eq(item.category, ItemCategory.ISSUE),
        ),
      ),
    with: {
      filesRootFolder: {
        with: { files: true },
      },
      pastDates: true,
    },
  });
  const todaysDate = new Date();
  const filteredItems = items.filter((item) => {
    const toDoDate = new Date(item.date);
    const timeDiff = Math.abs(toDoDate.getTime() - todaysDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays < range && item.status === ItemStatus.COMPLETED) {
      // console.log("item is completed and within 7 days", item);
      return true;
    }
    return false;
  });

  const today = new Date();
  const WeekAgo = new Date();
  WeekAgo.setDate(today.getDate() - range);

  const pastDates = await getItemPastDatesInDateRange({
    propertyId,
    startDate: `${WeekAgo.getFullYear()}-${WeekAgo.getMonth() < 9 ? "0" : ""}${WeekAgo.getMonth() + 1}-${WeekAgo.getDate() < 10 ? "0" : ""}${WeekAgo.getDate()}`,
    endDate: `${today.getFullYear()}-${today.getMonth() < 9 ? "0" : ""}${today.getMonth() + 1}-${today.getDate() < 10 ? "0" : ""}${today.getDate()}`,
  });

  const allItems = [...filteredItems, ...pastDates];

  return allItems;
}

async function recalibratePriority({ propertyId }: { propertyId: string }) {
  console.log("recalibrating...");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.propertyId, propertyId), eq(item.status, ItemStatus.TODO)),
    orderBy: [asc(item.toDoPriority), desc(item.date)],
  });
  console.log();
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

export type ToDos = Awaited<ReturnType<typeof getAll>>;

export async function getForUserAndDate(userId: string, taskDate: string) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, userId), eq(item.date, taskDate)),
  });
  return items;
}

export async function getItemPastDatesInDateRange({
  propertyId,
  startDate,
  endDate,
}: {
  propertyId: string;
  startDate: string;
  endDate: string;
}) {
  const itemPastDates = await db.query.itemPastDate.findMany({
    where: (itemPastDate, { eq, and }) =>
      eq(itemPastDate.propertyId, propertyId),
  });
  // console.log("itemPastDates", itemPastDates);
  const filteredItemPastDates = itemPastDates.filter((itemPastDate) => {
    // console.log(
    //   "start and end date",
    //   startDate,
    //   endDate,
    //   itemPastDate.date,
    //   itemPastDate.date >= startDate,
    //   itemPastDate.date <= endDate,
    // );
    return itemPastDate.date >= startDate && itemPastDate.date <= endDate;
  });
  // console.log("filteredItemPastDates", filteredItemPastDates);
  let items = [];
  for (const itemPastDateObj of filteredItemPastDates) {
    const item = await db.query.item.findFirst({
      where: (item, { eq }) => eq(item.id, itemPastDateObj.itemId),
      with: {
        filesRootFolder: {
          with: { files: true },
        },
        pastDates: true,
      },
    });

    if (item) {
      item.date = itemPastDateObj.date;
      item.status = ItemStatus.COMPLETED;
      items.push(item);
    }
  }
  return items;
}
