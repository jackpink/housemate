import { InferSelectModel } from "drizzle-orm";
import { property } from "~/server/db/schema";

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
