import { StyleSheet, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { differenceInDays } from 'date-fns';
import { BlurView } from 'expo-blur';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Button } from 'heroui-native';

import { Text } from '@/components/Text';
import { Item } from '@/db/schema';
import { itemRepository } from '@/lib/repositories/itemRepository';
import { formatCompactCurrency } from '@/lib/currency';

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

    const snapPoints = useMemo(() => ['60%'], []);

    const hoursCost = useMemo(() => {
      if (!item || !hourlyWage) return '0.0';
      return (item.price / hourlyWage).toFixed(1);
    }, [item, hourlyWage]);

    const waitTime = useMemo(() => {
      if (!item?.unlockedAt || !item?.createdAt) return 0;
      return differenceInDays(item.unlockedAt, item.createdAt);
    }, [item]);

    const formattedPrice = item ? formatCompactCurrency(item.price, currency) : '';
    const dayLabel = waitTime === 1 ? 'day' : 'days';

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={1}
          style={[props.style, { backgroundColor: 'transparent' }]}
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

    const handleDecision = async (status: 'purchased' | 'rejected') => {
      if (!item) return;

      try {
        await itemRepository.updateItemStatus(item.id, status);

        internalRef?.current?.dismiss();

        onItemUpdated();
      } catch (e) {
        console.error('Failed to update item', e);
      }
    };

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#18181B' }}
        handleIndicatorStyle={{ backgroundColor: '#71717A' }}
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          {item ? (
            <View className="bg-background flex-1 gap-y-6">
              <View className="items-center gap-y-2">
                <Text className="text-foreground text-3xl font-bold">
                  {hoursCost} hours of your life
                </Text>

                <Text className="text-foreground font-jakarta text-center">
                  {item.name} ({formattedPrice})
                </Text>
              </View>

              <Text className="text-foreground font-jakarta text-center">
                You waited for {waitTime} {dayLabel}. Do you still want this?
              </Text>

              <View className="gap-y-4">
                <Button
                  onPress={() => handleDecision('rejected')}
                  className="bg-primary active:bg-primary/80 h-14 w-full rounded-lg"
                  animation={{
                    highlight: {
                      backgroundColor: {
                        value: '#6366f1',
                      },
                      opacity: {
                        value: [0, 0.5],
                      },
                    },
                  }}
                >
                  <View>
                    <Text className="text-foreground text-center text-lg font-medium">
                      No, I&apos;m Free.
                    </Text>

                    <Text className="text-muted-foreground font-jakarta text-center text-sm">
                      Save {formattedPrice}
                    </Text>
                  </View>
                </Button>

                <Button
                  onPress={() => handleDecision('purchased')}
                  className="bg-secondary border-muted active:bg-secondary/80 h-14 w-full rounded-lg border"
                  animation={{
                    highlight: {
                      backgroundColor: {
                        value: '#2b2b2f',
                      },
                      opacity: {
                        value: [0, 0.5],
                      },
                    },
                  }}
                >
                  <View>
                    <Text className="text-foreground text-center text-lg font-medium">
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
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

DecisionBottomSheet.displayName = 'DecisionBottomSheet';

export default DecisionBottomSheet;
