import { useCallback, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { and, desc, eq, InferSelectModel, lte } from "drizzle-orm";

import { db } from "@/db/client";
import HistoryCard from "@/components/home/HistoryCard";
import CogIcon from "@/components/icons/CogIcon";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import { items as itemsTable, userSettings } from "@/db/schema";
import CheckInBottomSheet from "@/components/home/CheckInBottomSheet";

type Item = InferSelectModel<typeof itemsTable>;

export default function Index() {
	const sheetRef = useRef<BottomSheetModal>(null);
	const checkInSheetRef = useRef<BottomSheetModal>(null);

	const [items, setItems] = useState<Item[]>([]);
	const [remainingLife, setRemainingLife] = useState("0.0");
	const [itemToReview, setItemToReview] = useState<Item | null>(null);
	const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

	const handleAddSheetChange = useCallback((index: number) => {
		setIsAddSheetOpen(index >= 0);
	}, []);

	const handleOpen = useCallback(() => {
		sheetRef.current?.present();
	}, []);

	const loadData = useCallback(async () => {
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

		try {
			const [fetchedItems, settingsResult, reviewableItems] = await Promise.all([
				db.select().from(itemsTable).limit(5).orderBy(desc(itemsTable.createdAt)),
				db.select().from(userSettings).limit(1),
				db
					.select()
					.from(itemsTable)
					.where(
						and(
							eq(itemsTable.status, "purchased"),
							eq(itemsTable.reviewStatus, "pending"),
							lte(itemsTable.purchasedAt, thirtyDaysAgo)
						)
					),
			]);

			setItems(fetchedItems);

			if (!isAddSheetOpen && reviewableItems.length > 0) {
				setItemToReview(reviewableItems[0]);

				setTimeout(() => {
					if (!isAddSheetOpen) {
						checkInSheetRef.current?.present();
					}
				}, 500);
			}

			const settings = settingsResult[0];

			if (!settings) return;

			const monthlySalary = settings.salary || 0;
			const hourlyWage = settings.hourlyRate || 0;

			if (hourlyWage === 0) return;

			const totalLifeHours = monthlySalary / hourlyWage;

			const usedLifeHours = fetchedItems.reduce((acc, item) => {
				if (item.status === "anchored" || item.status === "purchased") {
					return acc + item.timeCost;
				}
				return acc;
			}, 0);

			const remaining = totalLifeHours - usedLifeHours;
			setRemainingLife(remaining.toFixed(1));
		} catch (e) {
			console.log("Error fetching items", e);
		}
	}, [isAddSheetOpen]);

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

	return (
		<View style={{ flex: 1 }} className="flex flex-col gap-y-12 flex-1 pt-3 px-3">
			<CogIcon width={36} height={36} className="self-end" />

			<View className="flex flex-col gap-y-1">
				<Text className="text-accent-success font-bold text-8xl text-center">{remainingLife}</Text>
				<Text className="text-foreground font-medium text-6xl text-center">hours</Text>
				<Text className="text-foreground text-center">remaining life</Text>
			</View>

			<Button onPress={handleOpen} className="w-6/12 h-12 self-center bg-muted active:bg-muted/20">
				<Text className="text-foreground">What are you eyeing?</Text>
			</Button>

			{items.length > 0 && (
				<View className="flex flex-col flex-1 gap-y-4 pt-2">
					<Text className="text-foreground font-jakarta font-medium text-lg">Recent items</Text>

					<ScrollView className="flex-1" contentContainerClassName="gap-y-5 pb-5">
						{items.map((item) => (
							<HistoryCard
								key={item.id}
								name={item.name}
								price={item.price}
								status={item.status}
								timeCost={item.timeCost}
								unlockedAt={item.unlockedAt}
							/>
						))}
					</ScrollView>
				</View>
			)}

			<HomeBottomSheet ref={sheetRef} onItemAdded={loadData} onChange={handleAddSheetChange} />

			<CheckInBottomSheet ref={checkInSheetRef} item={itemToReview} onReviewComplete={loadData} />
		</View>
	);
}
