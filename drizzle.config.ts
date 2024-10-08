import { defineConfig } from "drizzle-kit";
import { env } from "./packages/core/env.mjs";

//export default config;
const config = defineConfig({
  dialect: "sqlite",
  schema: "packages/core/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});

export default config;
