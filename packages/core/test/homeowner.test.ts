import { expect, it } from "vitest";
import { Item } from "../homeowner/items/item";
import { User } from "../homeowner/user";
import { Property } from "../homeowner/property";

it("create a user", async () => {
  // create a new user
  const userId = await User.create({
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "password",
  });
  expect(userId).toBeDefined();
  const user = await User.getById(userId);
  expect(user).not.toBeNull();
});
