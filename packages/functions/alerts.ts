import { User } from "../core/homeowner/user";
import { Item, type Items } from "../core/homeowner/item";
import { Alert } from "../core/homeowner/alert";
import { Resend } from "resend";
import { env } from "../core/env.mjs";
import { render } from "@react-email/components";
import TaskUpcomingNotification from "../transactional/emails/TaskUpcomingNotification";
import { Property } from "../core/homeowner/property";

export async function handler() {
  const allHomeownerUsers = await User.getAll();
  console.log("All homeowner users", allHomeownerUsers);
  for (const user of allHomeownerUsers) {
    console.log(
      `User: ${user.firstName} ${user.lastName} ${user.email} ${user.id} ${user.taskReminder}`,
    );
    //await checkWarranties(user.id, user.warrantyAlert);
    await checkTaskReminders(user.id, user.taskReminder);
  }
}

// async function checkWarranties(userId: string, warrantySetting: number) {
//   console.log("Checking warranties");
//   const todaysDate = new Date();
//   const warrantyDate = new Date(todaysDate.getDate() + warrantySetting)
//     .toISOString()
//     .split("T")[0];
//   console.log("Warranty date", warrantyDate);
//   const itemsWithWarrantyAlerts = await Item.getForUserAndWarrantyDate(
//     userId,
//     warrantyDate,
//   );
//   for (const item of itemsWithWarrantyAlerts) {
//     await createWarrantyAlertForItem(item, userId);
//   }
// }

async function createWarrantyAlertForItem(
  item: Items[number],
  homeownerId: string,
) {
  console.log("Creating alert for item");
  const title = `Warranty alert for ${item.title}`;
  const description = `The warranty for ${item.title} expires on ${item.warrantyEndDate}`;
  await Alert.create({
    title,
    description,
    homeownerId: homeownerId,
    propertyId: item.propertyId,
    itemId: item.id,
  });
}

export async function checkTaskReminders(userId: string, taskSetting: number) {
  console.log("Checking task reminders");
  const todaysDate = new Date();
  todaysDate.setDate(todaysDate.getDate() + taskSetting);
  const dateString = `${todaysDate.getFullYear()}-${todaysDate.getMonth() < 9 ? "0" : ""}${todaysDate.getMonth() + 1}-${todaysDate.getDate() < 10 ? "0" : ""}${todaysDate.getDate()}`;
  console.log("Task date", dateString);
  const itemsWithTaskAlerts = await Item.getForUserAndDate(userId, dateString);
  console.log("Items with task alerts", itemsWithTaskAlerts);
  for (const item of itemsWithTaskAlerts) {
    await createTaskAlertForItem(item, userId);
  }
}

async function createTaskAlertForItem(
  item: Items[number],
  homeownerId: string,
) {
  console.log("Creating alert for item");
  // check if alert already exists
  const existingAlerts = await Alert.getForItem(item.id);
  if (existingAlerts.length > 0) {
    console.log("Alert already exists for item", item.id);
    return;
  }
  console.log("no alerts exist, Creating alert for item", item.id);
  const title = `Task Reminder alert for ${item.title}`;
  const description = `The task ${item.title} is due on ${item.date}`;
  const alertId = await Alert.create({
    title,
    description,
    homeownerId: homeownerId,
    propertyId: item.propertyId,
    itemId: item.id,
  });
  console.log("Alert created", alertId);
  const user = await User.getById(homeownerId);
  const property = await Property.get(item.propertyId);
  let address = "";
  if (property) {
    address = concatAddress(property);
  }
  await sendTaskReminderEmail({
    email: user.email,
    address: address,
    taskTitle: item.title,
    date: item.date,
    propertyId: item.propertyId,
    taskId: item.id,
  });
}

async function sendTaskReminderEmail({
  email,
  address,
  taskTitle,
  date,
  propertyId,
  taskId,
}: {
  email: string;
  address: string;
  taskTitle: string;
  date: string;
  propertyId: string;
  taskId: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY);

  console.log("Sending task reminder email to", email);

  const emailHtml = render(
    TaskUpcomingNotification({
      address,
      taskTitle,
      date,
      propertyId,
      taskId,
    }),
  );

  const response = await resend.emails.send({
    from: "Housemate <no-reply@accounts.housemate.dev>",
    to: [email],
    subject: "Task Reminder",
    html: emailHtml,
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: "task_reminder",
      },
    ],
  });

  console.log("Email sent", response);
}

export const concatAddress = (addressObject: IAddress) => {
  let address =
    addressObject.streetNumber +
    " " +
    addressObject.streetName +
    ", " +
    addressObject.suburb +
    ", " +
    addressObject.state +
    ", " +
    addressObject.country;
  if (!!addressObject.apartment) {
    // add apartment number in front /

    address = addressObject.apartment + " / " + address;
  }
  return address;
};

interface IAddress {
  apartment: string | null;
  streetNumber: string;
  streetName: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
}
