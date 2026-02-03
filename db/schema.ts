import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid";

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

export const items = sqliteTable("items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: text("name").notNull(),
	price: real("price").notNull(),
	timeCost: real("time_cost").notNull(),
	status: text("status", {
		enum: ["anchored", "purchased", "rejected"],
	}).notNull(),
	reviewStatus: text("review_status", {
		enum: ["pending", "loved", "regretted"],
	}).default("pending"),
	unlockedAt: integer("unlocked_at", { mode: "timestamp" }),
	purchasedAt: integer("purchased_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type UserSetting = typeof userSettings.$inferSelect;
export type Item = typeof items.$inferSelect;
