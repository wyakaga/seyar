import { differenceInDays, differenceInHours } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/Text';
import { getUserSettings } from '@/lib/secureStore';
import { formatCompactCurrency } from '@/lib/currency';
import AnchorIcon from '../icons/AnchorIcon';
import CreditCardIcon from '../icons/CreditCardIcon';
import ShieldIcon from '../icons/ShieldIcon';

interface Props {
  status: 'anchored' | 'purchased' | 'rejected';
  name: string;
  price: number;
  unlockedAt: Date | null;
  timeCost?: number;
}

const HistoryCard = ({ status, name, price, unlockedAt, timeCost }: Props) => {
  const [currency, setCurrency] = useState<string | null>(null);

  const formattedTimeLeft = useMemo(() => {
    if (!unlockedAt) return '';

    const now = new Date();
    const hours = differenceInHours(unlockedAt, now);

    if (hours > 24) {
      const days = differenceInDays(unlockedAt, now);
      return `${days}d left`;
    }

    if (hours <= 0) return 'Ready';
    return `${hours}h left`;
  }, [unlockedAt]);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const setting = await getUserSettings();
        if (setting) {
          setCurrency(setting.currency);
        }
      } catch (e) {
        console.error('Error fetching settings', e);
      }
    };

    fetchSetting();
  }, []);

  return (
    <View className="bg-secondary flex flex-row items-center justify-between rounded-md p-3">
      <View className="flex flex-row items-center gap-x-3">
        {status === 'anchored' ? (
          <AnchorIcon width={28} height={28} color={'#4E6A8A'} />
        ) : status === 'purchased' ? (
          <CreditCardIcon width={28} height={28} color={'#C75B5B'} />
        ) : (
          <ShieldIcon width={28} height={28} color={'#8A9A5B'} />
        )}

        <View className="flex flex-col gap-y-3">
          <Text className="text-foreground font-jakarta">{name}</Text>

          <View className="flex flex-row items-center gap-x-3">
            {status === 'anchored' ? (
              <Text className="text-accent-info text-sm font-medium">{formattedTimeLeft}</Text>
            ) : status === 'purchased' ? (
              <Text className="text-accent-danger text-sm font-medium">
                {`-${timeCost?.toFixed(1)} hours`}
              </Text>
            ) : (
              <Text className="text-accent-success text-sm font-medium">
                {`+${timeCost?.toFixed(1)} hours saved`}
              </Text>
            )}
          </View>
        </View>
      </View>

      <Text className="text-lg font-medium">{formatCompactCurrency(price, currency)}</Text>
    </View>
  );
};
export default HistoryCard;
