import { useCallback, useState } from 'react';
import { addMonths, startOfMonth } from 'date-fns';
import { useFocusEffect } from 'expo-router';
import { UserSettings } from '@/lib/secureStore';
import { itemRepository } from '@/lib/repositories/itemRepository';

export const useRemainingLife = (_items: any[], settings: UserSettings | undefined) => {
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

    const usedLifeHours = await itemRepository.getUsedLifeHours(monthStart, nextMonthStart);

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
