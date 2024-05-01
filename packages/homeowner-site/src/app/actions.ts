"use server";

import bcrypt from "bcryptjs";
import { User } from "../../../core/homeowner/user";
import { signIn, signOut } from "~/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signInAction(email: string, password: string) {
  // console.log("Try to sign in ", email, password);
  // try {
  await signIn("credentials", {
    email: email,
    password: password,
    redirectTo: "/",
  }).catch((error) => {
    // console.log("Sign in success");
    // } catch (error) {
    console.log("Sign in error");
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log("Invalid email or password");
          return { error: "Invalid email or password" };
        default:
          return { error: "Sign in failed" };
      }
    } else {
      console.log("Error", error);
      throw error;
    }
  });
  //   }
  // }
}

export async function signOutAction() {
  try {
    await signOut();
  } catch (error) {
    console.log("Sign out error", error);
    throw error;
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
