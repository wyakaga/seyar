import { Minus, Plus } from "lucide-react-native";
import { View } from "react-native";

import { Text } from "@/components/Text";
import { OnboardingProps } from "@/types/onboarding.type";
import { Button, Input } from "heroui-native";
export default function WorkHour({
  onNext,
  data,
  updateData,
}: OnboardingProps) {
  const days = data?.workDaysPerMonth ?? 22;
  const hours = data?.workHoursPerDay ?? 8;

  return (
    <View className="flex flex-col items-center flex-1 p-3 justify-between">
      <View className="mt-20 flex flex-col items-center gap-y-16 w-full">
        <Text variant="h1">How much do you work?</Text>

        <Text variant="p" className="text-center">
          Be honest. This helps us calculate the value of your hour.
        </Text>

        <View className="w-full gap-y-8 px-2">
          <StepInput
            label="Days per month"
            value={days}
            onDecrease={() =>
              updateData?.({ workDaysPerMonth: Math.max(0, days - 1) })
            }
            onIncrease={() =>
              updateData?.({ workDaysPerMonth: Math.min(31, days + 1) })
            }
            max={31}
          />

          <StepInput
            label="Hours per day"
            value={hours}
            onDecrease={() =>
              updateData?.({ workHoursPerDay: Math.max(0, hours - 1) })
            }
            onIncrease={() =>
              updateData?.({ workHoursPerDay: Math.min(24, hours + 1) })
            }
            max={24}
          />
        </View>
      </View>

      <Button
        onPress={onNext}
        isDisabled={!days || !hours}
        className="w-full h-14 bg-primary rounded-xl items-center"
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
        <Text className="text-foreground text-lg font-jakarta">Next</Text>
      </Button>
    </View>
  );
}

function StepInput({
  label,
  value,
  onIncrease,
  onDecrease,
  min = 0,
  max = 100,
}: {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}) {
  return (
    <View className="gap-y-3 w-full">
      <Text className="text-muted-foreground ml-1 text-sm font-jakarta">
        {label}
      </Text>

      <View className="flex-row items-center gap-x-4">
        <Button
          className="w-12 h-12 rounded-full border border-input bg-transparent items-center justify-center active:bg-primary"
          onPress={onDecrease}
          isDisabled={value <= min}
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
          isIconOnly
        >
          <Minus color={"#E6E2D3"} size={20} />
        </Button>

        <Input
          className="flex-1 text-center font-bold text-lg h-14 bg-input/10 border-input"
          value={value.toString()}
          editable={false}
        />

        <Button
          className="w-12 h-12 rounded-full border border-input bg-transparent items-center justify-center active:bg-primary"
          onPress={onIncrease}
          isDisabled={value >= max}
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
          isIconOnly
        >
          <Plus color={"#E6E2D3"} size={20} />
        </Button>
      </View>
    </View>
  );
}
