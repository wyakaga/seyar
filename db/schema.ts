import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const userSettings = sqliteTable("user_settings", {
	id: integer("id").primaryKey().default(1),
	salary: real("salary").notNull(),
	workDaysPerMonth: integer("work_days_per_month").default(20),
	workHoursPerDay: integer("work_hours_per_day").default(8),
	hourlyRate: real("hourly_rate").notNull(),
	currency: text("currency").default("USD"),
	isOnboarded: integer("is_onboarded", { mode: "boolean" }).default(false),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date()),
});

export type UserSetting = typeof userSettings.$inferSelect;
