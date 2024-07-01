export * as ItemFilesFolder from "./folder";

import { db } from "../db";
import { itemFilesFolder } from "../db/schema";
import { eq } from "drizzle-orm";

export async function create() {}

export async function get() {}

export async function update({ name, id }: { name: string; id: string }) {
  await db
    .update(itemFilesFolder)
    .set({
      name,
    })
    .where(eq(itemFilesFolder.id, id));
}
