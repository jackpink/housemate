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
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    date: new Date("2021-12-06"),
  });
  await Item.update({
    id: itemId2,
    date: new Date("2021-12-02"),
  });
  await Item.update({
    id: itemId3,
    date: new Date("2021-12-17"),
  });
  await Item.update({
    id: itemId4,
    date: new Date("2021-12-26"),
  });
  await Item.update({
    id: itemId5,
    date: new Date("2021-12-05"),
  });
  await Item.update({
    id: itemId6,
    date: new Date("2021-12-15"),
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
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    title: "Clean Gutters 1",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters 2",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters 3",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters 4",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters 5",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters 6",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: new Date("2021-12-06"),
  });
  await Item.update({
    id: itemId2,
    date: new Date("2021-12-02"),
  });
  await Item.update({
    id: itemId3,
    date: new Date("2021-12-17"),
  });
  await Item.update({
    id: itemId4,
    date: new Date("2021-12-26"),
  });
  await Item.update({
    id: itemId5,
    date: new Date("2021-12-05"),
  });

  await Item.update({
    id: itemId6,
    date: new Date("2021-12-15"),
  });

  const todos1 = await Todos.getAll({ propertyId });

  // If I now add a new task with a date of 2021-12-13,

  const itemId7 = await Item.create({
    title: "Clean Gutters 7",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  await Item.update({
    id: itemId7,
    date: new Date("2021-12-13"),
  });

  const item7 = await Item.get(itemId7);

  //console.log(item7);

  const toDos = await Todos.getAll({ propertyId });
  console.log(toDos);
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

it("add 6 tasks and get initial priority, then move", async () => {
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    title: "Clean Gutters 1",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters 2",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters 3",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters 4",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters 5",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters 6",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: new Date("2021-12-06"),
  });
  await Item.update({
    id: itemId2,
    date: new Date("2021-12-02"),
  });
  await Item.update({
    id: itemId3,
    date: new Date("2021-12-17"),
  });
  await Item.update({
    id: itemId4,
    date: new Date("2021-12-26"),
  });
  await Item.update({
    id: itemId5,
    date: new Date("2021-12-05"),
  });

  await Item.update({
    id: itemId6,
    date: new Date("2021-12-15"),
  });

  const todos1 = await Todos.getAll({ propertyId });

  expect(todos1[0]?.id).toBe(itemId2);
  expect(todos1[1]?.id).toBe(itemId5);
  expect(todos1[2]?.id).toBe(itemId1);
  expect(todos1[3]?.id).toBe(itemId6);
  expect(todos1[4]?.id).toBe(itemId3);
  expect(todos1[5]?.id).toBe(itemId4);

  // I now move item 6 up
  await Todos.moveUp({ itemId: itemId6 });
  let item6 = await Item.get(itemId6);
  expect(item6?.toDoPriority).toBe(7);
  let todos2 = await Todos.getAll({ propertyId });

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId5);
  expect(todos2[2]?.id).toBe(itemId6);
  expect(todos2[3]?.id).toBe(itemId1);
  expect(todos2[4]?.id).toBe(itemId3);
  expect(todos2[5]?.id).toBe(itemId4);

  // I now move item 6 up again
  await Todos.moveUp({ itemId: itemId6 });
  item6 = await Item.get(itemId6);
  expect(item6?.toDoPriority).toBe(9);
  todos2 = await Todos.getAll({ propertyId });

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId6);
  expect(todos2[2]?.id).toBe(itemId5);
  expect(todos2[3]?.id).toBe(itemId1);
  expect(todos2[4]?.id).toBe(itemId3);
  expect(todos2[5]?.id).toBe(itemId4);

  // I now move item 6 down
  await Todos.moveDown({ itemId: itemId6 });
  item6 = await Item.get(itemId6);
  expect(item6?.toDoPriority).toBe(5);
  todos2 = await Todos.getAll({ propertyId });

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId5);
  expect(todos2[2]?.id).toBe(itemId6);
  expect(todos2[3]?.id).toBe(itemId1);
  expect(todos2[4]?.id).toBe(itemId3);
  expect(todos2[5]?.id).toBe(itemId4);

  // I now move item 6 down again
  await Todos.moveDown({ itemId: itemId6 });
  item6 = await Item.get(itemId6);
  expect(item6?.toDoPriority).toBe(3);
  todos2 = await Todos.getAll({ propertyId });

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId5);
  expect(todos2[2]?.id).toBe(itemId1);
  expect(todos2[3]?.id).toBe(itemId6);
  expect(todos2[4]?.id).toBe(itemId3);
  expect(todos2[5]?.id).toBe(itemId4);
});

