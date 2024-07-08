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

export async function update({
  id,
  recurring,
}: {
  id: string;
  recurring: boolean;
}) {
  // TODO
  const itemObj = await Item.get(id);
  if (recurring && itemObj.status === ItemStatus.COMPLETED) {
    createNewPastDateAndUpdateCurrentDate({
      itemId: id,
      date: itemObj.date,
      propertyId: itemObj.propertyId,
      recurringSchedule: itemObj.recurringSchedule as RecurringSchedule,
    });
  }
  console.log("updating recurring", recurring, id);
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
  if (status === ItemStatus.COMPLETED) {
    const itemObj = await Item.get(id);
    console.log("we are marking status as completed");
    if (itemObj.recurring) {
      await createNewPastDateAndUpdateCurrentDate({
        itemId: id,
        date: itemObj.date,
        propertyId: itemObj.propertyId,
        recurringSchedule: itemObj.recurringSchedule as RecurringSchedule,
      });
    } else {
      await db.update(item).set({ status }).where(eq(item.id, id));
    }
  } else {
    await db.update(item).set({ status }).where(eq(item.id, id));
  }
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
  console.log("creating new past date");
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

  console.log("changing new date to", dateString, itemId);
  await db
    .update(item)
    .set({ date: dateString, status: ItemStatus.TODO })
    .where(eq(item.id, itemId));
}
