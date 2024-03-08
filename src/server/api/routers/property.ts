import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimiter } from "~/server/api/ratelimiter";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { property } from "~/server/db/schema";

export const propertyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        apartment: z.string().min(1).optional(),
        streetNumber: z.string().min(1).optional(),
        streetName: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        postcode: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        homeownerId: z.string().min(1).optional(),
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
