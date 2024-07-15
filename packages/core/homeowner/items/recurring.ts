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

export async function getAll({ propertyId }: { propertyId: string }) {
  // console.log("now query");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.propertyId, propertyId), eq(item.recurring, true)),

    with: {
      filesRootFolder: {
        with: { files: true },
      },
      pastDates: true,
    },
    orderBy: [desc(item.date)],
  });
  // console.log("items", items);
  return items;
}

export async function update({
  id,
  recurring,
}: {
  id: string;
  recurring: boolean;
}) {
  // TODO
  const itemObj = await Item.get(id);
  if (recurring && !!itemObj && itemObj.status === ItemStatus.COMPLETED) {
    createNewPastDateAndUpdateCurrentDate({
      itemId: id,
      date: itemObj.date,
      propertyId: itemObj.propertyId,
      recurringSchedule: itemObj.recurringSchedule as RecurringSchedule,
    });
  }
  // console.log("updating recurring", recurring, id);
  await db.update(item).set({ recurring }).where(eq(item.id, id));
}

export async function updateStatus({
  id,
  status,
}: {
  id: string;
  status: ItemStatus;
}) {
  // if marking as completed + is recurring, create new past date and update current date
  // if marking as completed + is not recurring, just mark as completed
  // if marking as todo, mark as todo
  // if marking as todo + is recurring, mark as todo
  const currentDate = new Date().toISOString().split("T")[0]!;
  if (status === ItemStatus.COMPLETED) {
    const itemObj = await Item.get(id);
    // console.log("we are marking status as completed");
    const currentDate = new Date().toISOString().split("T")[0]!;

    if (!!itemObj && itemObj.recurring) {
      // marking as completed + is recurring
      await createNewPastDate({
        itemId: id,
        date: currentDate,
        propertyId: itemObj.propertyId,
      });
      const futureDate = getNewRecurringDate({
        recurringSchedule: itemObj.recurringSchedule as RecurringSchedule,
      });
      console.log("about to update todo priority", id);
      await db
        .update(item)
        .set({ date: futureDate, toDoPriority: -1 })
        .where(eq(item.id, id));

      const itemObj2 = await Item.get(id);
      console.log("itemObj2", itemObj2);
    } else {
      // marking as completed + is not recurring
      await db
        .update(item)
        .set({ status, date: currentDate })
        .where(eq(item.id, id));
    }
  } else {
    // marking as todo
    await db.update(item).set({ status }).where(eq(item.id, id));
  }
}

async function createNewPastDate({
  itemId,
  date,
  propertyId,
}: {
  itemId: string;
  date: string;
  propertyId: string;
}) {
  await db.insert(itemPastDate).values({ itemId, date, propertyId });
}

function getNewRecurringDate({
  recurringSchedule,
}: {
  recurringSchedule: RecurringSchedule;
}) {
  let newDate = new Date();
  if (recurringSchedule === RecurringSchedule.WEEKLY) {
    newDate.setDate(newDate.getDate() + 7);
  } else if (recurringSchedule === RecurringSchedule.FORTNIGHTLY) {
    newDate.setDate(newDate.getDate() + 14);
  } else if (recurringSchedule === RecurringSchedule.MONTHLY) {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (recurringSchedule === RecurringSchedule.QUARTERLY) {
    newDate.setMonth(newDate.getMonth() + 3);
  } else if (recurringSchedule === RecurringSchedule.HALF_YEARLY) {
    newDate.setMonth(newDate.getMonth() + 6);
  } else if (recurringSchedule === RecurringSchedule.YEARLY) {
    newDate.setFullYear(newDate.getFullYear() + 1);
  } else {
    throw new Error("Recurring schedule not found");
  }
  return newDate.toISOString().split("T")[0]!;
}

async function createNewPastDateAndUpdateCurrentDate({
  itemId,
  date,
  propertyId,
  recurringSchedule,
}: {
  itemId: string;
  date: string;
  propertyId: string;
  recurringSchedule: RecurringSchedule;
}) {
  // console.log("creating new past date");
  await db.insert(itemPastDate).values({ itemId, date, propertyId });

  let newDate = new Date(date);

  if (recurringSchedule === RecurringSchedule.WEEKLY) {
    newDate.setDate(newDate.getDate() + 7);
  } else if (recurringSchedule === RecurringSchedule.FORTNIGHTLY) {
    newDate.setDate(newDate.getDate() + 14);
  } else if (recurringSchedule === RecurringSchedule.MONTHLY) {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (recurringSchedule === RecurringSchedule.QUARTERLY) {
    newDate.setMonth(newDate.getMonth() + 3);
  } else if (recurringSchedule === RecurringSchedule.HALF_YEARLY) {
    newDate.setMonth(newDate.getMonth() + 6);
  } else if (recurringSchedule === RecurringSchedule.YEARLY) {
    newDate.setFullYear(newDate.getFullYear() + 1);
  } else {
    throw new Error("Recurring schedule not found");
  }
  const dateString = `${newDate.getFullYear()}-${newDate.getMonth() < 9 ? "0" : ""}${newDate.getMonth() + 1}-${newDate.getDate() < 10 ? "0" : ""}${newDate.getDate()}`;

  // console.log("changing new date to", dateString, itemId);
  await db
    .update(item)
    .set({ date: dateString, status: ItemStatus.TODO })
    .where(eq(item.id, itemId));
}
