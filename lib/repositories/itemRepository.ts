import { and, asc, desc, eq, gte, inArray, lt, lte, or, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { items as itemsTable } from '@/db/schema';

export const itemRepository = {
  getRecentItems: async (limitCount: number = 5) => {
    return db.select().from(itemsTable).limit(limitCount).orderBy(desc(itemsTable.createdAt));
  },
  getPendingReviewItems: async (thirtyDaysAgo: Date) => {
    return db
      .select()
      .from(itemsTable)
      .where(
        and(
          eq(itemsTable.status, 'purchased'),
          eq(itemsTable.reviewStatus, 'pending'),
          lte(itemsTable.purchasedAt, thirtyDaysAgo),
        ),
      );
  },
  getUsedLifeHours: async (monthStart: Date, nextMonthStart: Date) => {
    const result = await db
      .select({
        totalUsed: sql<number>`COALESCE(SUM(${itemsTable.timeCost}), 0)`.mapWith(Number),
      })
      .from(itemsTable)
      .where(
        and(
          inArray(itemsTable.status, ['anchored', 'purchased']),
          gte(itemsTable.createdAt, monthStart),
          lt(itemsTable.createdAt, nextMonthStart),
        ),
      );
    return result[0]?.totalUsed ?? 0;
  },
  updateItemReviewStatus: async (id: string, reviewStatus: 'loved' | 'regretted') => {
    return db.update(itemsTable).set({ reviewStatus }).where(eq(itemsTable.id, id));
  },
  updateItemStatus: async (id: string, status: 'purchased' | 'rejected') => {
    return db
      .update(itemsTable)
      .set({
        status,
        purchasedAt: status === 'purchased' ? new Date() : null,
      })
      .where(eq(itemsTable.id, id));
  },
  updateAllItemsTimeCost: async (hourlyRate: number) => {
    return db.update(itemsTable).set({
      timeCost: sql`ROUND(${itemsTable.price} / ${hourlyRate}, 1)`,
    });
  },
  getBearingStats: async () => {
    const [reclaimed, ghostResult, totalPurchasedResult, historyResult] = await Promise.all([
      db
        .select({ totalReclaimed: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number) })
        .from(itemsTable)
        .where(eq(itemsTable.status, 'rejected')),
      db
        .select({ totalGhost: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number) })
        .from(itemsTable)
        .where(and(eq(itemsTable.status, 'purchased'), eq(itemsTable.reviewStatus, 'regretted'))),
      db
        .select({ totalPurchased: sql<number>`sum(${itemsTable.timeCost})`.mapWith(Number) })
        .from(itemsTable)
        .where(eq(itemsTable.status, 'purchased')),
      db
        .select()
        .from(itemsTable)
        .where(
          or(
            and(eq(itemsTable.status, 'purchased'), eq(itemsTable.reviewStatus, 'regretted')),
            eq(itemsTable.status, 'rejected'),
          ),
        )
        .orderBy(desc(itemsTable.createdAt)),
    ]);

    return {
      totalReclaimed: reclaimed[0].totalReclaimed || 0,
      totalGhost: ghostResult[0].totalGhost || 0,
      totalPurchasedHours: totalPurchasedResult[0]?.totalPurchased || 0,
      history: historyResult,
    };
  },
  getAnchoredItems: async () => {
    return db
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.status, 'anchored'))
      .orderBy(asc(itemsTable.unlockedAt));
  },
  insertItem: async (data: typeof itemsTable.$inferInsert) => {
    return db.insert(itemsTable).values(data);
  },
};
