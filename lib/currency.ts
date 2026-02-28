import CURRENCIES from "@/constants/currencies";

export const formatCompactCurrency = (value: number, currencyCode: string | null = "IDR") => {
	const currency = CURRENCIES.find((c) => c.value === currencyCode);
	const symbol = currency ? currency.symbol : currencyCode;

	if (value >= 1_000_000_000) {
		return `${symbol} ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
	}
	if (value >= 1_000_000) {
		return `${symbol} ${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
	}
	if (value >= 1_000) {
		return `${symbol} ${(value / 1_000).toFixed(0)}k`;
	}

	return `${symbol} ${value}`;
};
