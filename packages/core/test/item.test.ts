import { expect, it } from "vitest";
import { Item } from "../homeowner/items/item";
import { ItemCategory, ItemStatus } from "../db/schema";
import { User } from "../homeowner/user";
import { Property } from "../homeowner/property";

it("create item", async () => {
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
  const item = await Item.get(itemId);
  expect(item).not.toBeNull();
});
