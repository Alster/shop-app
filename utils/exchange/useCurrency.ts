"use client";

import { useEffect, useState } from "react";

import { CurrencyEnum } from "@/shop-shared/constants/exchange";

let currentValue: CurrencyEnum | null = CurrencyEnum.UAH;

const callbacks: ((value: CurrencyEnum) => void)[] = [];

function callCallbacks(newValue: CurrencyEnum) {
	if (currentValue === newValue) {
		return;
	}

	currentValue = newValue;
	for (const callback of callbacks) callback(newValue);
}

export default function useCurrency(currency: CurrencyEnum) {
	if (currentValue !== currency) {
		currentValue = currency;
	}

	const [currencyState, setCurrencyState] = useState<CurrencyEnum>(currentValue);

	useEffect(() => {
		callbacks.push(setCurrencyState);

		return () => {
			const index = callbacks.indexOf(setCurrencyState);
			callbacks.splice(index, 1);
		};
	}, []);

	return [currencyState, callCallbacks] as const;
}
