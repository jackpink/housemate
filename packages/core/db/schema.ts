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
import { type AdapterAccount } from "next-auth/adapters";

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
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
  warrantyAlert: integer("warranty_alert").notNull().default(30),
  taskReminder: integer("task_reminder").notNull().default(7),
  taskOverdueReminder: integer("task_overdue_reminder").notNull().default(7),
});

export const homeownerAccounts = sqliteTable(
  "homeowner_account",
  {
    userId: text("userId")
      .notNull()
      .references(() => homeownerUsers.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const homeownerSessions = sqliteTable("homeowner_session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => homeownerUsers.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const homeownerVerificationTokens = sqliteTable(
  "homeowner_verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

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

export const item = sqliteTable("item", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["completed", "todo"] }).notNull(),
  category: text("category", { enum: ["job", "product", "issue"] }).notNull(),
  recurring: integer("recurring", { mode: "boolean" }).default(false),
  recurringSchedule: text("recurringSchedule").default("yearly"),
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

export const pastItemDate = sqliteTable("past_item_date", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text("itemId").references(() => item.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
});

export const itemRelations = relations(item, ({ one, many }) => ({
  filesRootFolder: one(itemFilesFolder, {
    fields: [item.filesRootFolderId],
    references: [itemFilesFolder.id],
  }),
  alerts: many(homeownerAlert),
  pastDates: many(pastItemDate),
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
