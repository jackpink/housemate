import { createClient } from "@libsql/client";
// import { schema, env, drizzle } from "../../../core/db";
import { env } from "../../../core/env.mjs";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
