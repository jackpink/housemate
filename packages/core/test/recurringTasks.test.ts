/* 
1 "make task recurring"
create task
set as recurring => should be still be task, 
and no past dates, but have a schedule

2 "set task as complete"
create task with future date
set as complete => should now be complete with current date

3 "make complete task recurring"
create task
set as complete
set as recurring => should now be a task with a future date 
and should have a past date with the original date

4 "make task recurring and set as complete"
create task with a past date
set as recurring
set as complete => should now be task with a future date (schedule)
and a past date with the current date

5 "make task recurring and set as complete, then set as not recurring"
create task
set as recurring
set as complete
set as not recurring => should now be task with a future date (schedule
    and past date with the current date

6 "make task recurring and set as complete, then set as not recurring, 
then set as complete"
create task
set as recurring
set as complete
set as not recurring
set as complete => should now be complete task with current date and
past date with the current date
*/

import { expect, it } from "vitest";
import { Item } from "../homeowner/items/item";
import { User } from "../homeowner/user";
import { ItemCategory, ItemStatus } from "../db/schema";
import { Property } from "../homeowner/property";

it("make task recurring", async () => {
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  });
  const propertyId = await Property.create({
    streetNumber: "123",
    streetName: "Main St",
    suburb: "Suburbia",
    postcode: "1234",
    state: "NSW",
    country: "Australia",
    homeownerId: userId,
  });
  const itemId = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  expect(itemId).toBeDefined();
  await Item.update({
    id: itemId,
    recurring: true,
  });
  const item = await Item.get(itemId);
  expect(item).not.toBeNull();
  expect(item?.pastDates.length).toBe(0);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.TODO);
});

it("set task as complete", async () => {
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  });
  const propertyId = await Property.create({
    streetNumber: "123",
    streetName: "Main St",
    suburb: "Suburbia",
    postcode: "1234",
    state: "NSW",
    country: "Australia",
    homeownerId: userId,
  });
  // create task
  const itemId = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  expect(itemId).toBeDefined();
  // give it future date
  await Item.update({
    id: itemId,
    date: new Date("2030-01-01"),
  });
  // set as complete
  await Item.update({
    id: itemId,
    status: ItemStatus.COMPLETED,
  });
  //should now be complete with current date
  const item = await Item.get(itemId);
  expect(item).not.toBeNull();
  expect(item?.recurring).toBe(false);
  expect(item?.pastDates.length).toBe(0);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.COMPLETED);
  const currentDate = new Date().toISOString().split("T")[0]!;
  expect(item?.date).toBe(currentDate);
});

/*3 "make complete task recurring"
create task
set as complete
set as recurring => should now be a task with a future date 
and should have a past date with the original date */

it("make complete task recurring", async () => {
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  });
  const propertyId = await Property.create({
    streetNumber: "123",
    streetName: "Main St",
    suburb: "Suburbia",
    postcode: "1234",
    state: "NSW",
    country: "Australia",
    homeownerId: userId,
  });
  // create task
  const itemId = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  expect(itemId).toBeDefined();
  // set as complete
  await Item.update({
    id: itemId,
    status: ItemStatus.COMPLETED,
  });
  // set as recurring
  await Item.update({
    id: itemId,
    recurring: true,
  });
  const item = await Item.get(itemId);
  //should now be a task with a future date
  //and should have a past date with the completed date
  expect(item).not.toBeNull();
  expect(item?.recurring).toBe(true);
  expect(item?.pastDates.length).toBe(1);
  const currentDate = new Date().toISOString().split("T")[0]!;
  expect(item?.pastDates[0]?.date).toBe(currentDate);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.TODO);
  const futureDateObj = new Date();
  switch (item?.recurringSchedule) {
    case "weekly":
      futureDateObj.setDate(futureDateObj.getDate() + 7);
      break;
    case "fortnightly":
      futureDateObj.setDate(futureDateObj.getDate() + 14);
      break;
    case "monthly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 1);
      break;
    case "quarterly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 3);
      break;
    case "half-yearly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 6);
      break;
    case "yearly":
      futureDateObj.setFullYear(futureDateObj.getFullYear() + 1);
      break;
  }
  const futureDate = futureDateObj.toISOString().split("T")[0]!;
  expect(item?.date).toBe(futureDate);
});
/*
4 "make task recurring and set as complete"
create task with a past date
set as recurring
set as complete => should now be task with a future date (schedule)
and a past date with the current date
*/

it("make complete task recurring and set as complete", async () => {
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  });
  const propertyId = await Property.create({
    streetNumber: "123",
    streetName: "Main St",
    suburb: "Suburbia",
    postcode: "1234",
    state: "NSW",
    country: "Australia",
    homeownerId: userId,
  });
  // create task
  const itemId = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  expect(itemId).toBeDefined();

  // set as recurring
  await Item.update({
    id: itemId,
    recurring: true,
  });
  const item = await Item.get(itemId);

  // set as complete
  await Item.update({
    id: itemId,
    status: ItemStatus.COMPLETED,
  });

  //should now be a task with a future date
  //and should have a past date with the completed date
  expect(item).not.toBeNull();
  expect(item?.pastDates.length).toBe(1);
  const currentDate = new Date().toISOString().split("T")[0]!;
  expect(item?.pastDates[0]?.date).toBe(currentDate);

  expect(item?.status).toBe(ItemStatus.TODO);
  const futureDateObj = new Date();
  switch (item?.recurringSchedule) {
    case "weekly":
      futureDateObj.setDate(futureDateObj.getDate() + 7);
      break;
    case "fortnightly":
      futureDateObj.setDate(futureDateObj.getDate() + 14);
      break;
    case "monthly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 1);
      break;
    case "quarterly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 3);
      break;
    case "half-yearly":
      futureDateObj.setMonth(futureDateObj.getMonth() + 6);
      break;
    case "yearly":
      futureDateObj.setFullYear(futureDateObj.getFullYear() + 1);
      break;
  }
  const futureDate = futureDateObj.toISOString().split("T")[0]!;
  expect(item?.date).toBe(futureDate);
});

/*
5 "make task recurring and set as complete, then set as not recurring"
create task
set as recurring
set as complete
set as not recurring => should now be task with a future date (schedule
and past date with the current date
*/

/*
6 "make task recurring and set as complete, then set as not recurring, 
then set as complete"
create task
set as recurring
set as complete
set as not recurring
set as complete => should now be complete task with current date and
past date with the current date
*/
