import { type Config } from "drizzle-kit";
import { db } from "./client";
import { env } from "../env.mjs";

export const config = {
  schema: "../core/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;

export * as schema from "./schema";

export { db };