/*
Add 5 Tasks and get initial priority, 
set a middle todo as complete
check that it is removed from the list and first of completed list
*/

it("add 6 tasks and get initial priority, then set a middle as complete", async () => {
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    title: "Clean Gutters 1",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters 2",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters 3",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters 4",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters 5",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters 6",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: new Date("2021-12-06"),
  });
  await Item.update({
    id: itemId2,
    date: new Date("2021-12-02"),
  });
  await Item.update({
    id: itemId3,
    date: new Date("2021-12-17"),
  });
  await Item.update({
    id: itemId4,
    date: new Date("2021-12-26"),
  });
  await Item.update({
    id: itemId5,
    date: new Date("2021-12-05"),
  });

  await Item.update({
    id: itemId6,
    date: new Date("2021-12-15"),
  });

  const todos1 = await Todos.getAll({ propertyId });

  expect(todos1[0]?.id).toBe(itemId2);
  expect(todos1[1]?.id).toBe(itemId5);
  expect(todos1[2]?.id).toBe(itemId1);
  expect(todos1[3]?.id).toBe(itemId6);
  expect(todos1[4]?.id).toBe(itemId3);
  expect(todos1[5]?.id).toBe(itemId4);

  // I now mark item 6 as comeplete
  await Item.update({
    id: itemId6,
    status: ItemStatus.COMPLETED,
  });
  let item6 = await Item.get(itemId6);
  expect(item6?.status).toBe(ItemStatus.COMPLETED);
  let todos2 = await Todos.getAll({ propertyId });

  expect(todos2.length).toBe(5);

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId5);
  expect(todos2[2]?.id).toBe(itemId1);
  expect(todos2[3]?.id).toBe(itemId3);
  expect(todos2[4]?.id).toBe(itemId4);
});

/*
Add 5 Tasks and get initial priority, 
set a middle todo as recurring
set middle todo as complete
check that it is last on list and first of completed list
*/

it("add 6 tasks and get initial priority, then set a middle as recurring, then complete", async () => {
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    title: "Clean Gutters 1",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters 2",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters 3",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters 4",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters 5",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters 6",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: new Date("2021-12-06"),
  });
  await Item.update({
    id: itemId2,
    date: new Date("2021-12-02"),
  });
  await Item.update({
    id: itemId3,
    date: new Date("2021-12-17"),
  });
  await Item.update({
    id: itemId4,
    date: new Date("2021-12-26"),
  });
  await Item.update({
    id: itemId5,
    date: new Date("2021-12-05"),
  });

  await Item.update({
    id: itemId6,
    date: new Date("2021-12-15"),
    recurring: true,
  });

  const todos1 = await Todos.getAll({ propertyId });

  expect(todos1[0]?.id).toBe(itemId2);
  expect(todos1[1]?.id).toBe(itemId5);
  expect(todos1[2]?.id).toBe(itemId1);
  expect(todos1[3]?.id).toBe(itemId6);
  expect(todos1[4]?.id).toBe(itemId3);
  expect(todos1[5]?.id).toBe(itemId4);

  // I now mark item 6 as comeplete
  await Item.update({
    id: itemId6,
    status: ItemStatus.COMPLETED,
  });
  let item6 = await Item.get(itemId6);
  expect(item6?.status).toBe(ItemStatus.TODO);

  let todos2 = await Todos.getAll({ propertyId });
  console.log(todos2);
  expect(todos2.length).toBe(6);

  expect(todos2[0]?.id).toBe(itemId2);
  expect(todos2[1]?.id).toBe(itemId5);
  expect(todos2[2]?.id).toBe(itemId1);
  expect(todos2[3]?.id).toBe(itemId3);
  expect(todos2[4]?.id).toBe(itemId4);
  expect(todos2[5]?.id).toBe(itemId6);

  const completedTodos = await Todos.getAllCompleted({ propertyId, range: 7 });
  expect(completedTodos.length).toBe(1);

  expect(completedTodos[0]?.id).toBe(itemId6);
});

