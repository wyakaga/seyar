import { View } from "react-native";

import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { OnboardingProps } from "@/types/onboarding.type";
export default function TimeWorth({ onNext, data }: OnboardingProps) {
	const salary = data?.salary || 0;
	const days = data?.workDaysPerMonth || 22;
	const hours = data?.workHoursPerDay || 8;
	const currency = data?.currency || "USD";

	const totalHours = days * hours;
	const hourlyRate = totalHours > 0 ? salary / totalHours : 0;

	const formattedRate = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		maximumFractionDigits: 0,
	}).format(hourlyRate);

	return (
		<View className="flex flex-col items-center flex-1 p-3 justify-between">
			<View className="mt-20 flex flex-col items-center gap-y-16 w-full">
				<Text className="text-foreground font-bold text-4xl text-center">Your time is worth:</Text>

				<Text className="text-accent-success font-bold text-5xl text-center">{`${formattedRate}/hour`}</Text>

				<Text className="text-foreground text-center font-jakarta">
					Every time you spend {formattedRate}, you are deleting{" "}
					<Text className="text-destructive text-center font-jakarta">1 hour of your life.</Text>
				</Text>
			</View>

			<Button onPress={onNext} className="w-full h-14 bg-accent-primary rounded-xl items-center">
				<Text className="text-foreground text-lg font-jakarta">I understand. Let’s go</Text>
			</Button>
		</View>
	);
}
