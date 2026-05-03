import { Text } from "@/components/Text";
import { useAnchorProgress } from "@/hooks/useAnchorProgress";
import { cn } from "@/lib/utils";
import { Button } from "heroui-native";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import AnchorIcon from "../icons/AnchorIcon";
import LockIcon from "../icons/LockIcon";
import OpenedLockIcon from "../icons/OpenedLockIcon";

interface Props {
  name: string;
  price: string;
  createdAt: Date | null;
  unlockedAt: Date | null;
  onDecide: () => void;
}

const AnchoredCard = ({
  name,
  price,
  createdAt,
  unlockedAt,
  onDecide,
}: Props) => {
  const { progress, timeLeft, isReady } = useAnchorProgress(
    createdAt,
    unlockedAt,
  );

  return (
    <View className="flex flex-col gap-y-5 bg-accent-info/30 p-4 rounded-md">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row gap-x-3 items-center">
          {isReady ? (
            <OpenedLockIcon width={30} height={30} />
          ) : (
            <LockIcon color={"#4E6A8A"} width={30} height={30} />
          )}

          {isReady ? (
            <Text className="font-jakarta text-foreground">{name}</Text>
          ) : (
            <View className="flex flex-col gap-y-1">
              <Text className="font-jakarta text-foreground">{name}</Text>

              <View className="flex flex-row gap-x-2 items-center">
                <AnchorIcon color={"#4E6A8A"} width={20} height={20} />

                <Text className="font-jakarta text-accent-info text-sm">
                  {timeLeft}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text className="font-jakarta text-foreground">{price}</Text>
      </View>

      {isReady ? (
        <Button
          onPress={onDecide}
          className="w-full h-9 self-center bg-foreground active:bg-foreground/80"
          animation={{
            highlight: {
              backgroundColor: {
                value: "#6366f1",
              },
              opacity: {
                value: [0, 0.5],
              },
            },
          }}
        >
          <Text className="text-background">Ready to Decide</Text>
        </Button>
      ) : (
        <View className="flex flex-col gap-y-1">
          <View className="flex flex-row justify-end">
            <Text className="text-sm text-accent-info font-medium">{`${progress.toFixed(1)}%`}</Text>
          </View>

          <Progress
            value={progress}
            className="h-1.5 bg-foreground rounded-full"
            indicatorClassName="bg-accent-info"
          />
        </View>
      )}
    </View>
  );
};

export default AnchoredCard;

function Progress({
  value = 0,
  className,
  indicatorClassName,
}: {
  value?: number | null;
  className?: string;
  indicatorClassName?: string;
}) {
  const progress = useDerivedValue(() => value ?? 0);
  const indicator = useAnimatedStyle(() => ({
    width: withSpring(
      `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
      {
        overshootClamping: true,
      },
    ),
  }));
  return (
    <View
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
    >
      <Animated.View
        style={indicator}
        className={cn("bg-accent h-full", indicatorClassName)}
      />
    </View>
  );
}
