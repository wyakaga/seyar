import { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { items as itemsTable } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { getUserSettings, UserSettings } from '@/lib/secureStore';
import { itemRepository } from '@/lib/repositories/itemRepository';

type Item = InferSelectModel<typeof itemsTable>;

export const useItemManagement = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<UserSettings>();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const handleAddSheetChange = useCallback((index: number) => {
    setIsAddSheetOpen(index >= 0);
  }, []);

  const handleOpen = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [fetchedItems, settingsResult] = await Promise.all([
        itemRepository.getRecentItems(5),
        getUserSettings(),
      ]);

      setItems(fetchedItems);
      setSettings(settingsResult);
      return { fetchedItems, settings: settingsResult };
    } catch (e) {
      console.error('Error loading items', e);
      throw e;
    }
  }, []);

  return {
    items,
    settings,
    sheetRef,
    isAddSheetOpen,
    handleAddSheetChange,
    handleOpen,
    loadData,
  };
};
