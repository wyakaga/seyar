import { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { desc, InferSelectModel } from 'drizzle-orm';
import { db } from '@/db/client';
import { items as itemsTable } from '@/db/schema';
import { getUserSettings, UserSettings } from '@/lib/secureStore';

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
        db.select().from(itemsTable).limit(5).orderBy(desc(itemsTable.createdAt)),
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
