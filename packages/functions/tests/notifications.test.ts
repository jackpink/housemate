import { expect, it } from "vitest";
import { User } from "../../core/homeowner/user";
import { Property } from "../../core/homeowner/property";
import {
  ItemCategory,
  ItemStatus,
  RecurringSchedule,
  item,
} from "../../core/db/schema";
import { Item } from "../../core/homeowner/items/item";
import { checkTaskReminders, handler } from "../alerts";
import { Alert } from "../../core/homeowner/alert";

it("check for tasks", async () => {
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  // create a new user
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
    password: "password",
  });
  expect(userId).toBeDefined();
  const user = await User.getById(userId);
  expect(user).not.toBeNull();

  // create a new property
  const propertyId = await Property.create({
    streetNumber: "123",
    streetName: "Main St",
    suburb: "Suburbia",
    postcode: "1234",
    state: "NSW",
    country: "Australia",
    homeownerId: userId,
  });

  // create a new item, task
  let date = new Date();
  date.setDate(date.getDate() + 7);
  const dateString = date.toISOString().split("T")[0];
  console.log("DATE", dateString);
  const itemId = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
    schedule: RecurringSchedule.WEEKLY,
    date: date,
    recurring: false,
  });

  const task = await Item.get(itemId);

  console.log("TASK", task);

  // update task to be due in 7 days

  // check user for tasks
  checkTaskReminders("a628dd1b-b5a1-49b1-a408-b70a52a34c5f", 7);
  await handler();
  // check for alert
  const alerts = await Alert.getForHomeowner(userId);
  console.log("ALERTS", alerts);
  expect(alerts).not.toBeNull();
  expect(alerts.length).toBeGreaterThan(0);
  expect(alerts[0].title).toBe("Task alert for Clean Gutters");
});

// it("create alert for task", async () => {
//   let name = (Math.random() + 1).toString(36).substring(7);
//   let domain = (Math.random() + 1).toString(36).substring(7);
//   // create a new user
//   const userId = await User.create({
//     firstName: "John",
//     lastName: "Doe",
//     email: `${name}@${domain}.com`,
//     password: "password",
//   });
//   expect(userId).toBeDefined();
//   const user = await User.getById(userId);
//   expect(user).not.toBeNull();

//   // create a new property

//   // create a new item, task

//   // create alert for task

//   //check exists
// });
