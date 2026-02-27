import { View } from "react-native";

import HeartIcon from "../icons/HeartIcon";
import HeartCrackIcon from "../icons/HeartCrackIcon";
import { Text } from "../ui/text";
import { cn } from "@/lib/utils";

interface Props {
	status: "anchored" | "purchased" | "rejected";
	name: string;
	price: string;
	timeCost: number;
}

const BearingCard = ({ status, name, price, timeCost }: Props) => {
	return (
		<View className="flex flex-row gap-x-5 bg-secondary p-4 rounded-md">
			{status === "rejected" ? (
				<HeartIcon width={30} height={30} color={"#8A9A5B"} />
			) : (
				<HeartCrackIcon width={30} height={30} color={"#C75B5B"} />
			)}

			<View className="flex flex-col gap-y-3">
				<Text className="font-jakarta text-foreground">{name}</Text>

				<View className="flex flex-row gap-x-1">
					<Text
						className={cn("", {
							"text-accent-success line-through": status === "rejected",
						})}
					>
						{price}
					</Text>

					<Text>•</Text>

					<Text
						className={cn("", {
							"text-accent-success": status === "rejected",
						})}
					>
						{status === "rejected" ? `Saved ${timeCost} hours` : `${timeCost} ghost hours`}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default BearingCard;
