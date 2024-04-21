import { type Config } from "drizzle-kit";

import { env } from "../core/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["trade-site_*"],
} satisfies Config;
