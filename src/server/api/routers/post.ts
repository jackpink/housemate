import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rateLimiter } from "~/server/api/ratelimiter";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}, you are ${ctx.user?.firstName}!`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Check rate limit
      const { success } = await rateLimiter.limit(ctx.auth.userId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),
});
