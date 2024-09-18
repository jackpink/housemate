DROP INDEX IF EXISTS `homeowner_id_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `property_id_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `item_id_idx`;--> statement-breakpoint
CREATE INDEX `item_homeowner_id_idx` ON `item` (`homeownerId`);--> statement-breakpoint
CREATE INDEX `item_property_id_idx` ON `item` (`propertyId`);--> statement-breakpoint
CREATE INDEX `item_past_date_item_id_idx` ON `item_past_date` (`itemId`);--> statement-breakpoint
CREATE INDEX `property_homeowner_id_idx` ON `property` (`homeownerId`);