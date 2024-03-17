"use server";

import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { z } from "zod";
import { env } from "~/env";
import { rateLimiter } from "~/server/api/ratelimiter";
import { db } from "~/server/db";
import { property } from "~/server/db/schema";

function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  object: T,
): key is keyof T {
  return key in object;
}

type IComponentName = {
  text: string;
};

type IAddressComponent = {
  componentType: string;
  componentName: IComponentName;
};

interface IGoogleApiData {
  result: IGoogleApiResult;
}

interface IGoogleApiResult {
  address: IGoogleApiAddress;
}

interface IGoogleApiAddress {
  addressComponents: IAddressComponent[];
}

const googleAPINameMappings = {
  subpremise: "apartment",
  street_number: "streetNumber",
  route: "street",
  country: "country",
  locality: "suburb",
  administrative_area_level_1: "state",
  postal_code: "postcode",
};

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
    street: "",
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

async function rateLimit() {
  const { userId } = auth();
  if (userId) {
    const { success } = await rateLimiter.limit(userId);
    return success;
  } else {
    return false;
  }
}

// test edge case that user id doesnt exist

export async function createProperty({
  apartment,
  streetNumber,
  streetName,
  suburb,
  state,
  postcode,
  country,
  homeownerId,
}: {
  apartment: string | undefined;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  homeownerId: string | undefined;
}) {
  const success = await rateLimit();
  if (!success) {
    throw new Error("Too many requests");
  }
  if (!homeownerId) {
    throw new Error("No homeownerId");
  }

  const [created] = await db
    .insert(property)
    .values({
      apartment: apartment,
      streetNumber: streetNumber,
      streetName: streetName,
      suburb: suburb,
      state: state,
      postcode: postcode,
      country: country,
      homeownerId: homeownerId,
    })
    .returning({ id: property.id });
  if (!created) {
    throw new Error("Property created but id not returned");
  }
  return created;
}
