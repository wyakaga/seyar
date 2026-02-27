import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { and, desc, eq, or, sql } from "drizzle-orm";

import { Item, items as itemsTable, userSettings } from "@/db/schema";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import GhostIcon from "@/components/icons/GhostIcon";
import WaveIcon from "@/components/icons/WaveIcon";
import BearingCard from "@/components/bearing/BearingCard";
import { formatCompactCurrency } from "@/lib/currency";

export default function Bearing() {
	const [totalReclaimed, setTotalReclaimed] = useState(0);
	const [ghostHour, setGhostHour] = useState(0);
	const [regretRate, setRegretRate] = useState(0);
	const [items, setItems] = useState<Item[]>([]);
	const [currency, setCurrency] = useState<string | null>(null);
	const [workSchedule, setWorkSchedule] = useState({
		hoursPerDay: 8,
		daysPerMonth: 20,
	});

	const loadData = useCallback(async () => {
		try {
			const [reclaimed, ghostResult, totalPurchasedResult, historyResult, settingsResult] =
				await Promise.all([
					db
						.select({ totalReclaimed: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number) })
						.from(itemsTable)
						.where(eq(itemsTable.status, "rejected")),

					db
						.select({ totalGhost: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number) })
						.from(itemsTable)
						.where(
							and(eq(itemsTable.status, "purchased"), eq(itemsTable.reviewStatus, "regretted"))
						),

					db
						.select({
							totalPurchased: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number),
						})
						.from(itemsTable)
						.where(eq(itemsTable.status, "purchased")),
					db
						.select()
						.from(itemsTable)
						.where(
							or(
								and(eq(itemsTable.status, "purchased"), eq(itemsTable.reviewStatus, "regretted")),
								eq(itemsTable.status, "rejected")
							)
						)
						.orderBy(desc(itemsTable.createdAt)),
					db.select().from(userSettings).limit(1),
				]);

			setTotalReclaimed(reclaimed[0].totalReclaimed || 0);
			setGhostHour(ghostResult[0].totalGhost || 0);
			setItems(historyResult);

			const settings = settingsResult[0];

			if (!settings) return;

			setCurrency(settings.currency);
			setWorkSchedule({
				hoursPerDay: settings.workHoursPerDay || 8,
				daysPerMonth: settings.workDaysPerMonth || 20,
			});

			const totalPurchasedHours = totalPurchasedResult[0]?.totalPurchased || 0;

			let totalRegretRate = 0;

			if (totalPurchasedHours > 0 && ghostResult[0].totalGhost > 0) {
				totalRegretRate = (ghostResult[0].totalGhost / totalPurchasedHours) * 100;
			}

			setRegretRate(totalRegretRate);
		} catch (e) {
			console.log("Error fetching items", e);
		}
	}, []);

	const getGhostText = (ghostHours: number, hoursPerDay: number, daysPerMonth: number) => {
		if (ghostHours === 0) return "You haven't wasted any time. Great job!";

		const hoursPerWeek = hoursPerDay * (daysPerMonth / 4);
		const hoursPerMonth = hoursPerDay * daysPerMonth;

		if (ghostHours >= hoursPerMonth) {
			const months = (ghostHours / hoursPerMonth).toFixed(1);
			return `You worked ${months === "1.0" ? "a full month" : `${months} months`} for things you hate`;
		}

		if (ghostHours >= hoursPerWeek) {
			const weeks = (ghostHours / hoursPerWeek).toFixed(1);
			return `You worked ${weeks === "1.0" ? "a full week" : `${weeks} weeks`} for things you hate`;
		}

		if (ghostHours >= hoursPerDay) {
			const days = (ghostHours / hoursPerDay).toFixed(1);
			return `You worked ${days === "1.0" ? "a full day" : `${days} days`} for things you hate`;
		}

		return `You worked ${ghostHours.toFixed(1)} hours for things you hate`;
	};

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

	return (
		<View style={{ flex: 1 }} className="flex flex-col gap-y-12 flex-1 pt-9 px-3">
			<Text className="text-foreground text-3xl font-bold font-jakarta">Bearing</Text>

			<View className="flex flex-col justify-items items-center gap-y-3 p-4 bg-secondary rounded-lg">
				<Text className="font-jakarta font-bold text-5xl text-accent-success">{`${totalReclaimed.toFixed(1)} hours`}</Text>

				<Text className="font-jakarta text-foreground">life reclaimed</Text>
			</View>

			<View className="flex flex-row gap-3">
				<View className="flex flex-1 flex-col gap-y-6 p-2 rounded-lg bg-secondary items-center">
					<View className="flex flex-row gap-x-3 items-center justify-center">
						<GhostIcon />

						<Text className="font-jakarta font-bold text-xl text-foreground">Ghost hours</Text>
					</View>

					<Text className="font-jakarta font-bold text-3xl text-foreground">{`${ghostHour.toFixed(1)} hours`}</Text>

					<Text className="font-jakarta text-xs text-foreground text-center">
						{getGhostText(ghostHour, workSchedule.hoursPerDay, workSchedule.daysPerMonth)}
					</Text>
				</View>

				<View className="flex flex-1 flex-col gap-y-6 p-2 rounded-lg bg-secondary items-center">
					<View className="flex flex-row gap-x-3 items-center justify-center">
						<WaveIcon />

						<Text className="font-jakarta font-bold text-xl text-foreground">Regret rate</Text>
					</View>

					<Text className="font-jakarta font-bold text-3xl text-foreground">{`${regretRate.toFixed(1)}%`}</Text>

					<Text className="font-jakarta text-xs text-foreground text-center">
						Percentage of labor spent in vain
					</Text>
				</View>
			</View>

			<View className="flex flex-col flex-1 gap-y-5">
				<Text className="font-jakarta font-bold text-3xl">History</Text>

				{items.length > 0 ? (
					<FlatList
						data={items}
						keyExtractor={(item) => item.id}
						contentContainerClassName="gap-y-5 pb-5"
						renderItem={({ item }) => (
							<BearingCard
								name={item.name}
								status={item.status}
								price={formatCompactCurrency(item.price, currency)}
								timeCost={item.timeCost}
							/>
						)}
					/>
				) : (
					<Text className="text-muted-foreground text-center text-xs font-jakarta">
						Your past decisions will appear here. Reject or buy anchored items to start building
						your history.
					</Text>
				)}
			</View>
		</View>
	);
}
