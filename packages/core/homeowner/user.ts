export * as User from "./user";
import { db } from "../db";
import { homeownerUsers } from "db/schema";
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
}

export async function getByCredentials(email: string, password: string) {
  console.log("Try to get user by credentials");
}

export async function getByEmail(email: string) {
  db.select().from(homeownerUsers).where(eq(homeownerUsers.email, email));
}
