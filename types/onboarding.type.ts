export type OnboardingData = {
	salary: number;
	currency: string;
	workDaysPerMonth: number;
	workHoursPerDay: number;
};

export type OnboardingProps = {
	onNext: () => void;
	onBack?: () => void;
	data?: OnboardingData;
	updateData?: (fields: Partial<OnboardingData>) => void;
};
