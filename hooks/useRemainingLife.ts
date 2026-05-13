import { useCallback, useState } from 'react';
import { and, gte, inArray, InferSelectModel, lt, sql } from 'drizzle-orm';
import { addMonths, startOfMonth } from 'date-fns';
import { items as itemsTable, userSettings } from '@/db/schema';
import { db } from '@/db/client';
import { useFocusEffect } from 'expo-router';

type Settings = InferSelectModel<typeof userSettings>;

export const useRemainingLife = (_items: any[], settings: Settings | undefined) => {
  const [remainingLife, setRemainingLife] = useState('0.0');

  const calculate = useCallback(async () => {
    if (!settings) {
      setRemainingLife('0.0');
      return;
    }

    const monthlySalary = settings.salary || 0;
    const hourlyWage = settings.hourlyRate || 0;

    if (hourlyWage === 0) {
      setRemainingLife('0.0');
      return;
    }

    const totalLifeHours = monthlySalary / hourlyWage;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const nextMonthStart = startOfMonth(addMonths(now, 1));

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

    const usedLifeHours = result[0]?.totalUsed ?? 0;
    const remaining = totalLifeHours - usedLifeHours;
    setRemainingLife(remaining.toFixed(1));
  }, [settings]);

  useFocusEffect(
    useCallback(() => {
      calculate();
    }, [calculate]),
  );

  return remainingLife;
};
