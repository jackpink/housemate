export * as User from "./user";

export async function create({
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
  console.log("Try to create user", firstName, lastName, email, password);
}
