import { useState } from "react";
import { DeviceEventEmitter, View } from "react-native";
import { useRouter } from "expo-router";

import Welcome from "@/components/onboarding/Welcome";
import Salary from "@/components/onboarding/Salary";
import WorkHour from "@/components/onboarding/WorkHour";
import TimeWorth from "@/components/onboarding/TimeWorth";
import { db } from "@/db/client";
import { userSettings } from "@/db/schema";
import { OnboardingData } from "@/types/onboarding.type";

const STEPS = [Welcome, Salary, WorkHour, TimeWorth];
export default function Onboarding() {
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({
		salary: 0,
		currency: "USD",
		workDaysPerMonth: 22,
		workHoursPerDay: 8,
	});

	const Component = STEPS[currentStep];

	const updateData = (fields: Partial<OnboardingData>) => {
		setFormData((prev) => ({
			...prev,
			...fields,
		}));
	};

	const handleFinish = async () => {
		try {
			const totalHours = formData.workDaysPerMonth * formData.workHoursPerDay;
			const hourlyRate = totalHours > 0 ? formData.salary / totalHours : 0;

			await db
				.insert(userSettings)
				.values({
					id: 1,
					salary: formData.salary,
					currency: formData.currency,
					workDaysPerMonth: formData.workDaysPerMonth,
					workHoursPerDay: formData.workHoursPerDay,
					hourlyRate: hourlyRate,
					isOnboarded: true,
				})
				.onConflictDoUpdate({
					target: userSettings.id,
					set: {
						salary: formData.salary,
						currency: formData.currency,
						workDaysPerMonth: formData.workDaysPerMonth,
						workHoursPerDay: formData.workHoursPerDay,
						hourlyRate: hourlyRate,
						isOnboarded: true,
						updatedAt: new Date(),
					},
				});

			DeviceEventEmitter.emit("onboarding_completed");

			router.replace("/");
		} catch (error) {
			console.error(error);
		}
	};

	const handleNext = () => {
		if (currentStep < STEPS.length - 1) {
			setCurrentStep((prev) => prev + 1);
		} else {
			handleFinish();
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<Component onNext={handleNext} onBack={handleBack} data={formData} updateData={updateData} />
		</View>
	);
}
