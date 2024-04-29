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
  // Check if user exists
  const existingUser = await User.getByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  User.create({ firstName, lastName, email, hashedPassword });

  // TODO: Send verification token email
  return {
    succes: "User created",
  };
}