/*
Add 5 complete Tasks for dates in last week 
set a middle todo as recurring
set middle todo as complete
check that it is last on list and first of completed list
*/

it("add 6 tasks and set as completed in last week, then set new as recurring, then complete", async () => {
  let name = (Math.random() + 1).toString(36).substring(7);
  let domain = (Math.random() + 1).toString(36).substring(7);
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: `${name}@${domain}.com`,
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
    title: "Clean Gutters 1",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const itemId2 = await Item.create({
    title: "Clean Gutters 2",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId3 = await Item.create({
    title: "Clean Gutters 3",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId4 = await Item.create({
    title: "Clean Gutters 4",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId5 = await Item.create({
    title: "Clean Gutters 5",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });
  const itemId6 = await Item.create({
    title: "Clean Gutters 6",
    category: ItemCategory.JOB,
    status: ItemStatus.COMPLETED,
    homeownerId: userId,
    propertyId: propertyId,
  });

  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() - 1);
  // give them dates in rnadom order
  await Item.update({
    id: itemId1,
    date: dateObj,
  });
  dateObj.setDate(dateObj.getDate() - 1);
  await Item.update({
    id: itemId2,
    date: dateObj,
  });
  dateObj.setDate(dateObj.getDate() - 1);
  await Item.update({
    id: itemId3,
    date: dateObj,
  });
  dateObj.setDate(dateObj.getDate() - 1);
  await Item.update({
    id: itemId4,
    date: dateObj,
  });
  dateObj.setDate(dateObj.getDate() - 1);
  await Item.update({
    id: itemId5,
    date: dateObj,
  });
  dateObj.setDate(dateObj.getDate() - 1);
  await Item.update({
    id: itemId6,
    date: dateObj,
  });

  const item6 = await Item.get(itemId6);

  console.log("item6", item6);

  const completed1 = await Todos.getAllCompleted({ propertyId, range: 14 });

  console.log("completed tasks 1", completed1);

  expect(completed1[0]?.id).toBe(itemId1);
  expect(completed1[1]?.id).toBe(itemId2);
  expect(completed1[2]?.id).toBe(itemId3);
  expect(completed1[3]?.id).toBe(itemId4);
  expect(completed1[4]?.id).toBe(itemId5);
  expect(completed1[5]?.id).toBe(itemId6);

  // I now add item 7 todo, make recurring , and complete
  const itemId7 = await Item.create({
    title: "Clean Gutters 7",
    category: ItemCategory.JOB,
    status: ItemStatus.TODO,
    homeownerId: userId,
    propertyId: propertyId,
  });

  await Item.update({
    id: itemId7,
    date: new Date("2021-12-13"),
    recurring: true,
  });

  await Item.update({
    id: itemId7,
    status: ItemStatus.COMPLETED,
  });

  let completed2 = await Todos.getAllCompleted({ propertyId, range: 14 });

  console.log("completed tasks 2", completed2);
  expect(completed2.length).toBe(7);

  expect(completed2[0]?.id).toBe(itemId7);
  expect(completed2[1]?.id).toBe(itemId1);
  expect(completed2[2]?.id).toBe(itemId2);
  expect(completed2[3]?.id).toBe(itemId3);
  expect(completed2[4]?.id).toBe(itemId4);
  expect(completed2[5]?.id).toBe(itemId5);
  expect(completed2[6]?.id).toBe(itemId6);
});
