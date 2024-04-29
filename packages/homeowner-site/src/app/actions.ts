"use server";

import bcrypt from "bcrypt";
import { User } from "../../../core/homeowner/user";
import { signIn } from "~/auth";
import { AuthError } from "next-auth";

export async function signInAction(email: string, password: string) {
  console.log("Try to sign in ", email, password);
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/properties",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Sign in failed" };
      }
    }
    //throw error;
  }
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
    return { error: "User already exists" };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  User.create({ firstName, lastName, email, password: hashedPassword });

  // TODO: Send verification token email
  return {
    success: "User created",
  };
}
