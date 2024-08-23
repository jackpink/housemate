"use server";

import { User } from "../../../core/homeowner/user";
import { Item } from "../../../core/homeowner/items/item";
import {
  generateEmailVerificationCode,
  lucia,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updatePassword,
  updatePasswordWithCurrentPassword,
} from "~/auth";
import { redirect } from "next/navigation";
import { IAddress, Property } from "../../../core/homeowner/property";
import { revalidatePath } from "next/cache";
import {
  ItemCategory,
  ItemStatus,
  RecurringSchedule,
  property,
} from "../../../core/db/schema";
import { cookies, headers } from "next/headers";
import { send } from "process";
import { sendVerificationEmail } from "~/utils/emails";

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
    redirect("/sign-in");
  } catch (error) {
    console.log("Sign out error", error);
    throw error;
  }
}

export async function signUpAction({
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
  try {
    await signUp({
      firstName,
      lastName,
      email,
      password,
    });
    redirect("/sign-up/verify");
  } catch (error) {
    console.log("Sign up error", error);
    throw error;
  }
}

export async function updatePasswordWithCurrentPasswordAction({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  await updatePasswordWithCurrentPassword({
    userId,
    currentPassword,
    newPassword,
  });
  revalidatePath("/manage-account");
}

export async function updatePasswordAction({
  userId,
  newPassword,
}: {
  userId: string;
  newPassword: string;
}) {
  await updatePassword({ userId, newPassword });
  revalidatePath("/password-reset");
}

export async function sendPasswordResetEmailAction({
  email,
}: {
  email: string;
}) {
  // get user with email
  const user = await User.getByEmail(email);

  if (!user) {
    return { error: "User not found" };
  }

  // generate reset token
  await resetPassword({ userId: user.id });

  return { success: "Reset email sent" };
}

export async function createAndSendVerificationEmailCode({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const verificationCode = await generateEmailVerificationCode({ userId });

  await sendVerificationEmail({ email, code: verificationCode });

  revalidatePath("/sign-up/verify");
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

// export async function createItemAction({
//   title,
//   status,
//   category,
//   homeownerId,
//   propertyId,
// }: {
//   title: string;
//   status: ItemStatus;
//   category: ItemCategory;
//   homeownerId: string;
//   propertyId: string;
// }) {
//   const itemId = await Item.create({
//     title,
//     status,
//     category,
//     homeownerId,
//     propertyId,
//   });
//   console.log("Item created", itemId);
//   revalidatePath(`/properties/${propertyId}`);
//   return itemId;
// }

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

export async function createTaskAction({
  title,
  recurring,
  schedule,
  homeownerId,
  propertyId,
  commonTaskId,
  date,
}: {
  title: string;
  recurring: boolean;
  schedule: RecurringSchedule;
  homeownerId: string;
  propertyId: string;
  commonTaskId?: string;
  date?: string;
}) {
  const taskId = await Item.create({
    title,
    status: ItemStatus.TODO,
    category: ItemCategory.JOB,
    date: date ? new Date(date) : new Date(),
    recurring,
    schedule,
    homeownerId,
    propertyId,
    commonTaskId,
  });
  console.log("Task created", taskId);
  revalidatePath(`/properties/${propertyId}`);
  return taskId;
}
