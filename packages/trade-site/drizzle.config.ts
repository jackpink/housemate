import { type Config } from "drizzle-kit";

import { env } from "../../stacks/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["trade-site_*"],
} satisfies Config;
