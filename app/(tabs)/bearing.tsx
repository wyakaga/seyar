import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';

import BearingCard from '@/components/bearing/BearingCard';
import GhostIcon from '@/components/icons/GhostIcon';
import WaveIcon from '@/components/icons/WaveIcon';
import { Text } from '@/components/Text';
import { Item } from '@/db/schema';
import { formatCompactCurrency } from '@/lib/currency';
import { itemRepository } from '@/lib/repositories/itemRepository';
import { getUserSettings } from '@/lib/secureStore';

export default function Bearing() {
  const [totalReclaimed, setTotalReclaimed] = useState(0);
  const [ghostHour, setGhostHour] = useState(0);
  const [regretRate, setRegretRate] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [currency, setCurrency] = useState<string | null>(null);
  const [workSchedule, setWorkSchedule] = useState({
    hoursPerDay: 8,
    daysPerMonth: 20,
  });

  const loadData = useCallback(async () => {
    try {
      const [stats, settingsResult] = await Promise.all([
        itemRepository.getBearingStats(),
        getUserSettings(),
      ]);

      setTotalReclaimed(stats.totalReclaimed);
      setGhostHour(stats.totalGhost);
      setItems(stats.history);

      const settings = settingsResult;

      if (!settings) return;

      setCurrency(settings.currency);
      setWorkSchedule({
        hoursPerDay: settings.workHoursPerDay || 8,
        daysPerMonth: settings.workDaysPerMonth || 20,
      });

      const totalPurchasedHours = stats.totalPurchasedHours;

      let totalRegretRate = 0;

      if (totalPurchasedHours > 0 && stats.totalGhost > 0) {
        totalRegretRate = (stats.totalGhost / totalPurchasedHours) * 100;
      }

      setRegretRate(totalRegretRate);
    } catch (e) {
      console.error('Error fetching items', e);
    }
  }, []);

  const getGhostText = (ghostHours: number, hoursPerDay: number, daysPerMonth: number) => {
    if (ghostHours === 0) return "You haven't wasted any time. Great job!";

    const hoursPerWeek = hoursPerDay * (daysPerMonth / 4);
    const hoursPerMonth = hoursPerDay * daysPerMonth;

    if (ghostHours >= hoursPerMonth) {
      const months = (ghostHours / hoursPerMonth).toFixed(1);
      return `You worked ${months === '1.0' ? 'a full month' : `${months} months`} for things you hate`;
    }

    if (ghostHours >= hoursPerWeek) {
      const weeks = (ghostHours / hoursPerWeek).toFixed(1);
      return `You worked ${weeks === '1.0' ? 'a full week' : `${weeks} weeks`} for things you hate`;
    }

    if (ghostHours >= hoursPerDay) {
      const days = (ghostHours / hoursPerDay).toFixed(1);
      return `You worked ${days === '1.0' ? 'a full day' : `${days} days`} for things you hate`;
    }

    return `You worked ${ghostHours.toFixed(1)} hours for things you hate`;
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <View style={{ flex: 1 }} className="flex flex-1 flex-col gap-y-12 px-3 pt-9">
      <Text className="text-foreground text-3xl font-bold">Bearing</Text>

      <View className="justify-items bg-secondary flex flex-col items-center gap-y-3 rounded-lg p-4">
        <Text className="text-accent-success text-5xl font-bold">{`${totalReclaimed.toFixed(1)} hours`}</Text>

        <Text className="font-jakarta text-foreground">life reclaimed</Text>
      </View>

      <View className="flex flex-row gap-3">
        <View className="bg-secondary flex flex-1 flex-col items-center gap-y-6 rounded-lg p-2">
          <View className="flex flex-row items-center justify-center gap-x-3">
            <GhostIcon />

            <Text className="text-foreground text-xl font-bold">Ghost hours</Text>
          </View>

          <Text className="text-foreground text-3xl font-bold">{`${ghostHour.toFixed(1)} hours`}</Text>

          <Text className="font-jakarta text-foreground text-center text-xs">
            {getGhostText(ghostHour, workSchedule.hoursPerDay, workSchedule.daysPerMonth)}
          </Text>
        </View>

        <View className="bg-secondary flex flex-1 flex-col items-center gap-y-6 rounded-lg p-2">
          <View className="flex flex-row items-center justify-center gap-x-3">
            <WaveIcon />

            <Text className="text-foreground text-xl font-bold">Regret rate</Text>
          </View>

          <Text className="text-foreground text-3xl font-bold">{`${regretRate.toFixed(1)}%`}</Text>

          <Text className="font-jakarta text-foreground text-center text-xs">
            Percentage of labor spent in vain
          </Text>
        </View>
      </View>

      <View className="flex flex-1 flex-col gap-y-5">
        <Text className="text-3xl font-bold">History</Text>

        {items.length > 0 ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-y-5 pb-5"
            renderItem={({ item }) => (
              <BearingCard
                name={item.name}
                status={item.status}
                price={formatCompactCurrency(item.price, currency)}
                timeCost={item.timeCost}
              />
            )}
          />
        ) : (
          <Text className="text-muted-foreground font-jakarta text-center text-xs">
            Your past decisions will appear here. Reject or buy anchored items to start building
            your history.
          </Text>
        )}
      </View>
    </View>
  );
}
