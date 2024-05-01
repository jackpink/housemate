export * as Property from "./property";
import { property } from "db/schema";
import { db, schema } from "../db";
import { eq, InferSelectModel } from "drizzle-orm";

export async function create({
  apartment,
  streetNumber,
  streetName,
  suburb,
  state,
  postcode,
  country,
  homeownerId,
}: {
  apartment?: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  homeownerId: string;
}) {
  console.log(
    "Try to create property",
    streetNumber,
    streetName,
    suburb,
    state,
    postcode,
    country,
    homeownerId,
  );
  const [created] = await db
    .insert(schema.property)
    .values({
      apartment,
      streetNumber,
      streetName,
      suburb,
      state,
      postcode,
      country,
      homeownerId,
    })
    .returning({ id: schema.property.id });
  if (!created) throw new Error("Failed to create property");
  return created.id;
}

export async function getByHomeownerId(homeownerId: string) {
  const properties = await db
    .select()
    .from(schema.property)
    .where(eq(schema.property.homeownerId, homeownerId));
  return properties;
}

type Property = InferSelectModel<typeof property>;

export const concatAddress = (property: Property) => {
  let address =
    property.streetNumber +
    " " +
    property.streetName +
    ", " +
    property.suburb +
    ", " +
    property.state +
    ", " +
    property.country;
  if (!!property.apartment) {
    // add apartment number in front /

    address = property.apartment + " / " + address;
  }
  return address;
};
