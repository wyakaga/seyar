CREATE TABLE `user_settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`salary` real NOT NULL,
	`work_days_per_month` integer DEFAULT 20,
	`work_hours_per_day` integer DEFAULT 8,
	`hourly_rate` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`is_onboarded` integer DEFAULT false,
	`updated_at` integer
);
