// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `housemate_${name}`);

export const users = createTable("homeowner", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  firstName: varchar("name", { length: 256 }),
  lastName: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const properties = createTable("property", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  apartment: varchar("name", { length: 256 }),
  streetNumber: varchar("address", { length: 256 }),
  streetName: varchar("address", { length: 256 }),
  suburb: varchar("address", { length: 256 }),
  state: varchar("address", { length: 256 }),
  postcode: varchar("address", { length: 256 }),
  country: varchar("address", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
