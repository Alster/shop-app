"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

import { useRouter } from "@/navigation";
import { setCookie } from "@/shop-exchange-shared/cookieClientHelper";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CURRENCIES, CURRENCY_TO_SYMBOL, CurrencyEnum } from "@/shop-shared/constants/exchange";

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
	exchangeState,
	currency,
	className,
}: {
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
	className?: string;
}) {
	const router = useRouter();

	const [isListOpen, setIsListOpen] = useState(false);
	const toggleList = () => {
		setIsListOpen(!isListOpen);
	};

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

	const selectCurrency = (key: string) => {
		selectedCurrency.selected = false;
		const foundCurrentCurrency = getCurrencyByKey(key);
		foundCurrentCurrency.selected = true;
		setSelectedCurrency(foundCurrentCurrency);
		setCookie("currency", foundCurrentCurrency.key, 30);
		router.refresh();
		toggleList();
	};

	const drawItem = (item: IDropdownListItemInterface) => {
		return (
			<Fragment>
				<div className="p-1">{item.title}</div>
			</Fragment>
		);
	};

	return (
		<div className={className}>
			{!isListOpen && (
				<button className="" type="button" onClick={toggleList}>
					<div className="flex flex-wrap text-white">
						<ChevronDownIcon className="inline-block h-7 w-7 pt-1 text-white" />{" "}
						{drawItem(selectedCurrency)}
					</div>
				</button>
			)}
			{isListOpen && (
				<div className="absolute border-2 border-black bg-white dark:border-white dark:bg-black">
					{CURRENCIES_LIST.map((item) => (
						<div key={item.key}>
							<button
								className="flex flex-wrap hover:bg-gray-500"
								onClick={() => selectCurrency(item.key)}
							>
								{drawItem(item)}
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
