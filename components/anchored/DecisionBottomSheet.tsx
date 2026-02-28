import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { eq } from "drizzle-orm";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { differenceInDays } from "date-fns";

import { Item, items as itemsTable } from "@/db/schema";
import { db } from "@/db/client";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { BottomSheet } from "../ui/bottom-sheet";
import { formatCompactCurrency } from "@/lib/currency";

interface Props {
	item: Item | null;
	hourlyWage: number;
	currency: string;
	onItemUpdated: () => void;
}

const DecisionBottomSheet = forwardRef<BottomSheetModal, Props>(
	({ item, hourlyWage, currency, onItemUpdated }, ref) => {
		const internalRef = useRef<BottomSheetModal>(null);

		useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);

		const snapPoints = useMemo(() => ["60%"], []);

		const hoursCost = useMemo(() => {
			if (!item || !hourlyWage) return "0.0";
			return (item.price / hourlyWage).toFixed(1);
		}, [item, hourlyWage]);

		const waitTime = useMemo(() => {
			if (!item?.unlockedAt || !item?.createdAt) return 0;
			return differenceInDays(item.unlockedAt, item.createdAt);
		}, [item]);

		const formattedPrice = item ? formatCompactCurrency(item.price, currency) : "";
		const dayLabel = waitTime === 1 ? "day" : "days";

		const renderBackdrop = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
					opacity={1}
					style={[props.style, { backgroundColor: "transparent" }]}
				>
					<BlurView
						style={StyleSheet.absoluteFill}
						intensity={20}
						tint="dark"
						experimentalBlurMethod="dimezisBlurView"
					/>
				</BottomSheetBackdrop>
			),
			[]
		);

		const handleDecision = async (status: "purchased" | "rejected") => {
			if (!item) return;

			try {
				await db
					.update(itemsTable)
					.set({
						status,
						purchasedAt: status === "purchased" ? new Date() : null,
					})
					.where(eq(itemsTable.id, item.id));

				internalRef?.current?.dismiss();

				onItemUpdated();
			} catch (e) {
				console.error("Failed to update item", e);
			}
		};

		return (
			<BottomSheet ref={internalRef} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
				{item ? (
					<View className="flex-1 gap-y-6 bg-background">
						<View className="items-center gap-y-2">
							<Text className="text-3xl font-bold text-foreground font-jakarta">
								{hoursCost} hours of your life
							</Text>

							<Text className="text-foreground text-center font-jakarta">
								{item.name} ({formattedPrice})
							</Text>
						</View>

						<Text className="text-center text-foreground font-jakarta">
							You waited for {waitTime} {dayLabel}. Do you still want this?
						</Text>

						<View className="gap-y-4">
							<Button
								onPress={() => handleDecision("rejected")}
								className="w-full h-14 bg-primary rounded-lg active:bg-primary/80"
							>
								<View>
									<Text className="text-foreground font-jakarta font-medium text-center text-lg">
										No, I&apos;m Free.
									</Text>

									<Text className="text-muted-foreground font-jakarta text-center text-sm">
										Save {formattedPrice}
									</Text>
								</View>
							</Button>

							<Button
								onPress={() => handleDecision("purchased")}
								className="w-full h-14 bg-secondary border border-muted rounded-lg active:bg-secondary/80"
							>
								<View>
									<Text className="text-foreground font-jakarta font-medium text-center text-lg">
										Yes, Buy It.
									</Text>

									<Text className="text-muted-foreground text-center text-sm">
										Spend {hoursCost} hours
									</Text>
								</View>
							</Button>
						</View>
					</View>
				) : (
					<View />
				)}
			</BottomSheet>
		);
	}
);

DecisionBottomSheet.displayName = "DecisionBottomSheet";

export default DecisionBottomSheet;
