import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, addHours, addWeeks } from 'date-fns';
import { BlurView } from 'expo-blur';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';
import { Button, Input, Label } from 'heroui-native';

import { Text } from '@/components/Text';
import { itemRepository } from '@/lib/repositories/itemRepository';
import { cn } from '@/lib/utils';
import { getUserSettings } from '@/lib/secureStore';
import { AnchorDuration, DurationOption } from './AnchorDuration';
import { formatPrice } from '@/lib/formatPrice';
import { useErrorService } from '@/hooks/useErrorService';

const DURATION_OPTIONS: DurationOption[] = [
  { label: '24 hours', value: '24h' },
  { label: '3 days', value: '3d' },
  { label: '1 week', value: '1w' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  price: z.string().regex(/^\d+$/, 'Price must be a number'),
});

type FormValues = z.infer<typeof formSchema>;
type ItemStatus = 'anchored' | 'rejected' | 'purchased';

interface Props {
  ref: RefObject<BottomSheetModal | null>;
  onItemAdded?: () => void;
  onChange?: (index: number) => void;
}

const HomeBottomSheet = ({ ref, onItemAdded, onChange }: Props) => {
  const snapPoints = useMemo(() => ['85%'], []);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', price: '' },
  });

  const [duration, setDuration] = useState('24h');
  const [hourlyWage, setHourlyWage] = useState(0);
  const [status, setStatus] = useState<ItemStatus>('rejected');

  const watchedPrice = watch('price');

  const hoursOfLife = useMemo(() => {
    const price = Number(watchedPrice);
    if (!price || !hourlyWage) return '0.0';
    return (price / hourlyWage).toFixed(1);
  }, [watchedPrice, hourlyWage]);

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

  const { handleError, showSuccess } = useErrorService();

  const onSubmit = async (data: FormValues) => {
    try {
      const now = new Date();

      let unlockedAt = addHours(now, 24);

      if (duration === '3d') {
        unlockedAt = addDays(now, 3);
      } else if (duration === '1w') {
        unlockedAt = addWeeks(now, 1);
      }

      await itemRepository.insertItem({
        name: data.name,
        price: Number(data.price),
        timeCost: parseFloat(hoursOfLife),
        status,
        createdAt: now,
        unlockedAt: status === 'anchored' ? unlockedAt : null,
        purchasedAt: status === 'purchased' ? now : null,
      });

      reset();
      setStatus('rejected');

      ref.current?.dismiss();

      showSuccess(`Item ${status === 'rejected' ? 'rejected' : 'added'} successfully`);

      if (onItemAdded) {
        onItemAdded();
      }
    } catch (error) {
      handleError(error, 'Submission Failed');
    }
  };
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const setting = await getUserSettings();
        if (setting) {
          setHourlyWage(setting.hourlyRate);
        }
      } catch (e) {
        handleError(e, 'Settings Load Failed');
      }
    };

    fetchSetting();
  }, [handleError]);

  return (
    <BottomSheetModal
      ref={ref}
      onChange={onChange}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#18181B' }}
      handleIndicatorStyle={{ backgroundColor: '#71717A' }}
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        <View className="flex-1 gap-y-10">
          <Text className="text-foreground text-center text-xl font-bold">Anchor a new item</Text>

          <View className="flex gap-y-3">
            <View className="gap-1.5">
              <Label>Item name</Label>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Input the item name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="focus:border-primary"
                  />
                )}
              />

              {errors.name && (
                <Text className="text-accent-danger font-jakarta text-sm">
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View className="gap-1.5">
              <Label>Price</Label>

              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Input the price"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                    value={formatPrice(value)}
                    className="focus:border-primary"
                  />
                )}
              />

              {errors.price && (
                <Text className="text-accent-danger font-jakarta text-sm">
                  {errors.price.message}
                </Text>
              )}
            </View>
          </View>

          <View className="flex gap-y-5">
            <Text className="font-jakarta text-foreground text-center text-2xl">
              That&apos;s{' '}
              <Text className="text-accent-danger text-2xl font-bold">{hoursOfLife} hours</Text> of
              your life
            </Text>

            <View className="flex flex-row justify-center gap-x-3">
              <Button
                key={`rejected-${status}`}
                onPress={() => setStatus('rejected')}
                variant="ghost"
                className={cn(
                  'h-10 w-1/3 items-center rounded-lg',
                  status === 'rejected'
                    ? 'bg-accent-success'
                    : 'bg-background border-accent-success border',
                )}
                animation={{
                  highlight: {
                    backgroundColor: {
                      value: status === 'rejected' ? '#dcfce7' : '#fef2f2',
                    },
                    opacity: {
                      value: [0, 0.5],
                    },
                  },
                }}
              >
                <Button.Label
                  className={cn(
                    'font-jakarta',
                    status === 'rejected' ? 'text-foreground' : 'text-accent-success',
                  )}
                >
                  Skip
                </Button.Label>
              </Button>

              <Button
                key={`anchored-${status}`}
                onPress={() => setStatus('anchored')}
                variant="ghost"
                className={cn(
                  'h-10 w-1/3 items-center rounded-lg',
                  status === 'anchored'
                    ? 'bg-accent-info'
                    : 'bg-background border-accent-info active:bg-accent-info/50 border',
                )}
              >
                <Button.Label
                  className={cn(
                    'font-jakarta',
                    status === 'anchored' ? 'text-foreground' : 'text-accent-info',
                  )}
                >
                  Hold
                </Button.Label>
              </Button>

              <Button
                key={`purchased-${status}`}
                onPress={() => setStatus('purchased')}
                variant="ghost"
                className={cn(
                  'h-10 w-1/3 items-center rounded-lg',
                  status === 'purchased'
                    ? 'bg-secondary border-muted'
                    : 'bg-background border-secondary active:bg-secondary/50 border',
                )}
              >
                <Button.Label
                  className={cn(
                    'font-jakarta',
                    status === 'purchased' ? 'text-foreground' : 'text-muted',
                  )}
                >
                  Spent
                </Button.Label>
              </Button>
            </View>

            {status === 'anchored' && (
              <View className="flex gap-y-3">
                <Text className="font-jakarta text-foreground">Anchor duration</Text>

                <AnchorDuration
                  options={DURATION_OPTIONS}
                  value={duration}
                  onValueChange={setDuration}
                />
              </View>
            )}

            <Button
              className={cn('h-14 w-full  items-center rounded-lg', {
                'bg-accent-success active:bg-accent-success/50': status === 'rejected',
                'bg-accent-info active:bg-accent-info/50': status === 'anchored',
                'bg-secondary active:bg-secondary/50 border-muted': status === 'purchased',
              })}
              animation={{
                highlight: {
                  backgroundColor: {
                    value:
                      status === 'rejected'
                        ? '#dcfce7'
                        : status === 'anchored'
                          ? '#dcfce7'
                          : '#fef2f2',
                  },
                  opacity: {
                    value: [0, 0.5],
                  },
                },
              }}
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-foreground font-jakarta">
                {status === 'rejected'
                  ? `Reclaim ${hoursOfLife} hours`
                  : status === 'anchored'
                    ? 'Drop anchor'
                    : 'Confirm purchase'}
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export default HomeBottomSheet;
