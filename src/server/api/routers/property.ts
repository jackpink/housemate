import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimiter } from "~/server/api/ratelimiter";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { property } from "~/server/db/schema";
import axios from "axios";
import { env } from "~/env";

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

export const propertyRouter = createTRPCRouter({
  getValidAddress: protectedProcedure
    .input(z.object({ addressSearchString: z.string() }))
    .mutation(async ({ input }) => {
      const client = axios.create();
      const googleAddressValidationEndpoint =
        "https://addressvalidation.googleapis.com/v1:validateAddress?key=" +
        env.GOOGLE_MAPS_API_KEY;
      const requestBody = {
        address: {
          regionCode: "AU",
          addressLines: [input.addressSearchString],
        },
      };
      console.log("requestBody", requestBody);
      try {
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
      } catch (error) {
        console.error("Error getting address", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        apartment: z.string().min(1).optional(),
        streetNumber: z.string().min(1),
        streetName: z.string().min(1),
        suburb: z.string().min(1),
        state: z.string().min(1),
        postcode: z.string().min(1),
        country: z.string().min(1),
        homeownerId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check rate limit
      const { success } = await rateLimiter.limit(ctx.auth.userId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(property).values({
        apartment: input.apartment,
        streetNumber: input.streetNumber,
        streetName: input.streetName,
        suburb: input.suburb,
        state: input.state,
        postcode: input.postcode,
        country: input.country,
        homeownerId: input.homeownerId,
      });
    }),
});
