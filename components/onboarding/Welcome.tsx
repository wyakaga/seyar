import { Image, View } from "react-native";

import ring from "@/assets/torus-rings.png";
import { Text } from "@/components/Text";
import { OnboardingProps } from "@/types/onboarding.type";
import { Button } from "heroui-native";
export default function Welcome({ onNext }: OnboardingProps) {
  return (
    <View className="flex flex-col items-center flex-1 p-3 justify-between">
      <View className="w-full h-62.5 overflow-hidden items-center">
        <Image source={ring} className="w-10/12 h-full" resizeMode="contain" />
      </View>

      <View className="flex flex-col items-center gap-y-8">
        <Text variant="h1">Stop lying to yourself.</Text>

        <View className="flex flex-col items-center">
          <Text variant="p">See the real cost of your spending.</Text>
          <Text variant="p">Not in money, but in time.</Text>
        </View>
      </View>

      <Button
        onPress={onNext}
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
        <Text variant="p">Start</Text>
      </Button>
    </View>
  );
}
