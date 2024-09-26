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
  verifyEmailVerificationCode,
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
import { Alert } from "../../../core/homeowner/alert";
import { authRateLimit } from "~/server/ratelimiter";

export async function signInAction(email: string, password: string) {
  const ip = headers().get("x-forwarded-for") ?? "unknown";
  const isRateLimited = authRateLimit(ip);
  if (isRateLimited) {
    return { error: "Too many requests" };
  }
  const result = await signIn({
    email: email,
    password: password,
  });

  if (result.error) {
    return { error: result.error };
  } else if (result.success) {
    redirect("/properties");
  }

  return result;
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
  const result = await signUp({
    firstName,
    lastName,
    email,
    password,
  });

  if (result.error) {
    return { error: result.error };
  } else if (result.success) {
    redirect("/sign-up/verify");
  }
  return result;
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
  // need to update users storage
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
  console.log(
    "Updating user",
    id,
    firstName,
    lastName,
    warrantyAlert,
    taskReminder,
    taskOverdueReminder,
  );
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

export async function updateUserStorage({
  id,
  storage,
}: {
  id: string;
  storage: number;
}) {
  "use server";
  // update user storage
  console.log("Updating user storage", id, storage);
  const user = await User.updateStorageUsed({
    id,
    storage,
  });
  if (!user) throw new Error("Failed to update user storage");
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
  revalidatePath(`/properties/${propertyId}`);
  return taskId;
}

export async function deleteFileAction({
  fileId,
  propertyId,
}: {
  fileId: string;
  propertyId: string;
}) {
  await Item.updateFile({ id: fileId, deleted: true });
  revalidatePath(`/properties/${propertyId}`);
}

export async function deleteItemAction({
  itemId,
  propertyId,
}: {
  itemId: string;
  propertyId: string;
}) {
  await Item.update({ id: itemId, deleted: true });
  revalidatePath(`/properties/${propertyId}`);
}

export async function getUnviewedNotificationsAction({
  homeownerId,
}: {
  homeownerId: string;
}) {
  console.log("Getting unviewed notifications", homeownerId);
  const alertsLength = await Alert.getNumberOfUnviewed(homeownerId);
  return alertsLength;
}

export async function deletePropertyAction({
  propertyId,
}: {
  propertyId: string;
}) {
  await Property.remove({ id: propertyId });
  revalidatePath("/properties");
}

export async function deleteAccountAction({ userId }: { userId: string }) {
  await signOut();
  await User.remove({ id: userId });
}

export async function verifyCodeAction({
  userId,
  code,
}: {
  userId: string;
  code: string;
}) {
  const result = await verifyEmailVerificationCode({
    userId: userId,
    code,
  });
  if (result) {
    redirect("/properties");
  } else {
    return { error: "Invalid code" };
  }
}
