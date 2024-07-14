import { expect, it } from "vitest";
import { Item } from "../homeowner/items/item";
import { User } from "../homeowner/user";
import { ItemCategory, ItemStatus } from "../db/schema";
import { Property } from "../homeowner/property";
import { Todos } from "../homeowner/items/todos";

/*
Add a task
*/

it("add a task", async () => {
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
  expect(item?.toDoPriority).toBeNull();
  expect(item?.status).toBe(ItemStatus.TODO);
});

/*
Add 5 Tasks and get initial priority, 
order should be by dates
*/

it("add 6 tasks and get initial priority", async () => {
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
  // create 6 tasks
  const itemId1 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: "2021-12-06",
  });
  await Item.update({
    id: itemId2,
    date: "2021-12-02",
  });
  await Item.update({
    id: itemId3,
    date: "2021-12-17",
  });
  await Item.update({
    id: itemId4,
    date: "2021-12-26",
  });
  await Item.update({
    id: itemId5,
    date: "2021-12-05",
  });
  await Item.update({
    id: itemId6,
    date: "2021-12-15",
  });

  const toDos = await Todos.getAll({ propertyId });
  expect(toDos).toBeDefined();

  expect(toDos).not.toBeNull();
  expect(toDos.length).toBe(6);

  expect(toDos[0]?.id).toBe(itemId2);
  expect(toDos[1]?.id).toBe(itemId5);
  expect(toDos[2]?.id).toBe(itemId1);
  expect(toDos[3]?.id).toBe(itemId6);
  expect(toDos[4]?.id).toBe(itemId3);
  expect(toDos[5]?.id).toBe(itemId4);
  // If I now add a new task with a date of 2021-12-13,
  // what will happen to my order? does it get preserved?
  // where should it go?
});

/*
Add 5 Tasks and get initial priority, then add a 7th 
order should be the same with 7th lowest priority
*/

it("add 6 tasks and get initial priority, then add a 7th", async () => {
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
  // create 6 tasks
  const itemId1 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: "2021-12-06",
  });
  await Item.update({
    id: itemId2,
    date: "2021-12-02",
  });
  await Item.update({
    id: itemId3,
    date: "2021-12-17",
  });
  await Item.update({
    id: itemId4,
    date: "2021-12-26",
  });
  await Item.update({
    id: itemId5,
    date: "2021-12-05",
  });

  // If I now add a new task with a date of 2021-12-13,

  const itemId7 = await Item.create({
    title: "Clean Gutters",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  await Item.update({
    id: itemId7,
    date: "2021-12-13",
  });

  const toDos = await Todos.getAll({ propertyId });
  expect(toDos).toBeDefined();

  expect(toDos).not.toBeNull();
  expect(toDos.length).toBe(7);

  expect(toDos[0]?.id).toBe(itemId2);
  expect(toDos[1]?.id).toBe(itemId5);
  expect(toDos[2]?.id).toBe(itemId1);
  expect(toDos[3]?.id).toBe(itemId6);
  expect(toDos[4]?.id).toBe(itemId3);
  expect(toDos[5]?.id).toBe(itemId4);
  expect(toDos[6]?.id).toBe(itemId7);
  // what will happen to my order? does it get preserved?
  // where should it go?
});

/*
Add 5 Tasks and get initial priority, 
change priority of middle task
move up, check
move down, check
move up twice, check
move down twice, check
*/

it("add a task", async () => {
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
  expect(item?.recurring).toBe(true);
  expect(item?.pastDates.length).toBe(0);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.TODO);
});

/*
Add 5 Tasks and get initial priority, 
change priority of middle task
move up, check
move down, check
move up twice, check
move down twice, check
set a middle todo as complete
check that it is removed from the list and first of completed list
*/

it("add a task", async () => {
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
  expect(item?.recurring).toBe(true);
  expect(item?.pastDates.length).toBe(0);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.TODO);
});

/*
Add 5 Tasks and get initial priority, 
change priority of middle task
move up, check
move down, check
move up twice, check
move down twice, check
set a middle todo as recurring
set middle todo as complete
check that it is last on list and first of completed list
*/

it("add a task", async () => {
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
  expect(item?.recurring).toBe(true);
  expect(item?.pastDates.length).toBe(0);
  expect(item?.recurringSchedule).toBeDefined();
  expect(item?.status).toBe(ItemStatus.TODO);
});
