import { User } from "../core/homeowner/user";
import { Item, type Items } from "../core/homeowner/item";
import { Alert } from "../core/homeowner/alert";

export async function handler() {
  const allHomeownerUsers = await User.getAll();
  for (const user of allHomeownerUsers) {
    console.log(`User: ${user.firstName} ${user.lastName}`);
    await checkWarranties(user.id, user.warrantyAlert);
    await checkTaskReminders(user.id, user.taskReminder);
  }
}

async function checkWarranties(userId: string, warrantySetting: number) {
  console.log("Checking warranties");
  const todaysDate = new Date();
  const warrantyDate = new Date(todaysDate.getDate() + warrantySetting)
    .toISOString()
    .split("T")[0];
  console.log("Warranty date", warrantyDate);
  const itemsWithWarrantyAlerts = await Item.getForUserAndWarrantyDate(
    userId,
    warrantyDate,
  );
  for (const item of itemsWithWarrantyAlerts) {
    await createWarrantyAlertForItem(item, userId);
  }
}

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

async function checkTaskReminders(userId: string, taskSetting: number) {
  console.log("Checking task reminders");
  const todaysDate = new Date();
  const taskDate = new Date(todaysDate.getDate() + taskSetting)
    .toISOString()
    .split("T")[0];
  console.log("Task date", taskDate);
  const itemsWithTaskAlerts = await Item.getForUserAndDate(userId, taskDate);
  for (const item of itemsWithTaskAlerts) {
    await createTaskAlertForItem(item, userId);
  }
}

async function createTaskAlertForItem(
  item: Items[number],
  homeownerId: string,
) {
  console.log("Creating alert for item");
  const title = `Task Reminder alert for ${item.title}`;
  const description = `The task ${item.title} is due on ${item.date}`;
  await Alert.create({
    title,
    description,
    homeownerId: homeownerId,
    propertyId: item.propertyId,
    itemId: item.id,
  });
}
