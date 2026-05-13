import { Pressable, Text, View } from "react-native";

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
			<View className="flex-row gap-3">
				{options.map((option) => {
					const isActive = value === option.value;

					return (
						<Pressable
							key={option.value}
							onPress={() => onValueChange(option.value)}
							className={cn("px-5 py-3 rounded-full border active:opacity-90", {
								"bg-accent-info border-accent-info": isActive,
								"bg-[#27272a] border-transparent": !isActive,
							})}
						>
							<Text
								className={cn("font-medium text-base", {
									"text-[#a1a1aa]": !isActive,
									"text-foreground": isActive,
								})}
							>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};
