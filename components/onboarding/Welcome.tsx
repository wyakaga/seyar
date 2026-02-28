import { Image, View } from "react-native";

import ring from "@/assets/torus-rings.png";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { OnboardingProps } from "@/types/onboarding.type";
export default function Welcome({ onNext }: OnboardingProps) {
	return (
		<View className="flex flex-col items-center flex-1 p-3 justify-between">
			<View className="w-full h-[250px] overflow-hidden items-center">
				<Image source={ring} className="w-10/12 h-full" resizeMode="contain" />
			</View>

			<View className="flex flex-col items-center gap-y-8">
				<Text className="text-foreground text-4xl font-bold">Stop lying to yourself.</Text>

				<View className="flex flex-col items-center">
					<Text className="text-foreground font-jakarta">See the real cost of your spending.</Text>
					<Text className="text-foreground font-jakarta">Not in money, but in time.</Text>
				</View>
			</View>

			<Button onPress={onNext} className="w-full h-14 bg-accent-primary rounded-xl items-center">
				<Text className="text-foreground text-lg font-jakarta">Start</Text>
			</Button>
		</View>
	);
}
