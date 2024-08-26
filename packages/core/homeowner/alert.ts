export * as Alert from "./alert";
import { db } from "../db";
import { homeownerAlert } from "../db/schema";
import { eq, and } from "drizzle-orm";

export async function create({
  title,
  description,
  homeownerId,
  propertyId,
  itemId,
}: {
  title: string;
  description?: string;
  homeownerId: string;
  propertyId: string;
  itemId?: string;
}) {
  const [created] = await db
    .insert(homeownerAlert)
    .values({
      title,
      description,
      homeownerId,
      propertyId,
      itemId,
    })
    .returning({ id: homeownerAlert.id });
  if (!created) throw new Error("Failed to create alert");
  return created.id;
}

export async function update({
  id,
  viewed,
  description,
}: {
  id: string;
  viewed: boolean;
  description?: string;
}) {
  await db
    .update(homeownerAlert)
    .set({
      viewed,
      description,
    })
    .where(eq(homeownerAlert.id, id));
}

export async function getForHomeowner(homeownerId: string) {
  const alerts = await db
    .select()
    .from(homeownerAlert)
    .where(eq(homeownerAlert.homeownerId, homeownerId));

  return alerts;
}

export async function getForItem(itemId: string) {
  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${today.getMonth() < 9 ? "0" : ""}${today.getMonth() + 1}-${today.getDate() < 10 ? "0" : ""}${today.getDate()}`;
  console.log("todayDateString", todayDateString);
  const alerts = await db
    .select()
    .from(homeownerAlert)
    .where(
      and(
        eq(homeownerAlert.itemId, itemId),
        eq(homeownerAlert.date, todayDateString),
      ),
    );

  return alerts;
}

export type Alerts = Awaited<ReturnType<typeof getForHomeowner>>;
