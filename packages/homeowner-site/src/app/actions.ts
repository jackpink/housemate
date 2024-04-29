"use server";

import { User } from "../../../core/homeowner/user";

export async function signIn(email: string, password: string) {
  console.log("Try to sign in ", email, password);
}

export async function signUp({
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
  User.create({ firstName, lastName, email, password });
}
