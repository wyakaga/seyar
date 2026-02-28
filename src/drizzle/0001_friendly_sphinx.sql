CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`time_cost` real NOT NULL,
	`status` text NOT NULL,
	`review_status` text DEFAULT 'pending',
	`unlocked_at` integer,
	`purchased_at` integer,
	`created_at` integer
);
