"use server";

import bcrypt from "bcryptjs";
import { User } from "../../../core/homeowner/user";
import { Item } from "../../../core/homeowner/item";
import { signIn, signOut } from "~/auth";
import { redirect } from "next/navigation";
import { IAddress, Property } from "../../../core/homeowner/property";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { ItemCategory, ItemStatus, property } from "../../../core/db/schema";

export async function signInAction(email: string, password: string) {
  // console.log("Try to sign in ", email, password);
  // try {
  await signIn("credentials", {
    email: email,
    password: password,
    redirect: false,
  })
    .then(() => {
      console.log("Sign in finally");
      redirect("/properties");
    })
    .catch((error) => {
      // console.log("Sign in success");
      // } catch (error) {
      console.log("Sign in error");
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            console.log("Invalid email or password");
            throw new Error("Invalid email or password");
          default:
            throw new Error("An authentication error occurred");
        }
      } else {
        console.log("Error", error.message);
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
    throw new Error("User already exists");
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

export async function createItemAction({
  title,
  status,
  category,
  homeownerId,
  propertyId,
}: {
  title: string;
  status: ItemStatus;
  category: ItemCategory;
  homeownerId: string;
  propertyId: string;
}) {
  const itemId = await Item.create({
    title,
    status,
    category,
    homeownerId,
    propertyId,
  });
  console.log("Item created", itemId);
  revalidatePath(`/properties/${propertyId}`);
  return itemId;
}

export async function addFileToItemAction({
  itemId,
  name,
  key,
  bucket,
  propertyId,
  type,
}: {
  itemId: string;
  name: string;
  key: string;
  bucket: string;
  propertyId: string;
  type: string;
}) {
  const itemFileId = Item.addFile({ itemId, name, key, bucket, type });
  revalidatePath(`/properties/${propertyId}/items/${itemId}`);
  return itemFileId;
}
