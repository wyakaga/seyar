import { useCallback, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { InferSelectModel } from 'drizzle-orm';
import { items as itemsTable } from '@/db/schema';
import { itemRepository } from '@/lib/repositories/itemRepository';

type Item = InferSelectModel<typeof itemsTable>;

export const usePendingReviews = (isAddSheetOpen: boolean) => {
  const checkInSheetRef = useRef<BottomSheetModal>(null);
  const [itemToReview, setItemToReview] = useState<Item | null>(null);

  const checkPendingReviews = useCallback(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      const reviewableItems = await itemRepository.getPendingReviewItems(thirtyDaysAgo);

      if (!isAddSheetOpen && reviewableItems.length > 0) {
        setItemToReview(reviewableItems[0]);
        setTimeout(() => {
          if (!isAddSheetOpen) {
            checkInSheetRef.current?.present();
          }
        }, 500);
      }
    } catch (e) {
      // Error handling will be handled by the caller or a global service if needed
      console.error('Error checking pending reviews', e);
    }
  }, [isAddSheetOpen]);

  return {
    checkInSheetRef,
    itemToReview,
    checkPendingReviews,
  };
};
