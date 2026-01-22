import { View } from "react-native";

import { Text } from "../ui/text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { OnboardingProps } from "@/types/onboarding.type";
import CURRENCIES from "@/constants/currencies";

export default function Salary({ onNext, data, updateData }: OnboardingProps) {
	return (
		<View className="flex flex-col items-center flex-1 p-3 justify-between">
			<View className="mt-20 flex flex-col items-center gap-y-16 w-full">
				<Text className="text-foreground font-bold text-4xl text-center">
					What actually hits your bank?
				</Text>

				<Text className="text-foreground text-center font-jakarta">
					Enter your monthly <Text className="text-foreground font-bold">Take-Home Pay</Text>.
					Ignore taxes and insurance. Just the cash you can spend.
				</Text>

				<View className="flex flex-row gap-x-5 w-full">
					<Select
						onValueChange={(val) => {
							const stringVal = typeof val === "object" ? val.value : val;
							updateData?.({ currency: stringVal });
						}}
					>
						<SelectTrigger className="w-28">
							<SelectValue placeholder="Currency" />
						</SelectTrigger>

						<SelectContent>
							{CURRENCIES.map((currency) => (
								<SelectItem
									key={currency.label}
									value={currency.value}
									label={`${currency.symbol} - ${currency.label}`}
								/>
							))}
						</SelectContent>
					</Select>

					<Input
						value={data?.salary ? data.salary.toString() : ""}
						onChangeText={(val) => updateData?.({ salary: Number(val) })}
						className="flex-1"
						keyboardType="numeric"
						placeholder="Input your take-home pay"
					/>
				</View>
			</View>

			<Button
				onPress={onNext}
				disabled={!data?.salary || !data?.currency}
				className="w-full h-14 bg-accent-primary rounded-xl items-center"
			>
				<Text className="text-foreground text-lg font-jakarta">Next</Text>
			</Button>
		</View>
	);
}
