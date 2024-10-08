import { defineConfig } from "drizzle-kit";
import { db, client } from "./client";
import { env } from "../env.mjs";

export const config = defineConfig({
  dialect: "sqlite",
  schema: "../core/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});

export * as schema from "./schema";

export { db, client };
