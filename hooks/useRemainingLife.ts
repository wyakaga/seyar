import { useCallback, useEffect, useState } from "react";
import { InferSelectModel, sql } from "drizzle-orm";
import { items as itemsTable, userSettings } from "@/db/schema";
import { db } from "@/db/client";
import { useFocusEffect } from "expo-router";

type Settings = InferSelectModel<typeof userSettings>;

export const useRemainingLife = (_items: any[], settings: Settings | undefined) => {
	const [remainingLife, setRemainingLife] = useState("0.0");

	const calculate = useCallback(async () => {
		if (!settings) {
			setRemainingLife("0.0");
			return;
		}

		const monthlySalary = settings.salary || 0;
		const hourlyWage = settings.hourlyRate || 0;

		if (hourlyWage === 0) {
			setRemainingLife("0.0");
			return;
		}

		const totalLifeHours = monthlySalary / hourlyWage;

		const result = await db
			.select({
				totalUsed: sql<number>`COALESCE(SUM(${itemsTable.timeCost}), 0)`.mapWith(Number),
			})
			.from(itemsTable)
			.where(
				sql`${itemsTable.status} IN ('anchored', 'purchased')`
			);

		const usedLifeHours = result[0]?.totalUsed ?? 0;
		const remaining = totalLifeHours - usedLifeHours;
		setRemainingLife(remaining.toFixed(1));
	}, [settings]);

	useFocusEffect(
		useCallback(() => {
			calculate();
		}, [calculate]),
	);

	return remainingLife;
};
