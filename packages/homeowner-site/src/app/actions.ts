"use server";

import bcrypt from "bcryptjs";
import { User } from "../../../core/homeowner/user";
import { signIn, signOut } from "~/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { IAddress, Property } from "../../../core/homeowner/property";
import { revalidatePath } from "next/cache";

export async function signInAction(email: string, password: string) {
  // console.log("Try to sign in ", email, password);
  // try {
  await signIn("credentials", {
    email: email,
    password: password,
    redirect: false,
  })
    .catch((error) => {
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
    })
    .finally(() => {
      console.log("Sign in finally");
      redirect("/properties");
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

export async function createProperty({
  apartment,
  streetNumber,
  streetName,
  suburb,
  state,
  postcode,
  country,
  homeownerId,
}: {
  apartment?: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  homeownerId: string;
}) {
  const propertyId = await Property.create({
    apartment,
    streetNumber,
    streetName,
    suburb,
    state,
    postcode,
    country,
    homeownerId,
  });
  console.log("Property created", propertyId);
  revalidatePath("/properties");
  return propertyId;
}

export async function getValidAddress({
  addressSearchString,
}: {
  addressSearchString: string;
}) {
  const address = await Property.getValidAddress({ addressSearchString });
  return address;
}
