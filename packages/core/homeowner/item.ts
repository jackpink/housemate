export * as Item from "./item";
import {
  ItemCategory,
  ItemStatus,
  item,
  itemFile,
  itemFilesFolder,
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
  const [created] = await db
    .insert(item)
    .values({ title, status, category, homeownerId, propertyId })
    .returning({ id: item.id });

  if (!created) throw new Error("Failed to create item");
  // add a root folder for the item
  const [folderCreated] = await db
    .insert(itemFilesFolder)
    .values({ name: "root", itemId: created.id })
    .returning({ id: itemFilesFolder.id });

  if (!folderCreated) throw new Error("Failed to create folder for item");

  return created.id;
}

export async function get(id: string) {
  const result = await db.query.item.findFirst({
    where: eq(item.id, id),
    with: {
      filesRootFolder: {
        with: {
          files: true,
          folders: true,
        },
      },
    },
  });
  if (!result) throw new Error("Item not found");
  return result;
}

export type ItemWithFiles = Awaited<ReturnType<typeof get>>;

//export type FilesFolder = ItemWithFiles["filesRootFolder"].

export type File = InferSelectModel<typeof itemFile>;

export type Files = File[];

export async function update({
  id,
  title,
  description,
  recurring,
  date,
  priority,
  status,
  warrantyEndDate,
}: {
  id: string;
  title?: string;
  description?: string;
  recurring?: boolean;
  date?: string;
  priority?: number;
  status?: ItemStatus;
  warrantyEndDate?: string;
}) {
  await db
    .update(item)
    .set({
      title,
      description,
      recurring,
      date,
      toDoPriority: priority,
      status,
      warrantyEndDate,
    })
    .where(eq(item.id, id));
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

export async function getToDos(homeownerId: string) {
  console.log("First recalibrate");
  await recalibratePriority(homeownerId);
  console.log("now query");
  const items = await db.query.item.findMany({
    where: (item, { eq }) =>
      and(eq(item.homeownerId, homeownerId), eq(item.status, ItemStatus.TODO)),

    with: {
      filesRootFolder: {
        with: { files: true, folders: true },
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
        eq(item.status, ItemStatus.COMPLETED),
        or(
          eq(item.category, ItemCategory.JOB),
          eq(item.category, ItemCategory.ISSUE),
        ),
      ),
    with: {
      filesRootFolder: {
        with: { files: true, folders: true },
      },
    },
  });
  const todaysDate = new Date();
  items.filter((item) => {
    const toDoDate = new Date(item.date);
    const timeDiff = Math.abs(toDoDate.getTime() - todaysDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays < 7) {
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
    where: (item, { eq }) =>
      and(
        eq(item.homeownerId, homeownerId),
        eq(item.status, ItemStatus.COMPLETED),
      ),
    orderBy: [desc(item.date)],
    with: {
      filesRootFolder: {
        with: { files: true, folders: true },
      },
    },
  });
  return items;
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
