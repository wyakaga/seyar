import { useMemo } from "react";
import { InferSelectModel } from "drizzle-orm";
import { items as itemsTable, userSettings } from "@/db/schema";

type Item = InferSelectModel<typeof itemsTable>;
type Settings = InferSelectModel<typeof userSettings>;

export const useRemainingLife = (items: Item[], settings: Settings | undefined) => {
	const remainingLife = useMemo(() => {
		if (!settings) return "0.0";

		const monthlySalary = settings.salary || 0;
		const hourlyWage = settings.hourlyRate || 0;

		if (hourlyWage === 0) return "0.0";

		const totalLifeHours = monthlySalary / hourlyWage;

		const usedLifeHours = items.reduce((acc, item) => {
			if (item.status === "anchored" || item.status === "purchased") {
				return acc + item.timeCost;
			}
			return acc;
		}, 0);

		const remaining = totalLifeHours - usedLifeHours;
		return remaining.toFixed(1);
	}, [items, settings]);

	return remainingLife;
};
