import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { eq } from "drizzle-orm";

import { Text } from "../ui/text";
import { Button } from "../ui/button";
import HeartCrackIcon from "../icons/HeartCrackIcon";
import HeartIcon from "../icons/HeartIcon";
import { BottomSheet } from "../ui/bottom-sheet";
import { db } from "@/db/client";
import { items as itemsTable, Item } from "@/db/schema";

interface Props {
	item: Item | null;
	onReviewComplete: () => void;
}

const CheckInBottomSheet = forwardRef<BottomSheetModal, Props>(
	({ item, onReviewComplete }, ref) => {
		const internalRef = useRef<BottomSheetModal>(null);

		useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);

		const snapPoints = useMemo(() => ["60%"], []);

		const renderBackdrop = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					{...props}
					disappearsOnIndex={-1}
					appearsOnIndex={0}
					opacity={1}
					pressBehavior={"none"}
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

		const handleReview = async (reviewStatus: "loved" | "regretted") => {
			if (!item) return;

			try {
				await db.update(itemsTable).set({ reviewStatus }).where(eq(itemsTable.id, item.id));

				internalRef.current?.dismiss();

				onReviewComplete();
			} catch (e) {
				console.error("Failed to submit review", e);
			}
		};

		return (
			<BottomSheet
				ref={internalRef}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				enablePanDownToClose={false}
				enableContentPanningGesture={false}
				handleIndicatorStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
			>
				<View className="flex flex-col gap-y-6">
					<View className="flex flex-col gap-y-3 items-center">
						<Text className="font-jakarta text-3xl font-bold text-foreground">30 Day Check-in</Text>

						<Text className="font-jakarta text-foreground">{item?.name}</Text>
					</View>

					<Text className="font-jakarta text-foreground text-center">
						Is this item still adding value to your life?
					</Text>

					<View className="flex flex-row gap-x-3">
						<Button
							onPress={() => handleReview("loved")}
							className="w-1/2 h-10 rounded-lg items-center bg-background border border-accent-danger active:bg-accent-danger/20"
						>
							<HeartCrackIcon />
						</Button>

						<Button
							onPress={() => handleReview("regretted")}
							className="w-1/2 h-10 rounded-lg items-center"
						>
							<HeartIcon />
						</Button>
					</View>
				</View>
			</BottomSheet>
		);
	}
);

CheckInBottomSheet.displayName = "CheckInBottomSheet";

export default CheckInBottomSheet;
