import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  AnySQLiteColumn,
  foreignKey,
} from "drizzle-orm/sqlite-core";
import email from "next-auth/providers/email";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const homeownerUsers = sqliteTable("homeowner_user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  password: text("password").notNull(),
  warrantyAlert: integer("warranty_alert").notNull().default(30),
  taskReminder: integer("task_reminder").notNull().default(7),
  taskOverdueReminder: integer("task_overdue_reminder").notNull().default(7),
});

export const emailVerificationCode = sqliteTable("email_verification_code", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  code: text("code").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => homeownerUsers.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => homeownerUsers.id),
  expiresAt: integer("expires_at").notNull(),
});

export const property = sqliteTable("property", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  apartment: text("apartment"),
  streetNumber: text("street_number").notNull(),
  streetName: text("street_name").notNull(),
  suburb: text("suburb").notNull(),
  state: text("state").notNull(),
  postcode: text("postcode").notNull(),
  country: text("country").notNull(),
  homeownerId: text("homeownerId").references(() => homeownerUsers.id, {
    onDelete: "cascade",
  }),
});

export enum ItemCategory {
  JOB = "job",
  PRODUCT = "product",
  ISSUE = "issue",
}

export enum ItemStatus {
  COMPLETED = "completed",
  TODO = "todo",
}

export enum RecurringSchedule {
  WEEKLY = "weekly",
  FORTNIGHTLY = "fortnightly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  HALF_YEARLY = "half-yearly",
  YEARLY = "yearly",
}

export const item = sqliteTable("item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["completed", "todo"] }).notNull(),
  category: text("category", { enum: ["job", "product", "issue"] }).notNull(),
  recurring: integer("recurring", { mode: "boolean" }).default(false),
  recurringSchedule: text("recurringSchedule", {
    enum: Object.values(RecurringSchedule).map((value: any) => `${value}`) as [
      string,
      ...string[],
    ],
  })
    .default("yearly")
    .notNull(),
  date: text("date")
    .notNull()
    .default(sql`(current_date)`),
  toDoPriority: integer("toDoPriority"),
  homeownerId: text("homeownerId").references(() => homeownerUsers.id, {
    onDelete: "cascade",
  }),
  propertyId: text("propertyId")
    .references(() => property.id, {
      onDelete: "cascade",
    })
    .notNull(),
  warrantyEndDate: text("warrantyEndDate"),
  filesRootFolderId: text("filesFolderId"),
});

export const itemRelations = relations(item, ({ one, many }) => ({
  filesRootFolder: one(itemFilesFolder, {
    fields: [item.filesRootFolderId],
    references: [itemFilesFolder.id],
  }),
  alerts: many(homeownerAlert),
  pastDates: many(itemPastDate),
}));

export const itemPastDate = sqliteTable("item_past_date", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text("itemId")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  propertyId: text("propertyId")
    .notNull()
    .references(() => property.id, {
      onDelete: "cascade",
    }),
});

export const itemPastDateRelations = relations(itemPastDate, ({ one }) => ({
  item: one(item, {
    fields: [itemPastDate.itemId],
    references: [item.id],
  }),
}));

export const itemFilesFolder = sqliteTable(
  "item_files_folder",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    itemId: text("item_id").references(() => item.id, {
      onDelete: "cascade",
    }),
    parentId: text("parent_id"),
  },
  // (folder) => {
  //   return {
  //     parentReference: foreignKey({
  //       columns: [folder.parentId],
  //       foreignColumns: [folder.id],
  //       name: "parent_fk",
  //     }),
  //   };
  // },
);

export const itemFilesFolderRelations = relations(
  itemFilesFolder,
  ({ many, one }) => ({
    files: many(itemFile, {
      relationName: "files",
    }),
    folders: many(itemFilesFolder, {
      relationName: "folders",
    }),
    folder: one(itemFilesFolder, {
      fields: [itemFilesFolder.parentId],
      references: [itemFilesFolder.id],
      relationName: "folders",
    }),
  }),
);

export const itemFile = sqliteTable("item_file", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  key: text("key").notNull(),
  type: text("type").notNull(),
  bucket: text("bucket").notNull(),
  folderId: text("folderId")
    .notNull()
    .references(() => itemFilesFolder.id, {
      onDelete: "cascade",
    }),
});

export const itemFileRelations = relations(itemFile, ({ one }) => ({
  folder: one(itemFilesFolder, {
    fields: [itemFile.folderId],
    references: [itemFilesFolder.id],
    relationName: "files",
  }),
}));

export const homeownerAlert = sqliteTable("homeowner_alert", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date")
    .notNull()
    .default(sql`(current_date)`),
  homeownerId: text("homeownerId")
    .notNull()
    .references(() => homeownerUsers.id, { onDelete: "cascade" }),
  propertyId: text("propertyId")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  viewed: integer("viewed", { mode: "boolean" }).notNull().default(false),
  itemId: text("itemId").references(() => item.id),
});
