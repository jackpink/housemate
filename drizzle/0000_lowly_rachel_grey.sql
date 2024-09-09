CREATE TABLE `email_verification_code` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `homeowner_alert` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text DEFAULT (current_date) NOT NULL,
	`homeownerId` text NOT NULL,
	`propertyId` text NOT NULL,
	`viewed` integer DEFAULT false NOT NULL,
	`itemId` text,
	FOREIGN KEY (`homeownerId`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`propertyId`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `homeowner_user` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`password` text NOT NULL,
	`deleted` integer DEFAULT false,
	`warranty_alert` integer DEFAULT 30 NOT NULL,
	`task_reminder` integer DEFAULT 7 NOT NULL,
	`task_overdue_reminder` integer DEFAULT 7 NOT NULL,
	`storage_used` integer DEFAULT 0 NOT NULL,
	`storage_limit` integer DEFAULT 1000000000 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`category` text NOT NULL,
	`recurring` integer DEFAULT false,
	`recurringSchedule` text DEFAULT 'yearly' NOT NULL,
	`date` text DEFAULT (current_date) NOT NULL,
	`toDoPriority` integer,
	`homeownerId` text,
	`propertyId` text NOT NULL,
	`warrantyEndDate` text,
	`filesFolderId` text,
	`commonTaskId` text,
	`deleted` integer DEFAULT false,
	FOREIGN KEY (`homeownerId`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`propertyId`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `item_file` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`key` text NOT NULL,
	`type` text NOT NULL,
	`bucket` text NOT NULL,
	`deleted` integer DEFAULT false,
	`folderId` text NOT NULL,
	FOREIGN KEY (`folderId`) REFERENCES `item_files_folder`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `item_files_folder` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`item_id` text,
	`parent_id` text,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `item_past_date` (
	`id` text PRIMARY KEY NOT NULL,
	`itemId` text NOT NULL,
	`date` text NOT NULL,
	`propertyId` text NOT NULL,
	FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`propertyId`) REFERENCES `property`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `password_reset_token` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property` (
	`id` text PRIMARY KEY NOT NULL,
	`apartment` text,
	`street_number` text NOT NULL,
	`street_name` text NOT NULL,
	`suburb` text NOT NULL,
	`state` text NOT NULL,
	`postcode` text NOT NULL,
	`country` text NOT NULL,
	`deleted` integer DEFAULT false,
	`homeownerId` text,
	FOREIGN KEY (`homeownerId`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `homeowner_user`(`id`) ON UPDATE no action ON DELETE no action
);
