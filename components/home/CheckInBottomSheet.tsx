import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { Item } from '@/db/schema';
import { Button } from 'heroui-native';
import { useErrorService } from '@/hooks/useErrorService';
import { itemRepository } from '@/lib/repositories/itemRepository';
import HeartCrackIcon from '../icons/HeartCrackIcon';
import HeartIcon from '../icons/HeartIcon';

interface Props {
  item: Item | null;
  onReviewComplete: () => void;
}

const CheckInBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ item, onReviewComplete }, ref) => {
    const internalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => internalRef.current as BottomSheetModal);

    const snapPoints = useMemo(() => ['60%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={1}
          pressBehavior={'none'}
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

    const { handleError, showSuccess } = useErrorService();

    const handleReview = async (reviewStatus: 'loved' | 'regretted') => {
      if (!item) return;

      try {
        await itemRepository.updateItemReviewStatus(item.id, reviewStatus);

        internalRef.current?.dismiss();

        showSuccess('Review submitted successfully');
        onReviewComplete();
      } catch (e) {
        handleError(e, 'Review Failed');
      }
    };

    return (
      <BottomSheetModal
        ref={internalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        backgroundStyle={{ backgroundColor: '#18181B' }}
        handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          <View className="flex flex-col gap-y-6">
            <View className="flex flex-col items-center gap-y-3">
              <Text className="text-foreground text-3xl font-bold">30 Day Check-in</Text>

              <Text className="font-jakarta text-foreground">{item?.name}</Text>
            </View>

            <Text className="font-jakarta text-foreground text-center">
              Is this item still adding value to your life?
            </Text>

            <View className="flex flex-row gap-x-3">
              <Button
                onPress={() => handleReview('regretted')}
                className="bg-background border-accent-danger active:bg-accent-danger/20 flex h-20 w-1/2 flex-col items-center rounded-lg border"
                animation={{
                  highlight: {
                    backgroundColor: {
                      value: '#c75b5b',
                    },
                    opacity: {
                      value: [0, 0.5],
                    },
                  },
                }}
              >
                <HeartCrackIcon color={'#c75b5b'} />

                <Button.Label className="text-accent-danger">It gathers dust</Button.Label>
              </Button>

              <Button
                onPress={() => handleReview('loved')}
                className="bg-primary flex h-20 w-1/2 flex-col items-center rounded-lg"
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

CheckInBottomSheet.displayName = 'CheckInBottomSheet';

export default CheckInBottomSheet;
