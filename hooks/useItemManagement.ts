import { useCallback, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { desc, InferSelectModel } from "drizzle-orm";
import { db } from "@/db/client";
import { items as itemsTable, userSettings } from "@/db/schema";

type Item = InferSelectModel<typeof itemsTable>;
type Settings = InferSelectModel<typeof userSettings>;

export const useItemManagement = () => {
	const sheetRef = useRef<BottomSheetModal>(null);
	const [items, setItems] = useState<Item[]>([]);
	const [settings, setSettings] = useState<Settings>();
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
				db.select().from(userSettings).limit(1),
			]);

			setItems(fetchedItems);
			setSettings(settingsResult[0]);
			return { fetchedItems, settings: settingsResult[0] };
		} catch (e) {
			console.error("Error loading items", e);
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
