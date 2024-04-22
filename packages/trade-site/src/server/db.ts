import { createClient } from "@libsql/client";
import { schema, env, drizzle } from "../../../core/db";

const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
