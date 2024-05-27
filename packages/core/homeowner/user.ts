export * as User from "./user";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

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
  return user[0];
}
