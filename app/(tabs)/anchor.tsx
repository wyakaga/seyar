import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { asc, eq } from 'drizzle-orm';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';

import AnchoredCard from '@/components/anchored/AnchoredCard';
import DecisionBottomSheet from '@/components/anchored/DecisionBottomSheet';
import AnchorIcon from '@/components/icons/AnchorIcon';
import { Text } from '@/components/Text';
import { db } from '@/db/client';
import { Item, items as itemsTable } from '@/db/schema';
import { formatCompactCurrency } from '@/lib/currency';
import { getUserSettings } from '@/lib/secureStore';

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
          .where(eq(itemsTable.status, 'anchored'))
          .orderBy(asc(itemsTable.unlockedAt)),
        getUserSettings(),
      ]);

      setItems(fetchedItems);

      const sum = fetchedItems.reduce((acc, item) => acc + item.price, 0);
      setTotalOnHold(sum);

      const settings = settingsResult;

      if (!settings) return;

      setCurrency(settings.currency);
      setHourlyWage(settings.hourlyRate);
    } catch (e) {
      console.error('Error fetching items', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <View style={{ flex: 1 }} className="flex flex-1 flex-col gap-y-12 px-3 pt-9">
      <View className="flex flex-col gap-y-3">
        <Text className="text-foreground text-3xl font-bold">Anchored</Text>

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
        <View className="flex flex-col items-center justify-center gap-y-8">
          <View className="bg-accent-info flex h-48 w-48 flex-col items-center justify-center rounded-full">
            <AnchorIcon width={150} height={150} color="#E6E2D3" style={{ opacity: 0.9 }} />
          </View>

          <Text className="text-foreground text-center text-3xl font-bold">No Anchors Yet</Text>

          <View className="flex flex-col items-center justify-center gap-y-1">
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
        currency={currency ?? ''}
        hourlyWage={hourlyWage}
        onItemUpdated={loadData}
      />
    </View>
  );
}
