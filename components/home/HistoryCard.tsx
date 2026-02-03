import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { differenceInDays, differenceInHours } from "date-fns";

import AnchorIcon from "../icons/AnchorIcon";
import CreditCardIcon from "../icons/CreditCardIcon";
import ShieldIcon from "../icons/ShieldIcon";
import { Text } from "../ui/text";
import { db } from "@/db/client";
import { userSettings } from "@/db/schema";
import CURRENCIES from "@/constants/currencies";

interface Props {
	status: "anchored" | "purchased" | "rejected";
	name: string;
	price: number;
	unlockedAt: Date | null;
	timeCost?: number;
}

const HistoryCard = ({ status, name, price, unlockedAt, timeCost }: Props) => {
	const [currency, setCurrency] = useState<string | null>(null);

	const formattedPrice = useMemo(() => {
		const currencyCode = CURRENCIES.find((c) => c.value === currency);
		const currencySymbol = currencyCode ? currencyCode.symbol : currency;

		if (price >= 1_000_000_000) {
			return `${currencySymbol} ${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
		}

		if (price >= 1_000_000) {
			return `${currencySymbol} ${(price / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
		}

		if (price >= 1_000) {
			return `${currencySymbol} ${(price / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
		}

		return `${currencySymbol} ${price}`;
	}, [currency, price]);

	const formattedTimeLeft = useMemo(() => {
		if (!unlockedAt) return "";

		const now = new Date();
		const hours = differenceInHours(unlockedAt, now);

		if (hours > 24) {
			const days = differenceInDays(unlockedAt, now);
			return `${days}d left`;
		}

		if (hours <= 0) return "Ready";
		return `${hours}h left`;
	}, [unlockedAt]);

	useEffect(() => {
		const fetchSetting = async () => {
			try {
				const setting = await db.select().from(userSettings).limit(1);

				if (setting.length > 0) {
					setCurrency(setting[0].currency);
				}
			} catch (e) {
				console.log("Error fetching settings", e);
			}
		};

		fetchSetting();
	}, []);

	return (
		<View className="flex flex-row justify-between items-center p-3 rounded-md bg-secondary">
			<View className="flex flex-row gap-x-3 items-center">
				{status === "anchored" ? (
					<AnchorIcon width={28} height={28} color={"#4E6A8A"} />
				) : status === "purchased" ? (
					<CreditCardIcon width={28} height={28} color={"#C75B5B"} />
				) : (
					<ShieldIcon width={28} height={28} color={"#8A9A5B"} />
				)}

				<View className="flex flex-col gap-y-3">
					<Text className="text-foreground font-jakarta">{name}</Text>

					<View className="flex flex-row gap-x-3 items-center">
						{status === "anchored" ? (
							<Text className="text-sm text-accent-info font-medium font-jakarta">
								{formattedTimeLeft}
							</Text>
						) : status === "purchased" ? (
							<Text className="text-sm text-accent-danger font-medium font-jakarta">
								{`-${timeCost?.toFixed(1)} hours`}
							</Text>
						) : (
							<Text className="text-sm text-accent-success font-medium font-jakarta">
								{`+${timeCost?.toFixed(1)} hours saved`}
							</Text>
						)}
					</View>
				</View>
			</View>

			<Text className="font-jakarta font-medium text-lg">{formattedPrice}</Text>
		</View>
	);
};
export default HistoryCard;
