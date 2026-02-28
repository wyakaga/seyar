import { useState, useEffect } from "react";
import { differenceInMilliseconds, differenceInHours, differenceInMinutes } from "date-fns";

export const useAnchorProgress = (createdAt: Date | null, unlockedAt: Date | null) => {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	if (!createdAt || !unlockedAt) {
		return { progress: 0, timeLeft: "", isReady: false };
	}

	const totalDuration = differenceInMilliseconds(unlockedAt, createdAt);
	const elapsed = differenceInMilliseconds(now, createdAt);

	let progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;
	progress = Math.min(100, Math.max(0, progress));

	const hoursLeft = differenceInHours(unlockedAt, now);
	const minutesLeft = differenceInMinutes(unlockedAt, now) % 60;

	let timeLeft = "";
	if (hoursLeft > 24) {
		const days = Math.ceil(hoursLeft / 24);
		timeLeft = `${days}d left`;
	} else if (hoursLeft > 0) {
		timeLeft = `${hoursLeft}h left`;
	} else if (minutesLeft > 0) {
		timeLeft = `${minutesLeft}m left`;
	} else {
		timeLeft = "Ready";
	}

	return {
		progress,
		timeLeft,
		isReady: now >= unlockedAt,
	};
};
