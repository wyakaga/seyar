import { View } from "react-native";
import { Minus, Plus } from "lucide-react-native";

import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { OnboardingProps } from "@/types/onboarding.type";
export default function WorkHour({ onNext, data, updateData }: OnboardingProps) {
	const days = data?.workDaysPerMonth ?? 22;
	const hours = data?.workHoursPerDay ?? 8;

	return (
		<View className="flex flex-col items-center flex-1 p-3 justify-between">
			<View className="mt-20 flex flex-col items-center gap-y-16 w-full">
				<Text className="text-foreground font-bold text-4xl text-center">
					How much do you work?
				</Text>

				<Text className="text-foreground text-center font-jakarta">
					Be honest. This helps us calculate the value of your hour.
				</Text>

				<View className="w-full gap-y-8 px-2">
					<StepInput
						label="Days per month"
						value={days}
						onDecrease={() => updateData?.({ workDaysPerMonth: Math.max(0, days - 1) })}
						onIncrease={() => updateData?.({ workDaysPerMonth: Math.min(31, days + 1) })}
						max={31}
					/>

					<StepInput
						label="Hours per day"
						value={hours}
						onDecrease={() => updateData?.({ workHoursPerDay: Math.max(0, hours - 1) })}
						onIncrease={() => updateData?.({ workHoursPerDay: Math.min(24, hours + 1) })}
						max={24}
					/>
				</View>
			</View>

			<Button
				onPress={onNext}
				disabled={!days || !hours}
				className="w-full h-14 bg-accent-primary rounded-xl items-center"
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
			<Text className="text-muted-foreground ml-1 text-sm font-jakarta">{label}</Text>

			<View className="flex-row items-center gap-x-4">
				<Button
					className="w-12 h-12 rounded-full border border-input bg-transparent items-center justify-center active:bg-accent"
					onPress={onDecrease}
					disabled={value <= min}
				>
					<Minus color={"#E6E2D3"} size={20} />
				</Button>

				<Input
					className="flex-1 text-center font-bold text-lg h-12 bg-input/10 border-input"
					value={value.toString()}
					readOnly
				/>

				<Button
					className="w-12 h-12 rounded-full border border-input bg-transparent items-center justify-center active:bg-accent"
					onPress={onIncrease}
					disabled={value >= max}
				>
					<Plus color={"#E6E2D3"} size={20} />
				</Button>
			</View>
		</View>
	);
}
