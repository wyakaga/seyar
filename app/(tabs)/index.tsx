import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

import { Text } from "@/components/Text";
import CheckInBottomSheet from "@/components/home/CheckInBottomSheet";
import HistoryCard from "@/components/home/HistoryCard";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import CogIcon from "@/components/icons/CogIcon";
import { Button } from "heroui-native";
import { useRemainingLife } from "@/hooks/useRemainingLife";
import { usePendingReviews } from "@/hooks/usePendingReviews";
import { useItemManagement } from "@/hooks/useItemManagement";
import { useErrorService } from "@/hooks/useErrorService";

export default function Index() {
	const { handleError } = useErrorService();
	const {
		items,
		settings,
		sheetRef,
		isAddSheetOpen,
		handleAddSheetChange,
		handleOpen,
		loadData: loadItemsAndSettings,
	} = useItemManagement();

	const { checkInSheetRef, itemToReview, checkPendingReviews } = usePendingReviews(isAddSheetOpen);

	const remainingLife = useRemainingLife(items, settings);

	const loadData = useCallback(async () => {
		try {
			await loadItemsAndSettings();
			await checkPendingReviews();
		} catch (e) {
			handleError(e, "Data Load Error");
		}
	}, [loadItemsAndSettings, checkPendingReviews, handleError]);

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [loadData]),
	);

	return (
		<View style={{ flex: 1 }} className="flex-1 flex flex-col gap-y-12 px-3 pt-3">
			<CogIcon width={36} height={36} className="self-end" />

			<View className="flex flex-col gap-y-1">
				<Text className="text-accent-success text-center text-8xl font-bold">{remainingLife}</Text>
				<Text className="text-foreground text-center text-6xl font-medium">hours</Text>
				<Text className="text-foreground text-center">remaining life</Text>
			</View>

			<Button
				onPress={handleOpen}
				className="h-12 self-center bg-muted"
				animation={{
					highlight: {
						backgroundColor: {
							value: "#6366f1",
						},
						opacity: {
							value: [0, 0.5],
						},
					},
				}}
			>
				<Button.Label className="text-foreground">What are you eyeing?</Button.Label>
			</Button>

			{items.length > 0 && (
				<View className="flex flex-1 flex-col gap-y-4 pt-2">
					<Text className="text-foreground text-lg font-medium">Recent items</Text>

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

