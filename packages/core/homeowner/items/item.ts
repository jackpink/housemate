export * as Item from "./item";
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
import { Recurring } from "./recurring";

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
  if (!result) return null;
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
  date?: Date;
  priority?: number;
  status?: ItemStatus;
  warrantyEndDate?: string;
}) {
  if (recurring !== undefined) {
    await Recurring.update({ id, recurring });
  }
  if (!!status) {
    await Recurring.updateStatus({ id, status });
  }
  if (!!date) {
    const dateString = date
      ? `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
      : undefined;
    console.log("date string", dateString);
    await db
      .update(item)
      .set({
        title,
        description,
        recurringSchedule,
        date: dateString,
        toDoPriority: priority,
        warrantyEndDate,
      })
      .where(eq(item.id, id));
  }

  if (
    !!priority ||
    !!title ||
    !!description ||
    !!recurringSchedule ||
    !!warrantyEndDate
  ) {
    await db
      .update(item)
      .set({
        title,
        description,
        recurringSchedule,
        toDoPriority: priority,
        warrantyEndDate,
      })
      .where(eq(item.id, id));
  }
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
  const result = await db
    .insert(itemFilesFolder)
    .values({ parentId, name })
    .returning({ id: itemFile.id });
}
