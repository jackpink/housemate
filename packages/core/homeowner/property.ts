export * as Property from "./property";
import axios from "axios";
import { property } from "../db/schema";
import { db } from "../db";
import { eq, InferSelectModel } from "drizzle-orm";
import { env } from "../env.mjs";

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
    .insert(property)
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
    .returning({ id: property.id });
  if (!created) throw new Error("Failed to create property");
  return created.id;
}

export async function getByHomeownerId(homeownerId: string) {
  const properties = await db
    .select()
    .from(property)
    .where(eq(property.homeownerId, homeownerId));
  return properties;
}

export async function get(id: string) {
  const [propertyObj] = await db
    .select()
    .from(property)
    .where(eq(property.id, id));
  return propertyObj;
}

export type Property = InferSelectModel<typeof property>;

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

export interface IAddress {
  apartment: string | null;
  streetNumber: string;
  streetName: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
}

function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  object: T,
): key is keyof T {
  return key in object;
}
const googleAPINameMappings = {
  subpremise: "apartment",
  street_number: "streetNumber",
  route: "streetName",
  country: "country",
  locality: "suburb",
  administrative_area_level_1: "state",
  postal_code: "postcode",
};

type IComponentName = {
  text: string;
};

type IAddressComponent = {
  componentType: string;
  componentName: IComponentName;
};

interface IGoogleApiAddress {
  addressComponents: IAddressComponent[];
}

interface IGoogleApiResult {
  address: IGoogleApiAddress;
}
interface IGoogleApiData {
  result: IGoogleApiResult;
}

export async function getValidAddress({
  addressSearchString,
}: {
  addressSearchString: string;
}) {
  const client = axios.create();
  const googleAddressValidationEndpoint =
    "https://addressvalidation.googleapis.com/v1:validateAddress?key=" +
    env.GOOGLE_MAPS_API_KEY;
  const requestBody = {
    address: {
      regionCode: "AU",
      addressLines: [addressSearchString],
    },
  };
  console.log("requestBody", requestBody);

  const response = await client.post(
    googleAddressValidationEndpoint,
    requestBody,
  );
  const AddressObj: IAddress = {
    apartment: null,
    streetNumber: "",
    streetName: "",
    suburb: "",
    postcode: "",
    state: "",
    country: "",
  };
  console.log("response", response);
  const returnData = response.data as IGoogleApiData;
  console.log("returnData", returnData);
  const addressComponents = returnData.result.address.addressComponents;
  console.log("addressComponents", addressComponents);
  for (const addressComponent of addressComponents) {
    const componentType = addressComponent.componentType;
    // check that the componentType is corect
    if (isKeyOfObject(componentType, googleAPINameMappings)) {
      const field = googleAPINameMappings[componentType];
      const value = addressComponent.componentName.text;
      console.log("field", field, "value", value);
      if (isKeyOfObject(field, AddressObj)) AddressObj[field] = value;
    }
  }
  console.log("AddressObj", AddressObj);
  return AddressObj;
}
