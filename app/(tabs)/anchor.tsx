import { useCallback, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { asc, eq } from "drizzle-orm";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { Text } from "@/components/ui/text";
import { Item, items as itemsTable, userSettings } from "@/db/schema";
import { db } from "@/db/client";
import AnchoredCard from "@/components/anchored/AnchoredCard";
import { formatCompactCurrency } from "@/lib/currency";
import DecisionBottomSheet from "@/components/anchored/DecisionBottomSheet";
import AnchorIcon from "@/components/icons/AnchorIcon";

export default function Anchor() {
	const sheetRef = useRef<BottomSheetModal>(null);

	const [items, setItems] = useState<Item[]>([]);
	const [totalOnHold, setTotalOnHold] = useState(0);
	const [currency, setCurrency] = useState<string | null>(null);
	const [hourlyWage, setHourlyWage] = useState(0);
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);

	const handleOpen = (item: Item) => {
		setSelectedItem(item);
		sheetRef.current?.present();
	};

	const loadData = useCallback(async () => {
		try {
			const [fetchedItems, settingsResult] = await Promise.all([
				db
					.select()
					.from(itemsTable)
					.where(eq(itemsTable.status, "anchored"))
					.orderBy(asc(itemsTable.unlockedAt)),
				db.select().from(userSettings).limit(1),
			]);

			setItems(fetchedItems);

			const sum = fetchedItems.reduce((acc, item) => acc + item.price, 0);
			setTotalOnHold(sum);

			const settings = settingsResult[0];

			if (!settings) return;

			setCurrency(settings.currency);
			setHourlyWage(settings.hourlyRate);
		} catch (e) {
			console.log("Error fetching items", e);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData])
	);

	return (
		<View style={{ flex: 1 }} className="flex flex-col gap-y-12 flex-1 pt-9 px-3">
			<View className="flex flex-col gap-y-3">
				<Text className="text-foreground text-3xl font-bold font-jakarta">Anchored</Text>

				<Text className="text-foreground font-jakarta">
					{items.length} items • {formatCompactCurrency(totalOnHold, currency)} on hold
				</Text>
			</View>

			{items.length > 0 ? (
				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					contentContainerClassName="gap-y-5 pb-5"
					renderItem={({ item }) => (
						<AnchoredCard
							name={item.name}
							price={formatCompactCurrency(item.price, currency)}
							createdAt={item.createdAt}
							unlockedAt={item.unlockedAt}
							onDecide={() => handleOpen(item)}
						/>
					)}
				/>
			) : (
				<View className="flex flex-col gap-y-8 justify-center items-center">
					<View className="flex flex-col items-center justify-center w-48 h-48 rounded-full bg-accent-info">
						<AnchorIcon width={150} height={150} color="#E6E2D3" style={{ opacity: 0.9 }} />
					</View>

					<Text className="font-jakarta text-3xl font-bold text-foreground text-center">No Anchors Yet</Text>

					<View className="flex flex-col gap-y-1 justify-center items-center">
						<Text className="font-jakarta text-foreground text-center">
							You haven&apos;t anchored any items yet.
						</Text>

						<Text className="font-jakarta text-foreground text-center">
							When you add something you unsure about the item will show here.
						</Text>
					</View>
				</View>
			)}

			<DecisionBottomSheet
				ref={sheetRef}
				item={selectedItem}
				currency={currency ?? ""}
				hourlyWage={hourlyWage}
				onItemUpdated={loadData}
			/>
		</View>
	);
}
