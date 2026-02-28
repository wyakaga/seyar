import { View } from "react-native";

import { Progress } from "../ui/progress";
import { Text } from "../ui/text";
import LockIcon from "../icons/LockIcon";
import AnchorIcon from "../icons/AnchorIcon";
import { useAnchorProgress } from "@/hooks/useAnchorProgress";
import OpenedLockIcon from "../icons/OpenedLockIcon";
import { Button } from "../ui/button";

interface Props {
	name: string;
	price: string;
	createdAt: Date | null;
	unlockedAt: Date | null;
	onDecide: () => void;
}

const AnchoredCard = ({ name, price, createdAt, unlockedAt, onDecide }: Props) => {
	const { progress, timeLeft, isReady } = useAnchorProgress(createdAt, unlockedAt);

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

								<Text className="font-jakarta text-accent-info text-sm">{timeLeft}</Text>
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
				>
					<Text className="text-background">Ready to Decide</Text>
				</Button>
			) : (
				<View className="flex flex-col gap-y-1">
					<View className="flex flex-row justify-end">
						<Text className="font-jakarta text-sm text-accent-info font-medium">{`${progress.toFixed(1)}%`}</Text>
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
