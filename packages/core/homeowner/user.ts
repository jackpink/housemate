export * as User from "./user";
import { db, schema } from "../db";
import { eq, gt, and } from "drizzle-orm";

export async function create({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  console.log("Try to create user", firstName, lastName, email, password);
  const [created] = await db
    .insert(schema.homeownerUsers)
    .values({
      firstName,
      lastName,
      email,
      password,
    })
    .returning({ id: schema.homeownerUsers.id });
  if (!created) throw new Error("Failed to create user");
  return created.id;
}

export async function update({
  id,
  firstName,
  lastName,
  warrantyAlert,
  taskReminder,
  taskOverdueReminder,
}: {
  id: string;
  firstName?: string;
  lastName?: string;
  warrantyAlert?: number;
  taskReminder?: number;
  taskOverdueReminder?: number;
}) {
  console.log("Try to update user", id, firstName, lastName);
  const [updated] = await db
    .update(schema.homeownerUsers)
    .set({
      firstName,
      lastName,
      warrantyAlert,
      taskReminder,
      taskOverdueReminder,
    })
    .where(eq(schema.homeownerUsers.id, id))
    .returning({ id: schema.homeownerUsers.id });
  if (!updated) throw new Error("Failed to update user");
  return updated.id;
}

export async function getByCredentials(email: string, password: string) {
  console.log("Try to get user by credentials");
}

export async function getByEmail(email: string) {
  const user = await db
    .select()
    .from(schema.homeownerUsers)
    .where(eq(schema.homeownerUsers.email, email));
  return user[0];
}

export async function getById(id: string) {
  const user = await db
    .select()
    .from(schema.homeownerUsers)
    .where(eq(schema.homeownerUsers.id, id));
  if (!user[0]) throw new Error("User not found");
  return user[0];
}
export type User = Awaited<ReturnType<typeof getById>>;

export async function getAll() {
  const users = await db.select().from(schema.homeownerUsers);
  return users;
}

export async function createEmailVerificationCode({
  userId,
  code,
  expirationDate,
}: {
  userId: string;
  code: string;
  expirationDate: Date;
}) {
  await removeEmailVerificationCodes(userId);
  console.log("Try to create email verification code", userId);
  const [result] = await db
    .insert(schema.emailVerificationCode)
    .values({
      userId,
      code: code,
      expiresAt: expirationDate,
    })
    .returning({ code: schema.emailVerificationCode.code });
  if (!result) throw new Error("Failed to create email verification code");
  return result.code;
}

async function removeEmailVerificationCodes(userId: string) {
  console.log("Try to remove email verification code", userId);
  await db
    .delete(schema.emailVerificationCode)
    .where(eq(schema.emailVerificationCode.userId, userId))
    .returning({ deletedId: schema.emailVerificationCode.id });
}

export async function verifyEmailVerificationCode({
  userId,
  code,
}: {
  userId: string;
  code: string;
}) {
  console.log("Try to verify email verification code", userId);
  const result = await db.transaction(async (tx) => {
    const [userCode] = await tx
      .select()
      .from(schema.emailVerificationCode)
      .where(and(eq(schema.emailVerificationCode.userId, userId)));
    if (!userCode || userCode.code !== code) {
      tx.rollback();
      return false;
    }
    // isWithinExpirationDate
    if (userCode.expiresAt < new Date()) {
      // code has expired
      tx.rollback();
      return false;
    }
    // delete and return true
    await tx
      .delete(schema.emailVerificationCode)
      .where(eq(schema.emailVerificationCode.id, userCode.id));

    await tx
      .update(schema.homeownerUsers)
      .set({ emailVerified: true })
      .where(eq(schema.homeownerUsers.id, userId));

    return true;
  });
  return result;
}

export async function hasActiveVerificationCode({
  userId,
}: {
  userId: string;
}) {
  console.log("Try to check if active verification code", userId);
  const activeCodes = await db
    .select()
    .from(schema.emailVerificationCode)
    .where(
      and(
        eq(schema.emailVerificationCode.userId, userId),
        gt(schema.emailVerificationCode.expiresAt, new Date()),
      ),
    );
  if (activeCodes.length > 0) return true;
  return false;
}
