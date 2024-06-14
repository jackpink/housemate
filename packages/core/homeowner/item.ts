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
  await db
    .update(item)
    .set({
      title,
      description,
      recurring,
      recurringSchedule,
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
        eq(item.status, ItemStatus.COMPLETED),
        or(
          eq(item.category, ItemCategory.JOB),
          eq(item.category, ItemCategory.ISSUE),
        ),
      ),
    with: {
      filesRootFolder: {
        with: { files: true },
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
        with: { files: true },
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
