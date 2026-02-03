import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addHours, addDays, addWeeks } from "date-fns";

import { db } from "@/db/client";
import { items, userSettings } from "@/db/schema";
import { Label } from "../ui/label";
import { BottomSheet } from "../ui/bottom-sheet";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AnchorDuration, DurationOption } from "./AnchorDuration";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS: DurationOption[] = [
	{ label: "24 hours", value: "24h" },
	{ label: "3 days", value: "3d" },
	{ label: "1 week", value: "1w" },
];

const formSchema = z.object({
	name: z.string().min(1, "Item name is required"),
	price: z.string().regex(/^\d+$/, "Price must be a number"),
});

type FormValues = z.infer<typeof formSchema>;
type ItemStatus = "anchored" | "rejected" | "purchased";

interface Props {
	ref: RefObject<BottomSheetModal | null>;
	onItemAdded?: () => void;
}

const HomeBottomSheet = ({ ref, onItemAdded }: Props) => {
	const snapPoints = useMemo(() => ["85%"], []);

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "", price: "" },
	});

	const [duration, setDuration] = useState("24h");
	const [hourlyWage, setHourlyWage] = useState(0);
	const [status, setStatus] = useState<ItemStatus>("rejected");

	const watchedPrice = watch("price");

	const hoursOfLife = useMemo(() => {
		const price = Number(watchedPrice);
		if (!price || !hourlyWage) return "0.0";
		return (price / hourlyWage).toFixed(1);
	}, [watchedPrice, hourlyWage]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={1}
				style={[props.style, { backgroundColor: "transparent" }]}
			>
				<BlurView
					style={StyleSheet.absoluteFill}
					intensity={20}
					tint="dark"
					experimentalBlurMethod="dimezisBlurView"
				/>
			</BottomSheetBackdrop>
		),
		[]
	);

	const onSubmit = async (data: FormValues) => {
		const now = new Date();

		let unlockedAt = addHours(now, 24);

		if (duration === "3d") {
			unlockedAt = addDays(now, 3);
		} else if (duration === "1w") {
			unlockedAt = addWeeks(now, 1);
		}

		await db.insert(items).values({
			name: data.name,
			price: Number(data.price),
			timeCost: parseFloat(hoursOfLife),
			status,
			createdAt: now,
			unlockedAt: status === "anchored" ? unlockedAt : null,
		});

		reset();

		ref.current?.dismiss();

		if (onItemAdded) {
			onItemAdded();
		}
	};

	useEffect(() => {
		const fetchSetting = async () => {
			try {
				const setting = await db.select().from(userSettings).limit(1);

				if (setting.length > 0) {
					setHourlyWage(setting[0].hourlyRate);
				}
			} catch (e) {
				console.log("Error fetching settings", e);
			}
		};

		fetchSetting();
	}, []);

	return (
		<BottomSheet ref={ref} snapPoints={snapPoints} backdropComponent={renderBackdrop}>
			<View className="flex-1 gap-y-10">
				<Text className="text-foreground text-xl font-bold text-center">Anchor a new item</Text>

				<View className="flex gap-y-3">
					<View className="gap-1.5">
						<Label nativeID="name">Item name</Label>

						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Input the item name"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>

						{errors.name && (
							<Text className="text-accent-danger font-jakarta text-sm">{errors.name.message}</Text>
						)}
					</View>

					<View className="gap-1.5">
						<Label nativeID="price">Price</Label>

						<Controller
							control={control}
							name="price"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Input the price"
									keyboardType="numeric"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value.toString()}
								/>
							)}
						/>

						{errors.price && (
							<Text className="text-accent-danger font-jakarta text-sm">
								{errors.price.message}
							</Text>
						)}
					</View>
				</View>

				<View className="flex gap-y-5">
					<Text className="font-jakarta text-2xl text-foreground text-center">
						That&apos;s{" "}
						<Text className="text-accent-danger font-bold text-2xl">{hoursOfLife} hours</Text> of
						your life
					</Text>

					<View className="flex flex-row justify-center gap-x-3">
						<Button
							onPress={() => setStatus("rejected")}
							className={cn("w-1/3 h-10 rounded-lg items-center", {
								"bg-background border border-accent-success active:bg-accent-success/50":
									status !== "rejected",
								"bg-accent-success active:bg-accent-success/50": status === "rejected",
							})}
						>
							<Text
								className={cn("font-jakarta", {
									"text-foreground": status === "rejected",
									"text-accent-success": status !== "rejected",
								})}
							>
								Don&apos;t buy
							</Text>
						</Button>

						<Button
							onPress={() => setStatus("anchored")}
							className={cn("w-1/3 h-10 rounded-lg items-center", {
								"bg-background border border-accent-info active:bg-accent-info/50":
									status !== "anchored",
								"bg-accent-info active:bg-accent-info/50": status === "anchored",
							})}
						>
							<Text
								className={cn("font-jakarta", {
									"text-foreground": status === "anchored",
									"text-accent-info": status !== "anchored",
								})}
							>
								Unsure
							</Text>
						</Button>

						<Button
							onPress={() => setStatus("purchased")}
							className={cn("w-1/3 h-10 rounded-lg items-center", {
								"bg-background border border-secondary active:bg-secondary/50":
									status !== "purchased",
								"bg-secondary active:bg-secondary/50 border-muted": status === "purchased",
							})}
						>
							<Text
								className={cn("font-jakarta", {
									"text-foreground": status === "purchased",
									"text-muted": status !== "purchased",
								})}
							>
								Buy it
							</Text>
						</Button>
					</View>

					{status === "anchored" && (
						<View className="flex gap-y-3">
							<Text className="font-jakarta text-foreground">Anchor duration</Text>

							<AnchorDuration
								options={DURATION_OPTIONS}
								value={duration}
								onValueChange={setDuration}
							/>
						</View>
					)}

					<Button
						className={cn("w-full h-14  rounded-lg items-center", {
							"bg-accent-success active:bg-accent-success/50": status === "rejected",
							"bg-accent-info active:bg-accent-info/50": status === "anchored",
							"bg-secondary active:bg-secondary/50 border-muted": status === "purchased",
						})}
						onPress={handleSubmit(onSubmit)}
					>
						<Text className="text-foreground font-jakarta">
							{status === "rejected"
								? `Reclaim ${hoursOfLife} hours`
								: status === "anchored"
									? "Drop anchor"
									: "Confirm purchase"}
						</Text>
					</Button>
				</View>
			</View>
		</BottomSheet>
	);
};
export default HomeBottomSheet;
