"use client";

import { useState } from "react";

import { useRouter } from "@/i18n/routing";
import { CURRENCIES, CURRENCY_TO_SYMBOL, CurrencyEnum } from "@/shop-shared/constants/exchange";
import { setCookie } from "@/utils/exchange/cookieClientHelper";

interface IDropdownListItemInterface {
	key: string;
	title: string;
	selected: boolean;
}

const CURRENCIES_LIST: IDropdownListItemInterface[] = CURRENCIES.map((currency) => ({
	key: currency,
	title: `${currency} ${CURRENCY_TO_SYMBOL[currency]}`,
	selected: false,
}));

export default function CurrencySelect({
	currency,
	className,
}: {
	currency: CurrencyEnum;
	className?: string;
}) {
	const router = useRouter();

	const getCurrencyByKey = (key: string) => {
		const foundCurrentLanguage = CURRENCIES_LIST.find((item) => item.key === key);
		if (!foundCurrentLanguage) {
			throw new Error(`Currency ${currency} not found in CURRENCIES_LIST`);
		}
		return foundCurrentLanguage;
	};

	const initialCurrency = getCurrencyByKey(currency);
	initialCurrency.selected = true;
	const [selectedCurrency, setSelectedCurrency] =
		useState<IDropdownListItemInterface>(initialCurrency);

	const selectCurrency = async (key: string) => {
		selectedCurrency.selected = false;
		const foundCurrentCurrency = getCurrencyByKey(key);
		foundCurrentCurrency.selected = true;
		setSelectedCurrency(foundCurrentCurrency);
		await setCookie("currency", foundCurrentCurrency.key, 30);
		router.refresh();
	};

	return (
		<div className={className}>
			<select
				className="unicorn-background"
				onChange={async (event) => selectCurrency(event.target.value)}
			>
				{CURRENCIES_LIST.map((item) => (
					<option key={item.key} value={item.key} selected={item.selected}>
						{item.title}
					</option>
				))}
			</select>
		</div>
	);
}
