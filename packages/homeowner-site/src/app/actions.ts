"use server";

import bcrypt from "bcryptjs";
import { hash } from "@node-rs/argon2";
import { User } from "../../../core/homeowner/user";
import { Item } from "../../../core/homeowner/items/item";
import { lucia, signIn, signOut } from "~/auth";
import { redirect } from "next/navigation";
import { IAddress, Property } from "../../../core/homeowner/property";
import { revalidatePath } from "next/cache";
import { ItemCategory, ItemStatus, property } from "../../../core/db/schema";
import { cookies, headers } from "next/headers";

export async function signInAction(email: string, password: string) {
  // console.log("Try to sign in ", email, password);
  // try {
  await signIn({
    email: email,
    password: password,
  })
    .then(() => {
      console.log("Sign in finally");
      redirect("/properties");
    })
    .catch((error) => {
      console.log("Sign in error", error);
      throw error;
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
  const hashedPassword = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  let userId: string;
  try {
    userId = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  const session = await lucia.createSession(userId, {
    email: email,
    emailVerified: false,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/sign-up/verify");

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
  console.log;
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

export async function addFileToFolderAction({
  folderId,
  itemId,
  name,
  key,
  bucket,
  propertyId,
  type,
}: {
  folderId: string;
  itemId: string;
  name: string;
  key: string;
  bucket: string;
  propertyId: string;
  type: string;
}) {
  const itemFileId = Item.addFile({ folderId, name, key, bucket, type });
  revalidatePath(`/properties/${propertyId}/items/${itemId}`);
  return itemFileId;
}

export async function getDeviceType() {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const mobile = userAgent!.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
  );
  if (mobile) {
    console.log("mobile");
    return "mobile";
  } else {
    console.log("desktop");
    return "desktop";
  }
}

export async function updateUser({
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
  "use server";
  // update user
  const user = await User.update({
    id,
    firstName,
    lastName,
    warrantyAlert,
    taskReminder,
    taskOverdueReminder,
  });
  if (!user) throw new Error("Failed to update user");
  revalidatePath(`/manage-account`);
}

export async function createFolderForItem({
  parentId,
  name,
  propertyId,
  itemId,
}: {
  parentId: string;
  name: string;
  propertyId: string;
  itemId: string;
}) {
  await Item.addFolder({ parentId, name });
  revalidatePath(`/properties/${propertyId}/items/${itemId}`);
}
