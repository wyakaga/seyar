import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { eq } from "drizzle-orm";
import { BlurView } from "expo-blur";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/Text";
import { db } from "@/db/client";
import { Item, items as itemsTable } from "@/db/schema";
import { Button } from "heroui-native";
import { useErrorService } from "@/hooks/useErrorService";
import HeartCrackIcon from "../icons/HeartCrackIcon";
import HeartIcon from "../icons/HeartIcon";

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
      [],
    );

    const { handleError, showSuccess } = useErrorService();

    const handleReview = async (reviewStatus: "loved" | "regretted") => {
      if (!item) return;

      try {
        await db
          .update(itemsTable)
          .set({ reviewStatus })
          .where(eq(itemsTable.id, item.id));

        internalRef.current?.dismiss();

        showSuccess("Review submitted successfully");
        onReviewComplete();
      } catch (e) {
        handleError(e, "Review Failed");
      }
    };

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        backgroundStyle={{ backgroundColor: "#18181B" }}
        handleIndicatorStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          <View className="flex flex-col gap-y-6">
            <View className="flex flex-col gap-y-3 items-center">
              <Text className="text-3xl font-bold text-foreground">
                30 Day Check-in
              </Text>

              <Text className="font-jakarta text-foreground">{item?.name}</Text>
            </View>

            <Text className="font-jakarta text-foreground text-center">
              Is this item still adding value to your life?
            </Text>

            <View className="flex flex-row gap-x-3">
              <Button
                onPress={() => handleReview("regretted")}
                className="w-1/2 h-20 rounded-lg flex flex-col items-center bg-background border border-accent-danger active:bg-accent-danger/20"
                animation={{
                  highlight: {
                    backgroundColor: {
                      value: "#c75b5b",
                    },
                    opacity: {
                      value: [0, 0.5],
                    },
                  },
                }}
              >
                <HeartCrackIcon color={"#c75b5b"} />

                <Button.Label className="text-accent-danger">
                  It gathers dust
                </Button.Label>
              </Button>

              <Button
                onPress={() => handleReview("loved")}
                className="w-1/2 h-20 flex flex-col rounded-lg items-center bg-primary"
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
                <HeartIcon />

                <Button.Label>Still love it</Button.Label>
              </Button>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

CheckInBottomSheet.displayName = "CheckInBottomSheet";

export default CheckInBottomSheet;
