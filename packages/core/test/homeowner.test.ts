import { expect, it } from "vitest";
import { Item } from "../homeowner/items/item";
import { User } from "../homeowner/user";
import { Property } from "../homeowner/property";
import { TimeSpan, createDate } from "oslo";

it("create a user", async () => {
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
});
it("verify a users email verification code", async () => {
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

  const code = "123456";
  const createdCode = await User.createEmailVerificationCode({
    userId,
    code,
    expirationDate: createDate(new TimeSpan(20, "s")),
  });
  expect(createdCode).toEqual(code);
  const result = await User.verifyEmailVerificationCode({
    userId,
    code,
  });
  expect(result).toBeTruthy();
  const failedResult = await User.verifyEmailVerificationCode({
    userId,
    code: "654321",
  });
  expect(failedResult).toBeFalsy();
  await new Promise((resolve) => setTimeout(resolve, 20));
  const expiredResult = await User.verifyEmailVerificationCode({
    userId,
    code,
  });
  expect(expiredResult).toBeFalsy();
});
