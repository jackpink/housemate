import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimiter } from "~/server/api/ratelimiter";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  testProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: testProcedure
    .input(z.object({ text: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}, you are ${ctx.user?.firstName}!`,
      };
    }),
});
