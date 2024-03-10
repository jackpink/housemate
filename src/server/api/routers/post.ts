import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimiter } from "~/server/api/ratelimiter";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}, you are ${ctx.user?.firstName}!`,
      };
    }),
});
