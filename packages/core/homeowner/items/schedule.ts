export * as Recurring from "./recurring";
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
import { Item } from "./item";
import { Todos } from "./todos";

export async function getSchedule({
  propertyId,
  currentDate,
  pastMonths,
  futureMonths,
}: {
  propertyId: string;
  currentDate: Date;
  pastMonths: number;
  futureMonths: number;
}) {
  const items = await db.query.item.findMany({
    where: eq(item.propertyId, propertyId),
    with: {
      filesRootFolder: {
        with: { files: true },
      },
      pastDates: true,
    },
  });
  const endDate = new Date(currentDate);
  //curretnDate plus 6 months
  endDate.setMonth(currentDate.getMonth() + futureMonths);

  const startDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - pastMonths),
  );
  // console.log("start and end date", startDate, endDate);

  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  const itemPastDates = await Todos.getItemPastDatesInDateRange({
    propertyId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const allItems = [...filteredItems, ...itemPastDates];

  allItems.sort(dateOrdering);

  return allItems;
}

export type ScheduledItems = Awaited<ReturnType<typeof getSchedule>>;

function dateOrdering(a: ScheduledItems[number], b: ScheduledItems[number]) {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateA.getTime() - dateB.getTime();
}
