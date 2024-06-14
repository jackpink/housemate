export * as Item from "./item";
import {
  ItemCategory,
  ItemStatus,
  RecurringSchedule,
  item,
  itemFile,
  itemFilesFolder,
  itemPastDate,
} from "../db/schema";
import { db } from "../db";
import { eq, and, asc, desc, or, type InferSelectModel } from "drizzle-orm";

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
  const itemId = await db.transaction(async (tx) => {
    const [folderCreated] = await tx
      .insert(itemFilesFolder)
      .values({ name: "root" })
      .returning({ id: itemFilesFolder.id });

    if (!folderCreated) throw new Error("Failed to create folder for item");

    const [itemCreated] = await tx
      .insert(item)
      .values({
        title,
        status,
        category,
        homeownerId,
        propertyId,
        filesRootFolderId: folderCreated.id,
      })
      .returning({ id: item.id });

    if (!itemCreated) throw new Error("Failed to create item");

    await tx
      .update(itemFilesFolder)
      .set({ itemId: itemCreated.id })
      .where(eq(itemFilesFolder.id, folderCreated.id));

    return itemCreated.id;
  });

  return itemId;
}

export async function get(id: string) {
  const result = await db.query.item.findFirst({
    where: eq(item.id, id),
    with: {
      filesRootFolder: {
        with: {
          files: true,
          folders: {
            with: {
              files: true,
            },
          },
        },
      },
      pastDates: true,
    },
  });
  if (!result) throw new Error("Item not found");
  return result;
}

export type ItemWithFiles = Awaited<ReturnType<typeof get>>;

//export type FilesFolder = ItemWithFiles["filesRootFolder"].

export type File = InferSelectModel<typeof itemFile>;

export type Files = File[];

export type RootFolder = Awaited<ReturnType<typeof getFilesRootFolder>>;

export type Folder = Awaited<ReturnType<typeof getFilesFolder>>;

export async function getFilesFolder(id: string) {
  const result = await db.query.itemFilesFolder.findFirst({
    where: eq(itemFilesFolder.itemId, id),
    with: {
      files: true,
    },
  });
  if (!result) throw new Error("Folder not found");
  return result;
}

export async function getFilesRootFolder(id: string) {
  const result = await db.query.itemFilesFolder.findFirst({
    where: eq(itemFilesFolder.itemId, id),
    with: {
      files: true,
      folders: {
        with: {
          files: true,
        },
      },
    },
  });
  if (!result) throw new Error("Folder not found");
  return result;
}

export async function update({
  id,
  title,
  description,
  recurring,
  recurringSchedule,
  date,
  priority,
  status,
  warrantyEndDate,
}: {
  id: string;
  title?: string;
  description?: string;
  recurring?: boolean;
  recurringSchedule?: string;
  date?: string;
  priority?: number;
  status?: ItemStatus;
  warrantyEndDate?: string;
}) {
  if (recurring !== undefined) {
    console.log("updating recurring", recurring);
    await updateRecurring({ id, recurring });
  }
  if (!!status) {
    console.log("updating status", status);
    await updateStatus({ id, status });
  }
  if (
    !!priority ||
    !!title ||
    !!description ||
    !!recurringSchedule ||
    !!date ||
    !!warrantyEndDate
  ) {
    await db
      .update(item)
      .set({
        title,
        description,
        recurringSchedule,
        date,
        toDoPriority: priority,
        warrantyEndDate,
      })
      .where(eq(item.id, id));
  }
}

async function updateRecurring({
  id,
  recurring,
}: {
  id: string;
  recurring: boolean;
}) {
  // TODO
  const itemObj = await get(id);
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
    const itemObj = await get(id);
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

export async function addFile({
  folderId,
  name,
  key,
  bucket,
  type,
}: {
  folderId: string;
  name: string;
  key: string;
  bucket: string;
  type: string;
}) {
  await db
    .insert(itemFile)
    .values({ folderId, name, key, bucket, type })
    .returning({ id: itemFile.id });
}

export async function updateFile({
  id,
  name,
  folderId,
}: {
  id: string;
  name?: string;
  folderId?: string;
}) {
  await db.update(itemFile).set({ name, folderId }).where(eq(itemFile.id, id));
}

export async function addFolder({
  parentId,
  name,
}: {
  parentId: string;
  name: string;
}) {
  console.log("addFolder", parentId, name);
  const result = await db
    .insert(itemFilesFolder)
    .values({ parentId, name })
    .returning({ id: itemFile.id });
}

export async function getToDos(homeownerId: string) {
  console.log("First recalibrate");
  await recalibratePriority(homeownerId);
  console.log("now query");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, homeownerId), eq(item.status, ItemStatus.TODO)),

    with: {
      filesRootFolder: {
        with: { files: true },
      },
    },
    orderBy: [desc(item.toDoPriority)],
  });
  console.log("items", items);
  return items;
}

export async function getToDosCompletedThisWeek(homeownerId: string) {
  const items = await db.query.item.findMany({
    where: (item, {}) =>
      and(
        eq(item.homeownerId, homeownerId),
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
  items.filter((item) => {
    const toDoDate = new Date(item.date);
    const timeDiff = Math.abs(toDoDate.getTime() - todaysDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays < 7 && item.status === ItemStatus.COMPLETED) {
      return true;
    } else if (
      item.recurring &&
      item.pastDates.length > 0 &&
      item.pastDates.some((pastDate) => {
        const pastDateObj = new Date(pastDate.date);
        const timeDiff = Math.abs(pastDateObj.getTime() - todaysDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays < 7;
      })
    ) {
      return true;
    }
    return false;
  });
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

export async function getCompleted(homeownerId: string) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) => and(eq(item.homeownerId, homeownerId)),
    orderBy: [desc(item.date)],
    with: {
      filesRootFolder: {
        with: { files: true },
      },
      pastDates: true,
    },
  });

  const filteredItems = items.filter((item) => {
    return (
      item.status === ItemStatus.COMPLETED ||
      (item.pastDates.length > 0 && item.recurring)
    );
  });
  return filteredItems;
}

export type CompletedItems = Awaited<ReturnType<typeof getCompleted>>;

export async function getForUserAndWarrantyDate(
  homeownerId: string,
  warrantyEndDate: string,
) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(
        eq(item.homeownerId, homeownerId),
        eq(item.warrantyEndDate, warrantyEndDate),
      ),
  });
  return items;
}

export type Items = Awaited<ReturnType<typeof getForUserAndWarrantyDate>>;

export async function getForUserAndDate(userId: string, taskDate: string) {
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, userId), eq(item.date, taskDate)),
  });
  return items;
}

async function getItemPastDatesInDateRange({
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
  const filteredItemPastDates = itemPastDates.filter((itemPastDate) => {
    return itemPastDate.date >= startDate && itemPastDate.date <= endDate;
  });
  let items = [];
  for (const itemPastDateObj of filteredItemPastDates) {
    const item = await db.query.item.findFirst({
      where: (item, { eq }) => eq(item.id, itemPastDateObj.itemId),
      with: {
        filesRootFolder: {
          with: { files: true },
        },
      },
    });

    if (item) {
      item.date = itemPastDateObj.date;
      items.push(item);
    }
  }
  return items;
}

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
    where: (item, { eq, and }) => eq(item.propertyId, propertyId),
  });
  //curretnDate plus 6 months
  const endDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + futureMonths),
  );
  const startDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - pastMonths),
  );

  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });

  return filteredItems;
}
