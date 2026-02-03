import { View, Text } from "react-native";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";

import { cn } from "@/lib/utils";

export type DurationOption = {
	label: string;
	value: string;
};

interface AnchorDurationProps {
	options: DurationOption[];
	value: string;
	onValueChange: (val: string) => void;
}

export const AnchorDuration = ({ options, value, onValueChange }: AnchorDurationProps) => {
	return (
		<View className="gap-y-3">
			<RadioGroupPrimitive.Root
				value={value}
				onValueChange={onValueChange}
				className="flex-row gap-3"
			>
				{options.map((option) => {
					const isActive = value === option.value;

					return (
						<RadioGroupPrimitive.Item
							key={option.value}
							value={option.value}
							className={cn("px-5 py-3 rounded-full border transition-all active:opacity-90", {
								"bg-accent-info border-accent-info": isActive,
								"bg-[#27272a] border-transparent": !isActive,
							})}
						>
							<Text
								className={cn("font-mediumf font-jakarta text-base", {
									"text-[#a1a1aa]": !isActive,
									"text-foreground": isActive,
								})}
							>
								{option.label}
							</Text>
						</RadioGroupPrimitive.Item>
					);
				})}
			</RadioGroupPrimitive.Root>
		</View>
	);
};
