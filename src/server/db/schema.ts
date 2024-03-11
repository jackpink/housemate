// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";

import {
  AnyPgColumn,
  pgTable,
  serial,
  text,
  time,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const homeowner = pgTable("homeowner", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  authId: text("auth_id"),
  createdAt: time("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: time("updatedAt").defaultNow(),
});

export const property = pgTable("property", {
  id: uuid("id").primaryKey().defaultRandom(),
  apartment: text("aparment"),
  streetNumber: text("street_number"),
  streetName: text("street_name"),
  suburb: text("suburb"),
  state: text("state"),
  postcode: text("postcode"),
  country: text("country"),
  homeownerId: text("homeowner_id"),
  createdAt: time("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: time("updatedAt").defaultNow(),
});

export const userRelations = relations(homeowner, ({ many }) => ({
  properties: many(property),
}));

export const propertyRelations = relations(property, ({ one }) => ({
  homeowner: one(homeowner, {
    fields: [property.homeownerId],
    references: [homeowner.id],
  }),
}));
