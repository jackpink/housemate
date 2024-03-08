// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";

import { pgTable, serial, text, time, uuid } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const homeowner = pgTable("homeowner", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("name"),
  lastName: text("name"),
  email: text("email"),

  createdAt: time("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: time("updatedAt").defaultNow(),
});

export const property = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartment: text("name"),
  streetNumber: text("address"),
  streetName: text("address"),
  suburb: text("address"),
  state: text("address"),
  postcode: text("address"),
  country: text("address"),
  homeownerId: uuid("homeowner_id").references(() => homeowner.id),
  createdAt: time("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: time("updatedAt").defaultNow(),
});
